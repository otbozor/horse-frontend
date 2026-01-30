import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

// Mock data
const products = [
    {
        id: '1',
        title: 'Qorabayir Egari (To\'liq komplekt)',
        slug: 'qorabayir-egari',
        price: 1500000,
        image: 'https://images.unsplash.com/photo-1541416955071-88df54888a7c?w=400',
        category: 'Egar-jabduqlar',
        stock: 'IN_STOCK'
    },
    {
        id: '2',
        title: 'Maxsus ot ozuqasi "Champion"',
        slug: 'maxsus-ot-ozuqasi',
        price: 250000,
        image: 'https://images.unsplash.com/photo-1623947477610-d81a985d2629?w=400',
        category: 'Ozuqa',
        stock: 'IN_STOCK'
    },
    {
        id: '3',
        title: 'Ot yopinchig\'i (Qishki)',
        slug: 'ot-yopinchigi-qishki',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1598547372229-5735f1110536?w=400',
        category: 'Kiyimlar',
        stock: 'OUT_OF_STOCK'
    }
];

const categories = [
    "Egar-jabduqlar",
    "Ozuqa",
    "Dori-darmonlar",
    "Parvarish vositalari",
    "Kiyimlar"
];

export default function ProductsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Ot uchun mahsulotlar</h1>
                <p className="text-slate-600">Sifatli egar-jabduqlar, ozuqa va aksessuarlar</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Categories Sidebar */}
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-24">
                        <h3 className="font-bold text-slate-900 mb-4">Kategoriyalar</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/mahsulotlar" className="block px-3 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium">
                                    Barchasi
                                </Link>
                            </li>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <Link href={`/mahsulotlar/kategoriya/${cat.toLowerCase()}`} className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-grow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/mahsulotlar/${product.slug}`}
                                className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {product.stock === 'OUT_OF_STOCK' && (
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                                            <span className="bg-slate-800 text-white px-3 py-1 rounded text-sm font-medium">Sotuvda yo'q</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-slate-500 mb-1">{product.category}</p>
                                    <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-lg text-slate-900">{formatPrice(product.price)}</p>
                                        <button className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
