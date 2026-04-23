'use client';

import { useState } from 'react';
import { AlertTriangle, Check, MessageCircle, Phone } from 'lucide-react';

interface Props {
    telegramUsername: string;
    phone?: string;
}

export function ListingInteractions({ telegramUsername, phone }: Props) {
    const [phoneCopied, setPhoneCopied] = useState(false);

    const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const handlePhoneClick = async (e: React.MouseEvent) => {
        if (isMobile()) return;
        e.preventDefault();
        if (!phone) return;
        try {
            await navigator.clipboard.writeText(phone);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = phone;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        setPhoneCopied(true);
        setTimeout(() => setPhoneCopied(false), 2000);
    };

    return (
        <>
            {/* Contact Buttons */}
            <div className="space-y-3 mb-6">
                <a
                    href={`https://t.me/${telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-[#2AABEE] hover:bg-[#229ED9] text-white rounded-xl font-semibold text-base transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    Telegramdan bog&apos;lanish
                </a>

                {phone && (
                    <>
                        <a
                            href={`tel:${phone}`}
                            onClick={handlePhoneClick}
                            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-base transition-colors"
                        >
                            {phoneCopied ? (
                                <><Check className="w-5 h-5" /> Raqam nusxalandi!</>
                            ) : (
                                <><Phone className="w-5 h-5" /> Telefon qilish</>
                            )}
                        </a>

                        {/* Otbozor.uz dan deb ayting */}
                        <div className="bg-yellow-200 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-700 rounded-lg p-3 shadow-sm">
                            <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                💡 Aloqaga chiqqanda{' '}
                                <span className="font-bold text-yellow-700 dark:text-yellow-400">
                                    "Otbozor.uz dan"
                                </span>{' '}
                                deb ayting
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Shikoyat */}
            <div className="flex justify-end">
                <a
                    href="/aloqa"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <AlertTriangle className="w-4 h-4" />
                    Shikoyat
                </a>
            </div>
        </>
    );
}
