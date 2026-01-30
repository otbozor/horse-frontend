export function formatPrice(price: number, currency: 'UZS' | 'USD' = 'UZS'): string {
    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(price);
    }
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bugun';
    if (diffDays === 1) return 'Kecha';
    if (diffDays < 7) return `${diffDays} kun oldin`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} oy oldin`;
    return `${Math.floor(diffDays / 365)} yil oldin`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

export const purposeLabels: Record<string, string> = {
    KOPKARI: "Ko'pkari",
    SPORT: 'Sport',
    SAYR: 'Sayr',
    ISHCHI: 'Ishchi',
    NASLCHILIK: 'Naslchilik',
};

export const genderLabels: Record<string, string> = {
    AYGIR: 'Aygir',
    BIYA: 'Biya',
    AXTA: 'Axta',
};

export function getPurposeLabel(purpose: string): string {
    return purposeLabels[purpose] || purpose;
}

export function getGenderLabel(gender: string): string {
    return genderLabels[gender] || gender;
}
