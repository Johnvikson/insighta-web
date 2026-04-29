"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getProfile, Profile } from "@/lib/api";

function Row({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex py-3 border-b border-gray-100 last:border-0">
      <dt className="w-44 text-sm font-medium text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800">{value ?? "—"}</dd>
    </div>
  );
}

export default function ProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile(params.id).then((res) => {
      if (res?.data) setProfile(res.data);
      else setError("Profile not found.");
      setLoading(false);
    });
  }, [params.id]);

  return (
    <ProtectedLayout heading="Profile Detail">
      <button
        onClick={() => router.push("/profiles")}
        className="mb-6 text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
      >
        ← Back to profiles
      </button>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : profile ? (
        <div className="bg-white rounded-xl border border-gray-200 px-8 py-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {profile.name}
          </h2>
          <dl>
            <Row label="ID" value={profile.id} />
            <Row label="Gender" value={profile.gender} />
            <Row
              label="Gender probability"
              value={
                profile.gender_probability != null
                  ? `${(profile.gender_probability * 100).toFixed(1)}%`
                  : null
              }
            />
            <Row label="Age" value={profile.age} />
            <Row label="Age group" value={profile.age_group} />
            <Row label="Country code" value={profile.country_id} />
            <Row label="Country name" value={profile.country_name} />
            <Row
              label="Country probability"
              value={
                profile.country_probability != null
                  ? `${(profile.country_probability * 100).toFixed(1)}%`
                  : null
              }
            />
            <Row label="Created" value={profile.created_at} />
          </dl>
        </div>
      ) : null}
    </ProtectedLayout>
  );
}
