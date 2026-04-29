"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getMe, getProfiles, User } from "@/lib/api";

interface Metric {
  label: string;
  value: string | number;
  sub?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [meRes, allRes, maleRes, femaleRes, adultRes, seniorRes] =
        await Promise.all([
          getMe(),
          getProfiles({ limit: 1 }),
          getProfiles({ gender: "male", limit: 1 }),
          getProfiles({ gender: "female", limit: 1 }),
          getProfiles({ age_group: "adult", limit: 1 }),
          getProfiles({ age_group: "senior", limit: 1 }),
        ]);

      if (meRes?.data) setUser(meRes.data);

      const total = allRes?.total ?? 0;
      const male = maleRes?.total ?? 0;
      const female = femaleRes?.total ?? 0;
      const adult = adultRes?.total ?? 0;
      const senior = seniorRes?.total ?? 0;
      const pct = (n: number) =>
        total ? `${((n / total) * 100).toFixed(1)}%` : "—";

      setMetrics([
        { label: "Total Profiles", value: total.toLocaleString() },
        {
          label: "Male",
          value: male.toLocaleString(),
          sub: pct(male),
        },
        {
          label: "Female",
          value: female.toLocaleString(),
          sub: pct(female),
        },
        {
          label: "Adults",
          value: adult.toLocaleString(),
          sub: pct(adult),
        },
        {
          label: "Seniors",
          value: senior.toLocaleString(),
          sub: pct(senior),
        },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <ProtectedLayout heading="Dashboard">
      {/* User card */}
      {user && (
        <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-6 py-4 mb-8 w-fit">
          {user.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-gray-800">@{user.username}</p>
            <p className="text-sm text-gray-500">
              {user.email} &middot;{" "}
              <span className="capitalize">{user.role}</span>
            </p>
          </div>
        </div>
      )}

      {/* Metrics */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading metrics…</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-white rounded-xl border border-gray-200 px-5 py-5"
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                {m.label}
              </p>
              <p className="text-2xl font-bold text-gray-800">{m.value}</p>
              {m.sub && (
                <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </ProtectedLayout>
  );
}
