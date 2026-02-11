import Link from 'next/link';
import { Send } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-auto pb-20 md:pb-0">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-3">
                            <img src="/logo.png" alt="Otbozor" className="w-8 h-8 object-contain" />
                            <span className="text-lg font-bold text-white">
                                Ot<span className="text-primary-400">bozor</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm mb-4">
                            O'zbekistondagi ot savdo platformasi
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 text-sm">Havolalar</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/bozor" className="hover:text-primary-400 transition-colors">
                                    Bozor
                                </Link>
                            </li>
                            <li>
                                <Link href="/kopkari" className="hover:text-primary-400 transition-colors">
                                    Ko'pkari
                                </Link>
                            </li>
                            <li>
                                <Link href="/mahsulotlar" className="hover:text-primary-400 transition-colors">
                                    Mahsulotlar
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/aloqa" className="hover:text-primary-400 transition-colors">
                                    Aloqa
                                </Link>
                            </li>
                            <li>
                                <Link href="/elon/yaratish" className="hover:text-primary-400 transition-colors">
                                    E'lon joylash
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 text-sm">Aloqa</h3>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://t.me/otbozor_bot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm hover:text-primary-400 transition-colors"
                            >
                                <Send className="w-4 h-4 text-sky-400" />
                                <span>Telegram Bot</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Otbozor. Barcha huquqlar himoyalangan.</p>
                    <div className="flex gap-4">
                        <Link href="/terms" className="hover:text-slate-300 transition-colors">
                            Shartlar
                        </Link>
                        <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                            Maxfiylik
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
