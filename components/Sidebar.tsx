"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/profiles", label: "Profiles", icon: "◉" },
  { href: "/search", label: "Search", icon: "⌕" },
  { href: "/account", label: "Account", icon: "◎" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-slate-900 flex flex-col z-10">
      <div className="px-6 py-5 border-b border-slate-700">
        <span className="text-white font-bold text-lg tracking-tight">
          Insighta Labs
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">© 2026 Insighta Labs</p>
      </div>
    </aside>
  );
}
