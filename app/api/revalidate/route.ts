import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path, secret } = body;

        // Secret key tekshirish (xavfsizlik uchun)
        if (secret !== process.env.REVALIDATE_SECRET) {
            return NextResponse.json(
                { message: 'Invalid secret' },
                { status: 401 }
            );
        }

        if (path) {
            // Specific path'ni revalidate qilish
            revalidatePath(path);
            return NextResponse.json({
                revalidated: true,
                path,
                now: Date.now(),
            });
        }

        return NextResponse.json(
            { message: 'Path is required' },
            { status: 400 }
        );
    } catch (err) {
        return NextResponse.json(
            { message: 'Error revalidating', error: err },
            { status: 500 }
        );
    }
}
