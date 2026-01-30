import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Check, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = {
        id: '1',
        title: 'Qorabayir Egari (To\'liq komplekt)',
        price: 1500000,
        description: "Qo'lda yasalgan haqiqiy charm egar. To'liq komplekt: egar, jabduq, uzangi, ko'krakbon. O'zbekistonda ishlab chiqarilgan. Sifati kafolatlangan.",
        image: 'https://images.unsplash.com/photo-1541416955071-88df54888a7c?w=800',
        category: 'Egar-jabduqlar',
        stock: 'IN_STOCK',
        features: [
            "Haqiqiy charm",
            "Bardoshli furnitura",
            "Qulay o'lcham",
            "1 yil kafolat"
        ]
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                    <div className="aspect-square relative">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Info */}
                <div>
                    <div className="mb-6">
                        <span className="text-sm text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-full">
                            {product.category}
                        </span>
                        <h1 className="text-3xl font-bold text-slate-900 mt-3 mb-2">{product.title}</h1>
                        <p className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</p>
                    </div>

                    <div className="prose prose-slate mb-8">
                        <p>{product.description}</p>
                        <ul className="not-prose space-y-2 mt-4">
                            {product.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-600">
                                    <Check className="w-5 h-5 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4 mb-8">
                        <button className="btn btn-primary btn-lg w-full justify-center">
                            <ShoppingCart className="w-5 h-5" />
                            Savatga qo'shish
                        </button>
                        <p className="text-center text-sm text-slate-500">
                            Telegram orqali buyurtma berish
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <Truck className="w-6 h-6 text-slate-400 mb-2" />
                            <h4 className="font-semibold text-sm text-slate-900">Yetkazib berish</h4>
                            <p className="text-xs text-slate-500">O'zbekiston bo'ylab 3 kun ichida</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <ShieldCheck className="w-6 h-6 text-slate-400 mb-2" />
                            <h4 className="font-semibold text-sm text-slate-900">Kafolat</h4>
                            <p className="text-xs text-slate-500">Sifat kafolati va qaytarish imkoniyati</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
