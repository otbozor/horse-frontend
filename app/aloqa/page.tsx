'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Backend API bilan bog'lash
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8 sm:mb-12 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
                    Biz bilan bog'laning
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Savolingiz bormi? Taklif yoki shikoyatingiz bormi? Biz bilan bog'laning!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                {/* Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                    Telefon
                                </h3>
                                <a href="tel:+998901234567" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
                                    +998 (90) 123-45-67
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                    Email
                                </h3>
                                <a href="mailto:info@otbozor.uz" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
                                    info@otbozor.uz
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                    Manzil
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Toshkent shahri<br />
                                    Yunusobod tumani
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
                        <MessageSquare className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Telegram orqali
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Tezroq javob olish uchun Telegram kanalimizga qo'shiling
                        </p>
                        <a
                            href="https://t.me/otbozor_uz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary w-full"
                        >
                            Telegram kanalga o'tish
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    Xabaringiz yuborildi!
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Tez orada siz bilan bog'lanamiz
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Ismingiz *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="Ismingizni kiriting"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Telefon</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="+998 (__) ___-__-__"
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Mavzu *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="Xabar mavzusi"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Xabar *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="input h-40 resize-none"
                                        placeholder="Xabaringizni yozing..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary btn-lg w-full md:w-auto"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Yuborilmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Xabar yuborish
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
