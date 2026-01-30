'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Save, Loader2 } from 'lucide-react';
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
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            const data = {
                ...formData,
                ageYears: formData.ageYears ? Number(formData.ageYears) : undefined,
                priceAmount: Number(formData.priceAmount),
            };

            if (!draftId) {
                const listing = await createListingDraft(data);
                setDraftId(listing.id);
            } else {
                // Update mock - in real app would verify logic
                // await updateListingDraft(draftId, data);
            }
            return true;
        } catch (error) {
            console.error('Failed to save draft', error);
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

            router.push('/profil/elonnar?success=true');
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

                            <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    name="hasPassport"
                                    checked={formData.hasPassport}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span>Hujjati (pasporti) bor</span>
                            </label>

                            <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    name="hasVaccine"
                                    checked={formData.hasVaccine}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span>Emlangan (vaktsina qilingan)</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Step 4: Media */}
                {currentStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                        <FileUpload
                            onFilesChange={(files) => setFormData(prev => ({ ...prev, media: files }))}
                            maxFiles={8}
                        />
                    </div>
                )}

                {/* Step 5: Preview */}
                {currentStep === 5 && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-slate-50 p-4 rounded-xl space-y-4 text-sm">
                            <h3 className="font-bold text-lg text-slate-900">{formData.title}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-slate-500">Narx</span>
                                    <span className="font-medium text-primary-600">{formData.priceAmount} {formData.priceCurrency}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-500">Joylashuv</span>
                                    <span className="font-medium">
                                        {regions.find(r => r.id === formData.regionId)?.nameUz}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-slate-500">Zoti</span>
                                    <span className="font-medium">
                                        {breeds.find(b => b.id === formData.breedId)?.name || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-slate-500">Rasmlar</span>
                                    <span className="font-medium flex items-center gap-1">
                                        {formData.media.length} ta fayl
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 text-center">
                            E'lonni chop etish orqali siz foydalanish shartlariga rozilik bildirasiz.
                            Moderatorlar e'lonni tekshirib chiqqandan so'ng u saytda ko'rinadi.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`btn btn-ghost ${currentStep === 1 ? 'invisible' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Ortga
                    </button>

                    {currentStep < 5 ? (
                        <button
                            onClick={() => {
                                saveDraft();
                                nextStep();
                            }}
                            className="btn btn-primary"
                        >
                            Keyingi
                            <ChevronRight className="w-4 h-4" />
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
