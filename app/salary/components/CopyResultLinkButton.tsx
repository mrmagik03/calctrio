"use client";

import { useState } from "react";

export default function CopyResultLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="border border-[#3a3128] bg-[#151311] px-4 py-3 text-sm text-[#f7f3eb] transition-colors duration-200 hover:border-[#b29f7a]"
    >
      {copied ? "Link copied" : "Copy link to these results"}
    </button>
  );
}
