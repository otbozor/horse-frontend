import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
        default: "Otbozor - O'zbekiston Ot Savdo Platformasi",
        template: '%s | Otbozor',
    },
    description:
        "O'zbekistondagi eng katta ot savdo bozori. Ko'pkari, sport, sayr, ishchi va naslchilik otlarini tez va oson toping yoki soting.",
    keywords: [
        'ot sotish',
        'ot olish',
        "ot bozori o'zbekiston",
        "ko'pkari ot",
        'sport ot',
        'karabayir',
        'axaltekin',
        'bozor',
    ],
    authors: [{ name: 'Otbozor' }],
    creator: 'Otbozor',
    openGraph: {
        type: 'website',
        locale: 'uz_UZ',
        url: '/',
        siteName: 'Otbozor',
        title: "Otbozor - O'zbekiston Ot Savdo Platformasi",
        description:
            "O'zbekistondagi eng katta ot savdo bozori. Ko'pkari, sport, sayr, ishchi va naslchilik otlarini tez va oson toping yoki soting.",
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Otbozor',
        description: "O'zbekistondagi eng katta ot savdo bozori",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uz">
            <body className="min-h-screen">
                <ThemeProvider>
                    <AuthProvider>
                        <LayoutWrapper>{children}</LayoutWrapper>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
