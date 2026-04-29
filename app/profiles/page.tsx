"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getProfiles, Profile } from "@/lib/api";

const GENDERS = ["", "male", "female"];
const AGE_GROUPS = ["", "child", "teenager", "adult", "senior"];

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [countryId, setCountryId] = useState("");

  async function load(p: number) {
    setLoading(true);
    const res = await getProfiles({
      page: p,
      limit: 20,
      ...(gender && { gender }),
      ...(ageGroup && { age_group: ageGroup }),
      ...(countryId && { country_id: countryId }),
    });
    if (res) {
      setProfiles(res.data);
      setPage(res.page);
      setTotalPages(res.total_pages);
      setTotal(res.total);
    }
    setLoading(false);
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, ageGroup, countryId]);

  return (
    <ProtectedLayout heading="Profiles">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g || "All genders"}
            </option>
          ))}
        </select>

        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {AGE_GROUPS.map((a) => (
            <option key={a} value={a}>
              {a || "All age groups"}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={countryId}
          onChange={(e) => setCountryId(e.target.value.toUpperCase())}
          placeholder="Country code (e.g. NG)"
          maxLength={2}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>

      {/* Table */}
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : profiles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  No profiles found.
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/profiles/${p.id}`)}
                  className="border-b border-gray-50 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {p.gender ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.age ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {p.age_group ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.country_id ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.country_name ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages} ({total.toLocaleString()} total)
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => load(page - 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => load(page + 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </ProtectedLayout>
  );
}
