'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, ShieldCheck, Truck, Loader2, ArrowLeft } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    slug: string;
    description?: string;
    priceAmount: number;
    priceCurrency: string;
    stockStatus: string;
    hasDelivery: boolean;
    viewCount: number;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    media: Array<{
        id: string;
        url: string;
        thumbUrl?: string;
        sortOrder: number;
    }>;
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchProduct();
    }, [params.slug]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/products/${params.slug}`);
            if (!res.ok) throw new Error('Mahsulot topilmadi');
            const data = await res.json();
            setProduct(data);
        } catch (error) {
            console.error('Mahsulotni yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product || product.stockStatus === 'OUT_OF_STOCK') return;
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    const formatPrice = (amount: number, currency: string = 'UZS') => {
        if (currency === 'USD') return `$${amount.toLocaleString()}`;
        return `${amount.toLocaleString()} so'm`;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Mahsulot topilmadi</h1>
                <Link href="/mahsulotlar" className="text-primary-600 hover:underline">
                    Mahsulotlar ro&apos;yxatiga qaytish
                </Link>
            </div>
        );
    }

    const currentImage = product.media[selectedImage];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href="/mahsulotlar"
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Mahsulotlarga qaytish
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Images */}
                <div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 mb-4">
                        <div className="aspect-square relative">
                            {currentImage ? (
                                <img
                                    src={currentImage.url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500">
                                    <ShoppingCart className="w-24 h-24" />
                                </div>
                            )}
                        </div>
                    </div>

                    {product.media.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.media.map((media, index) => (
                                <button
                                    key={media.id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                        ? 'border-primary-600'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                        }`}
                                >
                                    <img
                                        src={media.thumbUrl || media.url}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <div className="mb-6">
                        {product.category && (
                            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                                {product.category.name}
                            </span>
                        )}
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-3 mb-2">{product.title}</h1>
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {formatPrice(Number(product.priceAmount), product.priceCurrency)}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Ko&apos;rildi: {product.viewCount} marta
                        </p>
                    </div>

                    {product.description && (
                        <div className="mb-8">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="mb-6">
                        {product.stockStatus === 'IN_STOCK' && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <Check className="w-5 h-5" />
                                <span className="font-medium">Mavjud</span>
                            </div>
                        )}
                        {product.stockStatus === 'OUT_OF_STOCK' && (
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <span className="font-medium">Sotuvda yo&apos;q</span>
                            </div>
                        )}
                        {product.stockStatus === 'PREORDER' && (
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <span className="font-medium">Oldindan buyurtma</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 mb-8">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stockStatus === 'OUT_OF_STOCK'}
                            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                            {addedToCart ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Savatga qo&apos;shildi!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Savatga qo&apos;shish
                                </>
                            )}
                        </button>
                        <p className="text-center text-sm text-slate-400 dark:text-slate-500">
                            Buyurtma berish uchun{' '}
                            <a
                                href="https://t.me/otbozor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 dark:text-primary-400 hover:underline"
                            >
                                Telegramda bog&apos;laning
                            </a>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {product.hasDelivery && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                                <Truck className="w-6 h-6 text-slate-400 dark:text-slate-400 mb-2" />
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Yetkazib berish</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">O&apos;zbekiston bo&apos;ylab</p>
                            </div>
                        )}
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                            <ShieldCheck className="w-6 h-6 text-slate-400 dark:text-slate-400 mb-2" />
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Kafolat</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Sifat kafolati</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
