'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function HeroSection() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setReady(true));
    }, []);

    return (
        <section
            className="hero-no-select relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white overflow-hidden"
            onCopy={(e) => e.preventDefault()}
        >
            {ready && (
                <Particles
                    id="hero-particles"
                    className="absolute inset-0"
                    options={{
                        fullScreen: { enable: false },
                        background: { color: { value: 'transparent' } },
                        fpsLimit: 60,
                        particles: {
                            color: { value: '#ffffff' },
                            links: {
                                color: '#ffffff',
                                distance: 150,
                                enable: true,
                                opacity: 0.15,
                                width: 1,
                            },
                            move: {
                                enable: true,
                                speed: 1,
                                direction: 'none' as const,
                                outModes: { default: 'bounce' as const },
                            },
                            number: {
                                density: { enable: true },
                                value: 80,
                            },
                            opacity: {
                                value: 0.3,
                            },
                            shape: {
                                type: 'circle',
                            },
                            size: {
                                value: { min: 1, max: 3 },
                            },
                        },
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: 'grab',
                                },
                            },
                            modes: {
                                grab: {
                                    distance: 200,
                                    links: { opacity: 0.4 },
                                },
                            },
                        },
                        detectRetina: true,
                    }}
                />
            )}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                        Otingizni tez soting
                        <br />
                        yoki <span className="text-amber-300">toping</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-12 max-w-2xl mx-auto px-4 sm:px-0">
                        O&apos;zbekistondagi eng katta ot savdo platformasi. Minglab e&apos;lonlar,
                        verifikatsiyalangan sotuvchilar, xavfsiz savdo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                        <Link
                            href="/elon/yaratish"
                            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-primary-700 hover:bg-primary-50 rounded-xl font-semibold text-base sm:text-lg shadow-xl transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            E&apos;lon joylash
                        </Link>
                        <Link
                            href="/bozor"
                            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold text-base sm:text-lg transition-colors"
                        >
                            <Search className="w-5 h-5" />
                            Ot qidirish
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
