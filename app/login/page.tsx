"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { startTelegramAuth } from "@/lib/api";

function LoginContent() {
  const [botLink, setBotLink] = useState("");
  const [botUsername, setBotUsername] = useState("inbook_ru_bot");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  // Initialize Telegram auth session immediately
  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await startTelegramAuth(window.location.origin);
        if (response.success && response.data?.botDeepLink) {
          setBotLink(response.data.botDeepLink);
          const match = response.data.botDeepLink.match(/t\.me\/([^?]+)/);
          if (match) setBotUsername(match[1]);
        }
      } catch (err) {
        console.error("Sessiya yaratishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Otbozor"
              width={80}
              height={80}
              className="dark:invert"
            />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
          Kirish
        </h1>

        {/* Description */}
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8">
          Telegram bot orqali kirish havolasini oling
        </p>

        {/* Get login link button */}
        <a
          href={botLink || `https://t.me/${botUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full h-14 flex items-center justify-center gap-2.5 rounded-xl font-semibold text-base transition-all mb-6 ${loading
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-wait pointer-events-none"
              : "bg-[#2AABEE] hover:bg-[#229ED9] text-white shadow-lg shadow-blue-500/30"
            }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Yuklanmoqda...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.605l-2.979-.929c-.648-.203-.66-.648.136-.961l11.647-4.49c.538-.194 1.01.131.83.996z" />
              </svg>
              Telegram orqali kirish
            </>
          )}
        </a>

        {/* Instructions */}
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Qanday ishlaydi?
            </h3>
            <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                  1.
                </span>
                <span>Yuqoridagi tugmani bosing va Telegram botga o'ting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                  2.
                </span>
                <span>Botdan "Saytga kirish" tugmasini bosing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                  3.
                </span>
                <span>Avtomatik login bo'lasiz!</span>
              </li>
            </ol>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-300 text-center">
              Yangi foydalanuvchilar uchun telefon raqamini tasdiqlash kerak
              bo'ladi
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-900" />}>
      <LoginContent />
    </Suspense>
  );
}
