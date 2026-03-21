// src/hooks/useOutfits.js
import { useState, useEffect, useRef } from "react";
import { outfitApi } from "../api";

const cache = {};

export function useOutfitsByOccasion(occasion, category = "All") {
  const [outfits,    setOutfits]    = useState([]);
  const [allOutfits, setAllOutfits] = useState([]);
  const [filters,    setFilters]    = useState(["All"]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const ctrl = useRef(null);

  useEffect(() => {
    if (!occasion) return;
    const key = `occ:${occasion}`;
    if (cache[key]) {
      setAllOutfits(cache[key].data);
      setFilters(cache[key].filters);
      applyFilter(cache[key].data, category);
    } else {
      setLoading(true);
    }
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    outfitApi.getByOccasion(occasion)
      .then(res => {
        if (ctrl.current.signal.aborted) return;
        const data = res.data || [];
        const uniq = ["All", ...new Set(data.map(o => cap(o.category)))];
        cache[key] = { data, filters: uniq };
        setAllOutfits(data); setFilters(uniq); applyFilter(data, category); setError(null);
      })
      .catch(e => { if (!ctrl.current.signal.aborted) setError(e.message); })
      .finally(() => { if (!ctrl.current.signal.aborted) setLoading(false); });
    return () => ctrl.current.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasion]);

  useEffect(() => { applyFilter(allOutfits, category); }, [category, allOutfits]);

  function applyFilter(data, cat) {
    setOutfits(!cat || cat === "All" ? data : data.filter(o => o.category?.toLowerCase() === cat.toLowerCase()));
  }

  return { outfits, filters, loading, error };
}

export function useOccasionsMeta() {
  const [meta,    setMeta]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  useEffect(() => {
    if (cache["meta"]) { setMeta(cache["meta"]); setLoading(false); return; }
    outfitApi.getMeta()
      .then(r => { cache["meta"] = r; setMeta(r); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return { meta, loading, error };
}

const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;