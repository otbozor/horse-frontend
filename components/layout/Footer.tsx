import Link from 'next/link';
import { Phone, Send, MapPin } from 'lucide-react';

const regions = [
    { name: 'Toshkent', slug: 'toshkent-viloyati' },
    { name: 'Samarqand', slug: 'samarqand' },
    { name: 'Buxoro', slug: 'buxoro' },
    { name: "Farg'ona", slug: 'fargona' },
    { name: 'Andijon', slug: 'andijon' },
    { name: 'Namangan', slug: 'namangan' },
    { name: 'Xorazm', slug: 'xorazm' },
    { name: 'Qashqadaryo', slug: 'qashqadaryo' },
];

const footerLinks = {
    bozor: [
        { name: "Ko'pkari otlari", href: '/bozor?purpose=KOPKARI' },
        { name: 'Sport otlari', href: '/bozor?purpose=SPORT' },
        { name: 'Sayr otlari', href: '/bozor?purpose=SAYR' },
        { name: 'Ishchi otlar', href: '/bozor?purpose=ISHCHI' },
    ],
    yordam: [
        { name: 'Ko\'p so\'raladigan savollar', href: '/faq' },
        { name: "Qanday e'lon joylash", href: '/blog/qanday-elon-joylash' },
        { name: 'Reklama', href: '/reklama' },
        { name: 'Aloqa', href: '/aloqa' },
    ],
    huquqiy: [
        { name: 'Foydalanish shartlari', href: '/terms' },
        { name: 'Maxfiylik siyosati', href: '/privacy' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-auto pb-20 md:pb-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">🐴</span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Ot<span className="text-primary-400">bozor</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-6 max-w-sm">
                            O'zbekistondagi eng katta ot savdo platformasi. Telegram orqali
                            xavfsiz va tez savdo qiling.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://t.me/otbozor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <Send className="w-4 h-4 text-sky-400" />
                                <span>Telegram kanal</span>
                            </a>
                            <a
                                href="https://t.me/otbozor_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <Send className="w-4 h-4 text-sky-400" />
                                <span>Bot</span>
                            </a>
                        </div>
                    </div>

                    {/* Bozor links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Bozor</h3>
                        <ul className="space-y-2">
                            {footerLinks.bozor.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Yordam links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Yordam</h3>
                        <ul className="space-y-2">
                            {footerLinks.yordam.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Viloyatlar */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Viloyatlar</h3>
                        <ul className="space-y-2">
                            {regions.map((region) => (
                                <li key={region.slug}>
                                    <Link
                                        href={`/bozor/${region.slug}`}
                                        className="hover:text-primary-400 transition-colors flex items-center gap-1"
                                    >
                                        <MapPin className="w-3 h-3" />
                                        {region.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Otbozor. Barcha huquqlar himoyalangan.
                    </p>
                    <div className="flex gap-6 text-sm">
                        {footerLinks.huquqiy.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
