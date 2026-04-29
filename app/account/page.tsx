"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/ProtectedLayout";
import { getMe, logout, User } from "@/lib/api";

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex py-3 border-b border-gray-100 last:border-0">
      <dt className="w-36 text-sm font-medium text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800">{value ?? "—"}</dd>
    </div>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getMe().then((res) => {
      if (res?.data) setUser(res.data);
      setLoading(false);
    });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
  }

  return (
    <ProtectedLayout heading="Account">
      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : user ? (
        <div className="max-w-lg">
          {/* Avatar */}
          {user.avatar_url && (
            <div className="mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-16 h-16 rounded-full border border-gray-200"
              />
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 mb-6">
            <dl>
              <Row label="Username" value={`@${user.username}`} />
              <Row label="Email" value={user.email} />
              <Row label="Role" value={user.role} />
              <Row label="ID" value={user.id} />
            </dl>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-5 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Unable to load account info.</p>
      )}
    </ProtectedLayout>
  );
}
