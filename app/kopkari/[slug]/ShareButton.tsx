"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

function isMobile() {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function copyToClipboard(text: string): Promise<boolean> {
  // 1-usul: Clipboard API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }

  // 2-usul: execCommand fallback
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    // Mobilda native share
    if (isMobile() && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {}
    }

    // Desktop va fallback: clipboard ga nusxalash
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="btn btn-outline w-full justify-center bg-white dark:bg-slate-700 dark:text-slate-200 dark:border-slate-500"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          Nusxalandi!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Ulashish
        </>
      )}
    </button>
  );
}
