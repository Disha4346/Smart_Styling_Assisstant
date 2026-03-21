// src/api/index.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const token = () => localStorage.getItem("ssa_token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

const qs = (p = {}) => {
  const s = new URLSearchParams(
    Object.fromEntries(Object.entries(p).filter(([, v]) => v != null && v !== ""))
  ).toString();
  return s ? `?${s}` : "";
};

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register:      (name, email, password) =>
    fetch(`${BASE}/auth/register`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name,email,password}) }).then(handle),
  login:         (email, password) =>
    fetch(`${BASE}/auth/login`,    { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email,password}) }).then(handle),
  getMe:         () => fetch(`${BASE}/auth/me`,      { headers:headers() }).then(handle),
  updateProfile: (data) =>
    fetch(`${BASE}/auth/profile`,  { method:"PUT", headers:headers(), body:JSON.stringify(data) }).then(handle),
};

// ── Outfits ───────────────────────────────────────────────────────────────────
export const outfitApi = {
  getAll:          (p={}) => fetch(`${BASE}/outfits${qs(p)}`).then(handle),
  getMeta:         ()     => fetch(`${BASE}/outfits/meta/occasions`).then(handle),
  getByOccasion:   (occ, p={}) => fetch(`${BASE}/outfits/occasion/${encodeURIComponent(occ)}${qs(p)}`).then(handle),
  getBySubOccasion:(occ, sub) => fetch(`${BASE}/outfits/occasion/${encodeURIComponent(occ)}/sub/${encodeURIComponent(sub)}`).then(handle),
  getByCategory:   (cat)  => fetch(`${BASE}/outfits/category/${encodeURIComponent(cat)}`).then(handle),
  getById:         (id)   => fetch(`${BASE}/outfits/${id}`).then(handle),
  create:          (data) => fetch(`${BASE}/outfits`, { method:"POST", headers:headers(), body:JSON.stringify(data) }).then(handle),
  remove:          (id)   => fetch(`${BASE}/outfits/${id}`, { method:"DELETE", headers:headers() }).then(handle),
};

// ── Wardrobe ──────────────────────────────────────────────────────────────────
export const wardrobeApi = {
  getAll:  ()     => fetch(`${BASE}/wardrobe`, { headers:headers() }).then(handle),
  addItem: (data) => fetch(`${BASE}/wardrobe`, { method:"POST", headers:headers(), body:JSON.stringify(data) }).then(handle),
  remove:  (id)   => fetch(`${BASE}/wardrobe/${id}`, { method:"DELETE", headers:headers() }).then(handle),
};