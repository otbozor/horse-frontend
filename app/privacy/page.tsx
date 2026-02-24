import Link from 'next/link';
import { BackButton } from '@/components/ui/BackButton';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <BackButton />
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Maxfiylik siyosati
                    </h1>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">So'nggi yangilanish: 2026-yil</p>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">1. Umumiy ma'lumot</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Otbozor.uz foydalanuvchilarning shaxsiy ma'lumotlarini himoya qilishni o'z zimmasiga oladi. Ushbu maxfiylik siyosati qanday ma'lumotlar yig'ilishini, qanday maqsadlarda ishlatilishini va qanday himoya qilinishini tushuntiradi.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">2. Yig'iladigan ma'lumotlar</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                Platformaga ro'yxatdan o'tish va foydalanish jarayonida quyidagi ma'lumotlar saqlanadi:
                            </p>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Telegram foydalanuvchi nomi va Telegram ID raqami</li>
                                <li>Ism va familiya, telefon raqami</li>
                                <li>E'lon ma'lumotlari: sarlavha, tavsif, narx va rasmlar</li>
                                <li>Joylashuv ma'lumoti: viloyat va tuman</li>
                                <li>Platforma ichidagi faoliyat: ko'rishlar, sevimlilar, to'lovlar</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">3. Ma'lumotlardan foydalanish maqsadlari</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                Yig'ilgan ma'lumotlar faqat quyidagi maqsadlarda ishlatiladi:
                            </p>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Foydalanuvchi shaxsini tasdiqlash va autentifikatsiya</li>
                                <li>E'lonlarni yaratish, ko'rsatish va boshqarish</li>
                                <li>Sotuvchi va xaridor o'rtasida aloqa imkoniyatini ta'minlash</li>
                                <li>To'lov operatsiyalarini amalga oshirish (Click orqali)</li>
                                <li>Platforma xizmatini yaxshilash va xatolarni tuzatish</li>
                                <li>Firibgarlik va qoidabuzarliklarni aniqlash</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">4. Telegram orqali autentifikatsiya</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Platforma Telegram messenger orqali kirish tizimidan foydalanadi. Parol saqlanmaydi. Kirish jarayonida Telegram sizning shaxsingizni tasdiqlaydi va platforma faqat umumiy profil ma'lumotlarini oladi. Siz istalgan vaqt platformadan chiqishingiz mumkin.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">5. Ma'lumotlarni uchinchi tomonlarga berish</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                Shaxsiy ma'lumotlaringiz uchinchi tomonlarga sotilmaydi yoki berilmaydi. Istisno hollar:
                            </p>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li><strong className="text-slate-700 dark:text-slate-300">Click to'lov tizimi</strong> — to'lov amalga oshirilganda minimal ma'lumotlar uzatiladi</li>
                                <li><strong className="text-slate-700 dark:text-slate-300">Qonun talablari</strong> — davlat organlari rasmiy so'rov yuborgan holatlarda</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">6. Ma'lumotlarni himoya qilish</h2>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>Barcha ulanishlar HTTPS orqali shifrlangan holda amalga oshiriladi</li>
                                <li>Parollar saqlanmaydi — autentifikatsiya Telegram orqali</li>
                                <li>Ma'lumotlar bazasi himoyalangan serverlarda saqlanadi</li>
                                <li>Cookie fayllar faqat sessiyani boshqarish uchun ishlatiladi</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">7. Foydalanuvchi huquqlari</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                Siz quyidagi huquqlarga egasiz:
                            </p>
                            <ul className="text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1.5">
                                <li>O'z profilingiz va e'lonlaringizni ko'rish hamda tahrirlash</li>
                                <li>E'lonlaringizni istalgan vaqt o'chirish</li>
                                <li>Akkauntni o'chirish va barcha ma'lumotlarni yo'q qilish talabi</li>
                                <li>Ma'lumotlaringizni qayta ishlashga rozilikni bekor qilish</li>
                            </ul>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                                Akkauntni to'liq o'chirish yoki ma'lumotlaringizni yo'q qilish uchun <Link href="/aloqa" className="text-amber-600 dark:text-amber-400 hover:underline">aloqa sahifasi</Link> orqali murojaat qiling.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">8. Savollar</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Maxfiylik siyosati bo'yicha savollar yoki shikoyatlar uchun <Link href="/aloqa" className="text-amber-600 dark:text-amber-400 hover:underline">aloqa sahifasi</Link> orqali murojaat qilishingiz mumkin.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
