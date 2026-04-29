"use client";

export interface Profile {
  id: string;
  name: string;
  gender: string | null;
  gender_probability: number | null;
  sample_size: number | null;
  age: number | null;
  age_group: string | null;
  country_id: string | null;
  country_name: string | null;
  country_probability: number | null;
  created_at: string;
}

export interface ProfilesResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: { self: string; next: string | null; prev: string | null };
  data: Profile[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T | null> {
  const res = await fetch(url, options);

  if (res.status === 401) {
    window.location.href = "/";
    return null;
  }

  return res.json() as Promise<T>;
}

export async function getProfiles(
  params: Record<string, string | number>
): Promise<ProfilesResponse | null> {
  const qs = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== "" && v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    )
  ).toString();
  return apiFetch<ProfilesResponse>(`/api/profiles?${qs}`);
}

export async function getProfile(
  id: string
): Promise<{ status: string; data: Profile } | null> {
  return apiFetch(`/api/profiles/${id}`);
}

export async function searchProfiles(
  q: string,
  page = 1,
  limit = 10
): Promise<ProfilesResponse | null> {
  return apiFetch(
    `/api/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
  );
}

export async function getMe(): Promise<{ status: string; data: User } | null> {
  return apiFetch("/api/me");
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/";
}
