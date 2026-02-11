'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { getAdminEvents, createAdminEvent, updateAdminEvent, publishAdminEvent, deleteAdminEvent } from '@/lib/admin-api';
import { getRegionsWithDistricts, Region } from '@/lib/api';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Save, Calendar, MapPin } from 'lucide-react';
import { GiHorseshoe } from 'react-icons/gi';

interface Event {
    id: string;
    title: string;
    slug: string;
    startsAt: string;
    organizerName: string;
    prizePool?: number;
    status: string;
    region: { nameUz: string };
    district?: { nameUz: string };
}

const EMPTY_FORM = {
    title: '',
    slug: '',
    description: '',
    startsAt: '',
    endsAt: '',
    regionId: '',
    districtId: '',
    addressText: '',
    mapUrl: '',
    organizerName: '',
    contactTelegram: '',
    prizePool: '',
    rules: '',
};

function slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminKopkariPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [evRes, regRes] = await Promise.all([
                getAdminEvents(),
                getRegionsWithDistricts(),
            ]);
            setEvents(Array.isArray(evRes.data) ? evRes.data : []);
            setRegions(regRes);
        } catch (e) {
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title' && !editId) updated.slug = slugify(value);
            if (name === 'regionId') updated.districtId = '';
            return updated;
        });
    };

    const openCreate = () => {
        setEditId(null);
        setForm({ ...EMPTY_FORM });
        setError('');
        setShowForm(true);
    };

    const openEdit = (ev: Event) => {
        setEditId(ev.id);
        setForm({
            title: ev.title,
            slug: ev.slug,
            description: (ev as any).description || '',
            startsAt: ev.startsAt ? ev.startsAt.slice(0, 16) : '',
            endsAt: (ev as any).endsAt ? (ev as any).endsAt.slice(0, 16) : '',
            regionId: (ev as any).regionId || '',
            districtId: (ev as any).districtId || '',
            addressText: (ev as any).addressText || '',
            mapUrl: (ev as any).mapUrl || '',
            organizerName: ev.organizerName,
            contactTelegram: (ev as any).contactTelegram || '',
            prizePool: ev.prizePool ? String(ev.prizePool) : '',
            rules: (ev as any).rules || '',
        });
        setError('');
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.title || !form.startsAt || !form.regionId || !form.organizerName) {
            setError("Sarlavha, sana, viloyat va tashkilotchi majburiy");
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload: any = {
                ...form,
                prizePool: form.prizePool ? Number(form.prizePool) : undefined,
                endsAt: form.endsAt || undefined,
                districtId: form.districtId || undefined,
                addressText: form.addressText || undefined,
                contactTelegram: form.contactTelegram || undefined,
                rules: form.rules || undefined,
                description: form.description || undefined,
            };
            if (editId) {
                await updateAdminEvent(editId, payload);
            } else {
                await createAdminEvent(payload);
            }
            setShowForm(false);
            await loadData();
        } catch (e: any) {
            setError(e.message || 'Xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async (id: string) => {
        if (!confirm("Tadbirni nashr qilasizmi?")) return;
        try {
            await publishAdminEvent(id);
            await loadData();
        } catch (e: any) {
            alert('Xatolik: ' + e.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tadbirni o'chirishni xohlaysizmi?")) return;
        try {
            await deleteAdminEvent(id);
            await loadData();
        } catch (e: any) {
            alert('Xatolik: ' + e.message);
        }
    };

    const selectedRegion = regions.find(r => r.id === form.regionId);
    const districts = selectedRegion?.districts || [];

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            DRAFT: 'bg-slate-100 text-slate-700',
            PUBLISHED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700',
            COMPLETED: 'bg-blue-100 text-blue-700',
        };
        const labels: Record<string, string> = {
            DRAFT: 'Qoralama', PUBLISHED: 'Nashr', CANCELLED: 'Bekor', COMPLETED: 'Tugagan',
        };
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] || 'bg-slate-100 text-slate-600'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ko'pkari Tadbirlari</h1>
                    <p className="text-slate-500 text-sm">Barcha ko'pkari va ot musobaqalarini boshqarish</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Yangi tadbir
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {editId ? 'Tadbirni tahrirlash' : 'Yangi tadbir qo\'shish'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Sarlavha *</label>
                                    <input name="title" value={form.title} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Ko'pkari musobaqasi nomi" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                                    <input name="slug" value={form.slug} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="musobaqa-nomi" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tashkilotchi *</label>
                                    <input name="organizerName" value={form.organizerName} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="Tashkilotchi ismi" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Boshlanish sanasi *</label>
                                    <input type="datetime-local" name="startsAt" value={form.startsAt} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tugash sanasi</label>
                                    <input type="datetime-local" name="endsAt" value={form.endsAt} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Viloyat *</label>
                                    <select name="regionId" value={form.regionId} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                                        <option value="">Viloyatni tanlang</option>
                                        {regions.map(r => <option key={r.id} value={r.id}>{r.nameUz}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tuman</label>
                                    <select name="districtId" value={form.districtId} onChange={handleChange}
                                        disabled={!form.regionId}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400">
                                        <option value="">Tumanni tanlang</option>
                                        {districts.map(d => <option key={d.id} value={d.id}>{d.nameUz}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Manzil matni</label>
                                    <input name="addressText" value={form.addressText} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="To'liq manzil" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Xarita URL (Google Maps embed)</label>
                                    <input name="mapUrl" value={form.mapUrl} onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent ${form.mapUrl && !form.mapUrl.includes('/maps/embed') ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                                        placeholder="https://www.google.com/maps/embed?pb=..." />
                                    {form.mapUrl && !form.mapUrl.includes('/maps/embed') && (
                                        <p className="text-xs text-red-600 mt-1">
                                            ⚠️ Noto'g'ri URL. Google Maps → Ulashish → Xaritani joylash → &lt;iframe&gt; ichidagi <strong>src</strong> qiymatini kiriting.
                                        </p>
                                    )}
                                    {!form.mapUrl && (
                                        <p className="text-xs text-slate-400 mt-1">
                                            Google Maps → Ulashish → Xaritani joylash (Embed) → src="..." qiymatini ko'chiring
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Telegram kontakt</label>
                                    <input name="contactTelegram" value={form.contactTelegram} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="username (@ siz)" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Sovrin jamg'armasi (so'm)</label>
                                    <input type="number" name="prizePool" value={form.prizePool} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        placeholder="0" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tavsif</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                        placeholder="Tadbir haqida batafsil..." />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Qoidalar</label>
                                    <textarea name="rules" value={form.rules} onChange={handleChange} rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                                        placeholder="Musobaqa qoidalari..." />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-slate-200">
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {editId ? 'Saqlash' : 'Yaratish'}
                            </button>
                            <button onClick={() => setShowForm(false)}
                                className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                                Bekor qilish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mb-3 flex justify-center"><GiHorseshoe className="w-12 h-12 text-slate-300" /></div>
                        <p className="text-slate-500">Hozircha tadbirlar yo'q</p>
                        <button onClick={openCreate} className="mt-4 text-amber-600 hover:underline text-sm">
                            Birinchi tadbirni qo'shing
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tadbir</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Sana</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Joylashuv</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Holat</th>
                                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {events.map((ev) => (
                                <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{ev.title}</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">{ev.organizerName}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(ev.startsAt).toLocaleDateString('uz-UZ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {ev.region?.nameUz}{ev.district && `, ${ev.district.nameUz}`}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{statusBadge(ev.status)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {ev.status === 'DRAFT' && (
                                                <button onClick={() => handlePublish(ev.id)}
                                                    title="Nashr qilish"
                                                    className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            {ev.status === 'PUBLISHED' && (
                                                <button onClick={() => updateAdminEvent(ev.id, { status: 'DRAFT' }).then(loadData)}
                                                    title="Qoralamaga qaytarish"
                                                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                                    <EyeOff className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => openEdit(ev)}
                                                title="Tahrirlash"
                                                className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(ev.id)}
                                                title="O'chirish"
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}
