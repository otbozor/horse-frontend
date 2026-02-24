import Link from 'next/link';
import { BackButton } from '@/components/ui/BackButton';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <BackButton />
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Joylashtirish qoidalari
                    </h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">So'nggi yangilanish: 2025-yil</p>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">1. Umumiy qoidalar</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Otbozor.uz — O'zbekistondagi otlarni sotish va sotib olish uchun mo'ljallangan maxsus platforma. Platformadan foydalanish orqali siz ushbu qoidalarga to'liq rozilik bildirasiz. Qoidalar barcha foydalanuvchilarga taalluqlidir.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">2. Ro'yxatdan o'tish</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                Platformaga kirish va e'lon joylashtirish uchun Telegram orqali ro'yxatdan o'tish majburiy. Bu orqali:
                            </p>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Har bir sotuvchining haqiqiy shaxsi tasdiqlanadi</li>
                                <li>Soxta akkauntlar oldini olinadi</li>
                                <li>Xaridorlar sotuvchi bilan to'g'ridan-to'g'ri bog'lana oladi</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">3. E'lon joylashtirish tartibi</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                E'lon 5 bosqichda joylashtiriladi:
                            </p>
                            <ol className="text-slate-600 dark:text-slate-400 list-decimal pl-5 space-y-2">
                                <li><strong className="text-slate-700 dark:text-slate-300">Asosiy ma'lumotlar</strong> — sarlavha, zoti, jinsi, yoshi, rangi, maqsadi va tavsifi</li>
                                <li><strong className="text-slate-700 dark:text-slate-300">Joylashuv</strong> — viloyat va tuman ko'rsatiladi</li>
                                <li><strong className="text-slate-700 dark:text-slate-300">Narx va holat</strong> — narx (so'm yoki dollar), hujjat va emlash holati</li>
                                <li><strong className="text-slate-700 dark:text-slate-300">Rasmlar va video</strong> — 8 tagacha fayl yuklash mumkin</li>
                                <li><strong className="text-slate-700 dark:text-slate-300">Ko'rib chiqish</strong> — e'lonni moderatsiyaga yuborish</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">4. Ruxsat etilgan e'lonlar</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                Faqat quyidagi turdagi otlar uchun e'lon joylashtiriladi:
                            </p>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Ko'pkari otlari</li>
                                <li>Sport otlari</li>
                                <li>Sayr va dam olish uchun otlar</li>
                                <li>Ishchi otlar</li>
                                <li>Naslchilik uchun otlar</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">5. Rasm va video talablari</h2>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Rasmlar aniq va sifatli bo'lishi shart</li>
                                <li>Rasmda aynan sotilayotgan ot ko'rinishi kerak</li>
                                <li>Suvli belgi (watermark) yopishtirilgan rasmlar taqiqlanadi</li>
                                <li>Boshqa saytlardan olingan rasmlar taqiqlanadi</li>
                                <li>Jami 8 tagacha rasm yoki video yuklash mumkin</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">6. Narx ko'rsatish</h2>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Narx haqiqiy va aniq ko'rsatilishi shart</li>
                                <li>Narx so'm (UZS) yoki dollar (USD) da ko'rsatilishi mumkin</li>
                                <li>Kelishuv narxi bo'lsa, tavsif qismida yozilishi mumkin</li>
                                <li>Narxni oshirib yoki kamaytirib ko'rsatish taqiqlanadi</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">7. Taqiqlangan hollar</h2>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Mavjud bo'lmagan ot uchun e'lon joylashtirish</li>
                                <li>Yolg'on yoki chalg'ituvchi ma'lumot berish</li>
                                <li>Boshqa foydalanuvchilarni aldash yoki firibgarlik</li>
                                <li>Bir xil e'lonni bir necha bor joylashtirish (spam)</li>
                                <li>Boshqa platformalarga reklama qilish</li>
                                <li>Noqonuniy sotish yoki hayvonlarga shafqatsiz munosabat</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">8. Moderatsiya</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Har bir e'lon moderatsiya tekshiruvidan o'tadi. Qoidalarga zid e'lonlar rad etiladi yoki o'chiriladi. Qoidabuzarlik takrorlansa, akkaunt bloklanishi mumkin. Moderatsiya qarori bo'yicha <Link href="/aloqa" className="text-amber-600 dark:text-amber-400 hover:underline">aloqa sahifasi</Link> orqali murojaat qilishingiz mumkin.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">9. Javobgarlik</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Otbozor.uz platforma sotuvchi va xaridor o'rtasidagi bitimlar uchun javobgar emas. Platforma faqat e'lonlarni joylashtirish va aloqa imkoniyatini taqdim etadi. Sotuvchi ko'rsatgan ma'lumotlarning to'g'riligi uchun sotuvchining o'zi javobgardir.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
