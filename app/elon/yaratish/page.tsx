'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { ChevronRight, ChevronLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FileUpload } from '@/components/ui/FileUpload';
import { getRegions, getRegionsWithDistricts, getBreeds, createListingDraft, attachMediaToListing, submitListingForReview, Region, Breed, District } from '@/lib/api';

const steps = [
    { id: 1, title: 'Asosiy ma\'lumotlar' },
    { id: 2, title: 'Joylashuv' },
    { id: 3, title: 'Narx va holat' },
    { id: 4, title: 'Media' },
    { id: 5, title: 'Ko\'rib chiqish' },
];

export default function CreateListingPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');
    const [regions, setRegions] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [breeds, setBreeds] = useState<Breed[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        purpose: '',
        breedId: '',
        gender: '',
        ageYears: '',
        color: '',
        regionId: '',
        districtId: '',
        priceAmount: '',
        priceCurrency: 'UZS',
        hasPassport: false,
        hasVaccine: false,
        media: [] as Array<{ url: string; type: 'IMAGE' | 'VIDEO'; sortOrder: number }>,
    });

    const [draftId, setDraftId] = useState<string | null>(null);

    // Clean up any blob URLs on mount (in case of page refresh)
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter(m => !m.url.startsWith('blob:'))
        }));
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        async function loadData() {
            const [regionsData, breedsData] = await Promise.all([
                getRegionsWithDistricts(),
                getBreeds(),
            ]);
            setRegions(regionsData);
            setBreeds(breedsData);
        }
        loadData();
    }, []);

    // Update districts when region changes
    useEffect(() => {
        if (formData.regionId) {
            const region = regions.find(r => r.id === formData.regionId);
            setDistricts(region?.districts || []);
        } else {
            setDistricts([]);
        }
    }, [formData.regionId, regions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const saveDraft = async () => {
        setIsSubmitting(true);
        try {
            // Validate required fields
            if (!formData.title || !formData.regionId || !formData.priceAmount) {
                setError('Iltimos barcha majburiy maydonlarni to\'ldiring');
                return false;
            }

            // Prepare data - remove media field and empty values
            const { media, ...dataWithoutMedia } = formData;

            const data = {
                title: dataWithoutMedia.title,
                description: dataWithoutMedia.description || undefined,
                purpose: dataWithoutMedia.purpose || undefined,
                breedId: dataWithoutMedia.breedId || undefined,
                gender: dataWithoutMedia.gender || undefined,
                ageYears: dataWithoutMedia.ageYears ? Number(dataWithoutMedia.ageYears) : undefined,
                color: dataWithoutMedia.color || undefined,
                regionId: dataWithoutMedia.regionId,
                districtId: dataWithoutMedia.districtId || undefined,
                priceAmount: Number(dataWithoutMedia.priceAmount),
                priceCurrency: dataWithoutMedia.priceCurrency,
                hasPassport: dataWithoutMedia.hasPassport,
                hasVaccine: dataWithoutMedia.hasVaccine,
            };

            if (!draftId) {
                const listing = await createListingDraft(data);
                setDraftId(listing.id);
            } else {
                // Update mock - in real app would verify logic
                // await updateListingDraft(draftId, data);
            }
            setError('');
            return true;
        } catch (error: any) {
            console.error('Failed to save draft', error);
            setError(error.message || 'E\'lon saqlanmadi. Iltimos qayta urinib ko\'ring.');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!draftId) {
            const saved = await saveDraft();
            if (!saved) return;
        }

        setIsSubmitting(true);
        try {
            // 1. Attach media
            if (formData.media.length > 0 && draftId) {
                await attachMediaToListing(draftId, formData.media);
            }

            // 2. Submit
            if (draftId) {
                await submitListingForReview(draftId);
            }

            router.push('/profil/elonlarim?success=true');
        } catch (error) {
            console.error('Failed to submit', error);
            alert('Xatolik yuz berdi');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">E'lon joylash</h1>
                <p className="text-slate-500">Otingizni sotish uchun ma'lumotlarni to'ldiring</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="font-medium text-red-900 mb-1">Xatolik</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <button
                        onClick={() => setError('')}
                        className="text-red-400 hover:text-red-600"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10" />
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-500 transition-all duration-300 -z-10"
                    style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                />

                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                        <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
              ${currentStep >= step.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white border-2 border-slate-200 text-slate-400'}
            `}>
                            {step.id}
                        </div>
                        <span className={`text-xs font-medium hidden sm:block ${currentStep >= step.id ? 'text-primary-600' : 'text-slate-400'}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">

                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <Input
                            label="Sarlavha"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Masalan: Karabayir oti sotiladi"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Maqsad"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                options={[
                                    { label: "Ko'pkari", value: 'KOPKARI' },
                                    { label: 'Sport', value: 'SPORT' },
                                    { label: 'Sayr', value: 'SAYR' },
                                    { label: 'Ishchi', value: 'ISHCHI' },
                                    { label: 'Naslchilik', value: 'NASLCHILIK' },
                                ]}
                            />

                            <Select
                                label="Zoti"
                                name="breedId"
                                value={formData.breedId}
                                onChange={handleChange}
                                options={breeds.map(b => ({ label: b.name, value: b.id }))}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Jinsi"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[
                                    { label: 'Aygir', value: 'AYGIR' },
                                    { label: 'Biya', value: 'BIYA' },
                                    { label: 'Axta', value: 'AXTA' },
                                ]}
                            />

                            <Input
                                label="Yoshi (yil)"
                                type="number"
                                name="ageYears"
                                value={formData.ageYears}
                                onChange={handleChange}
                                placeholder="Masalan: 4"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Rangi"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="Masalan: Qora, Jiyron"
                            />
                        </div>

                        <div>
                            <label className="label">Tavsif</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input h-32 resize-none"
                                placeholder="Ot haqida batafsil ma'lumot..."
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <Select
                            label="Viloyat"
                            name="regionId"
                            value={formData.regionId}
                            onChange={handleChange}
                            options={regions.map(r => ({ label: r.nameUz, value: r.id }))}
                        />

                        <Select
                            label="Tuman"
                            name="districtId"
                            value={formData.districtId}
                            onChange={handleChange}
                            options={districts.map(d => ({ label: d.nameUz, value: d.id }))}
                            disabled={!formData.regionId}
                        />
                    </div>
                )}

                {/* Step 3: Price & Features */}
                {currentStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Narx"
                                type="number"
                                name="priceAmount"
                                value={formData.priceAmount}
                                onChange={handleChange}
                                placeholder="0"
                            />

                            <Select
                                label="Valyuta"
                                name="priceCurrency"
                                value={formData.priceCurrency}
                                onChange={handleChange}
                                options={[
                                    { label: "So'm (UZS)", value: 'UZS' },
                                    { label: 'Dollar (USD)', value: 'USD' },
                                ]}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="label">Qo'shimcha ma'lumotlar</label>

                            <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary-300 transition-all">
                                <input
                                    type="checkbox"
                                    name="hasPassport"
                                    checked={formData.hasPassport}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="text-slate-900 font-medium text-base">Hujjati (pasporti) bor</span>
                            </label>

                            <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary-300 transition-all">
                                <input
                                    type="checkbox"
                                    name="hasVaccine"
                                    checked={formData.hasVaccine}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="text-slate-900 font-medium text-base">Emlangan (vaktsina qilingan)</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Step 4: Media */}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <FileUpload
                            key="listing-media-upload"
                            onFilesChange={(files) => setFormData(prev => ({ ...prev, media: files }))}
                            maxFiles={8}
                            initialFiles={formData.media.filter(m => !m.url.startsWith('blob:'))}
                        />
                    </div>
                )}

                {/* Step 5: Preview */}
                {currentStep === 5 && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Media Preview */}
                        {formData.media.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Yuklangan rasmlar ({formData.media.length})</h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                    {formData.media.slice(0, 8).map((media, idx) => (
                                        <div key={idx} className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                                            {media.type === 'VIDEO' ? (
                                                <video src={media.url} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={media.url} alt={`Rasm ${idx + 1}`} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl space-y-4">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-4">{formData.title}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Narx</span>
                                    <span className="font-semibold text-primary-600 dark:text-primary-400 text-lg">{formData.priceAmount} {formData.priceCurrency}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Joylashuv</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {regions.find(r => r.id === formData.regionId)?.nameUz}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Zoti</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {breeds.find(b => b.id === formData.breedId)?.name || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-slate-500 dark:text-slate-400 text-sm mb-1">Rasmlar</span>
                                    <span className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                        {formData.media.length} ta fayl
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                            E'lonni chop etish orqali siz foydalanish shartlariga rozilik bildirasiz.
                            Moderatorlar e'lonni tekshirib chiqqandan so'ng u saytda ko'rinadi.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`btn btn-outline ${currentStep === 1 ? 'invisible' : ''}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Ortga
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={async () => {
                                // Validate current step before moving forward
                                if (currentStep === 1 && !formData.title) {
                                    setError('Iltimos sarlavha kiriting');
                                    return;
                                }
                                if (currentStep === 2 && !formData.regionId) {
                                    setError('Iltimos viloyatni tanlang');
                                    return;
                                }
                                if (currentStep === 3 && !formData.priceAmount) {
                                    setError('Iltimos narx kiriting');
                                    return;
                                }

                                // Save draft before moving to next step
                                if (currentStep === 3) {
                                    const saved = await saveDraft();
                                    if (!saved) return;
                                }

                                nextStep();
                            }}
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Keyingi
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Chop etish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
