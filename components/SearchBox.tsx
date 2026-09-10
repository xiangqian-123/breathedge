"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SEARCH_INDEX } from "@/data/search-index";

export default function SearchBox({
  locale,
  placeholder,
}: {
  locale: string;
  placeholder: string;
}) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return SEARCH_INDEX.filter((e) => {
      return (
        e.slug.toLowerCase().includes(query) ||
        e.zh.toLowerCase().includes(query) ||
        e.en.toLowerCase().includes(query)
      );
    }).slice(0, 8);
  }, [q]);

  return (
    <div className="searchbox" ref={boxRef}>
      <div className="searchbox-input">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          type="text"
          value={q}
          placeholder={placeholder}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          aria-label="搜索"
        />
      </div>
      {focus && results.length > 0 && (
        <div className="searchbox-dropdown">
          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/${locale}/guide/${r.slug}`}
              className="searchbox-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setQ("")}
            >
              <span className="searchbox-title">
                {locale.startsWith("zh") ? r.zh : r.en}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
