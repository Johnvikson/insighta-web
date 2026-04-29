"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { searchProfiles, Profile } from "@/lib/api";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function search(p = 1) {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    const res = await searchProfiles(query.trim(), p);
    if (res?.status === "success") {
      setProfiles(res.data);
      setPage(res.page);
      setTotalPages(res.total_pages);
      setTotal(res.total);
    } else if (res?.status === "error") {
      setError((res as { message?: string }).message ?? "Unable to interpret query.");
      setProfiles([]);
      setTotal(0);
    }
    setSearched(true);
    setLoading(false);
  }

  return (
    <ProtectedLayout heading="Search Profiles">
      <div className="max-w-2xl mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search(1)}
            placeholder='e.g. "female from nigeria above 25"'
            className="flex-1 text-sm border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          <button
            onClick={() => search(1)}
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Try: &quot;male adult from ghana&quot; · &quot;young female from kenya&quot; ·
          &quot;senior above 60&quot;
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {searched && !error && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Name", "Gender", "Age", "Age Group", "Country", "Country Name"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {profiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  profiles.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/profiles/${p.id}`)}
                      className="border-b border-gray-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{p.gender ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{p.age ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{p.age_group ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{p.country_id ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{p.country_name ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} ({total.toLocaleString()} total)
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => search(page - 1)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => search(page + 1)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </ProtectedLayout>
  );
}
