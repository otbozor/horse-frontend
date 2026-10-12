import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bell, Download, ShieldCheck, Zap } from 'lucide-react';

// Backend yuklab olishni sanaydi va APK ga (app.otbozor.uz/app/otbozor.apk) yo'naltiradi
const APK_URL = 'https://api.otbozor.uz/api/app/download?src=home';

const POINTS = [
    { icon: Zap, text: "E'lon 2 daqiqada — telefoningizdan" },
    { icon: Bell, text: "Yangi otlar va ko'pkarilar haqida xabarlar" },
    { icon: ShieldCheck, text: 'Parolsiz — Telegram orqali kirish' },
];

/** Bosh sahifadagi Android ilova reklamasi: to'q yashil, sahifaning qolgan qismidan ajralib turadi */
export function AppPromoSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-emerald-950 text-white">
            {/* Fon bezaklari */}
            <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary-400/25 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-amber-400/15 blur-3xl" />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }}
            />

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-14 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Matn */}
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/20 backdrop-blur">
                            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-900">Yangi</span>
                            Android ilova
                        </span>
                        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                            Ot bozori endi <span className="text-amber-300">cho&apos;ntagingizda</span>
                        </h2>
                        <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
                            Otbozor ilovasini yuklab oling — e&apos;lonlarni ko&apos;ring, sotuvchiga bir bosishda qo&apos;ng&apos;iroq qiling va otingizni tez soting.
                        </p>

                        <ul className="mt-6 space-y-2.5 inline-flex flex-col items-start text-left">
                            {POINTS.map((p) => (
                                <li key={p.text} className="flex items-center gap-3 text-white/90">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                        <p.icon className="h-4 w-4 text-amber-300" />
                                    </span>
                                    {p.text}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                            <a
                                href={APK_URL}
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-bold text-primary-800 shadow-xl shadow-black/20 transition hover:bg-amber-50 hover:-translate-y-0.5"
                            >
                                <Download className="h-5 w-5" />
                                Android uchun yuklab olish
                            </a>
                            <Link
                                href="/android-yuklash"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
                            >
                                Batafsil
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="mt-3 text-xs text-white/60">Bepul · Android 7.0+ · ~4,5 MB</p>

                        {/* Kompyuterdan kirganlar uchun */}
                        <div className="mt-8 hidden lg:inline-flex items-center gap-4 rounded-2xl bg-white/10 p-3 pr-5 ring-1 ring-white/15 backdrop-blur">
                            <Image src="/android/qr.svg" alt="Yuklab olish uchun QR kod" width={84} height={84} className="rounded-lg bg-white p-1" />
                            <p className="max-w-[16rem] text-sm text-white/85">Telefon kamerasi bilan skanerlang — yuklab olish sahifasi ochiladi</p>
                        </div>
                    </div>

                    {/* Telefonlar */}
                    <div className="relative mx-auto flex h-[420px] sm:h-[500px] w-full max-w-md items-center justify-center">
                        <div aria-hidden className="absolute h-72 w-72 sm:h-80 sm:w-80 rounded-full bg-amber-300/30 blur-3xl" />
                        <div className="absolute left-[6%] top-[10%] w-[44%] -rotate-[8deg] rounded-[2rem] bg-slate-950 p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                            <Image src="/android/ekran-elon.webp" alt="Otbozor ilovasi — e'lon sahifasi" width={540} height={1169} className="h-auto w-full rounded-[1.6rem]" />
                        </div>
                        <div className="absolute right-[6%] top-[2%] w-[48%] rotate-[5deg] rounded-[2rem] bg-slate-950 p-2 shadow-2xl shadow-black/50 ring-1 ring-white/10">
                            <Image src="/android/ekran-bozor.webp" alt="Otbozor ilovasi — bozor" width={540} height={1169} className="h-auto w-full rounded-[1.6rem]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
