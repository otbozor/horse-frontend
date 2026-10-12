import type { Metadata } from 'next';
import Image from 'next/image';
import { Bell, CheckCircle2, Download, MessageCircle, ShieldCheck, Smartphone, Zap } from 'lucide-react';

// APK va versiya yagona manbadan — app.otbozor.uz (Mini App bilan birga deploy qilinadi)
const APP_ORIGIN = 'https://app.otbozor.uz';
// Backend yuklab olishni sanaydi va APK ga yo'naltiradi
const APK_URL = 'https://api.otbozor.uz/api/app/download?src=page';

export const metadata: Metadata = {
    title: 'Android ilovani yuklab olish',
    description:
        "Otbozor Android ilovasi: ot sotish va sotib olish, ko'pkari taqvimi, sotuvchiga yozish — telefoningizda. Bepul yuklab oling.",
    alternates: { canonical: '/android-yuklash' },
    openGraph: {
        title: 'Otbozor — Android ilova',
        description: "Ot sotish va sotib olish, ko'pkari taqvimi — Android telefoningizda.",
        url: '/android-yuklash',
    },
};

// Versiyani soatiga bir marta yangilaymiz
export const revalidate = 3600;

async function getVersion(): Promise<string | null> {
    try {
        const res = await fetch(`${APP_ORIGIN}/app/version.json`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const v = (await res.json()) as { latest?: string };
        return v.latest ?? null;
    } catch {
        return null;
    }
}

const FEATURES = [
    { icon: Zap, title: "E'lon 2 daqiqada", text: "Rasm, narx, joylashuv — telefoningizdan bir zumda e'lon joylang." },
    { icon: MessageCircle, title: 'Sotuvchiga yozing', text: "Qo'ng'iroq qiling, Telegram'da yoki raqamsiz bot orqali yozing." },
    { icon: Bell, title: "Ko'pkari taqvimi", text: "Viloyatlardagi ko'pkarilar, «Boraman» — bot o'zi eslatadi." },
    { icon: ShieldCheck, title: 'Parolsiz kirish', text: 'Telegram akkauntingiz bilan bir bosishda kirasiz.' },
];

const STEPS = [
    '«Android uchun yuklab olish» tugmasini bosing',
    "Telefon so'rasa — brauzerga «noma'lum ilovalarni o'rnatish»ga ruxsat bering",
    "Yuklangan faylni oching va «O'rnatish» ni bosing",
    "Otbozor'ni oching va «Telegram orqali kirish» ni bosing",
];

export default async function AndroidDownloadPage() {
    const version = await getVersion();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero */}
            <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
                        <div className="text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-5">
                                <Smartphone className="w-4 h-4" />
                                Android ilova
                            </span>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
                                Otbozor endi telefoningizda
                            </h1>
                            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                                Ot sotish va sotib olish, ko&apos;pkari taqvimi va sotuvchilar bilan aloqa — bitta ilovada. Bepul.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                                <a
                                    href={APK_URL}
                                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold shadow-lg shadow-primary-600/20 transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    Android uchun yuklab olish
                                </a>
                                <a
                                    href="https://t.me/otbozor_bot/app"
                                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Telegram&apos;da ochish
                                </a>
                            </div>
                            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                                {version ? `Versiya ${version} · ` : ''}Android 7.0 va undan yuqori · ~4,5 MB
                            </p>

                            {/* Kompyuterdan kirganlar uchun: telefon bilan skanerlash */}
                            <div className="hidden lg:flex items-center gap-4 mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-sm">
                                <Image src="/android/qr.svg" alt="Yuklab olish sahifasi QR kodi" width={96} height={96} className="rounded-lg bg-white p-1" />
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Kompyuterdasizmi? Telefon kamerasi bilan skanerlang va shu sahifadan yuklab oling.
                                </p>
                            </div>
                        </div>

                        {/* Ilova ekranlari */}
                        <div className="relative flex justify-center gap-4 sm:gap-6">
                            {[
                                { src: '/android/ekran-bozor.webp', alt: 'Otbozor ilovasi — bozor', offset: 'translate-y-6' },
                                { src: '/android/ekran-elon.webp', alt: "Otbozor ilovasi — e'lon sahifasi", offset: '-translate-y-2' },
                            ].map((s) => (
                                <div
                                    key={s.src}
                                    className={`${s.offset} w-[42%] max-w-[240px] rounded-[2rem] bg-slate-900 p-2 shadow-2xl shadow-slate-900/25`}
                                >
                                    <Image
                                        src={s.src}
                                        alt={s.alt}
                                        width={540}
                                        height={1169}
                                        className="w-full h-auto rounded-[1.6rem]"
                                        priority
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 max-w-6xl">
                {/* Imkoniyatlar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="w-11 h-11 mb-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                                <f.icon className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{f.title}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{f.text}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* O'rnatish */}
                    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Qanday o&apos;rnatiladi</h2>
                        <ol className="space-y-3">
                            {STEPS.map((s, i) => (
                                <li key={s} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <span className="pt-0.5">{s}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Xavfsizlik */}
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-3">
                            <ShieldCheck className="w-5 h-5" />
                            Xavfsizlik haqida
                        </h2>
                        <ul className="space-y-2.5 text-sm text-emerald-900/80 dark:text-emerald-200/80">
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                Ilova faqat shu rasmiy sahifadan tarqatiladi — boshqa joydan yuklab olmang.
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                Telefon «noma&apos;lum dasturchi» deb ogohlantirishi odatiy holat — ilova Play Market&apos;da emasligi uchun.
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                Parol so&apos;ralmaydi: kirish faqat Telegram akkauntingiz orqali.
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                Yangi versiya chiqsa, ilovaning o&apos;zi yangilashni taklif qiladi.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
