// src/pages/AuthPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ onSuccess }) {
  const { login, register } = useAuth();
  const [mode,    setMode]    = useState("login");
  const [form,    setForm]    = useState({ name:"", email:"", password:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else {
        if (!form.name.trim()) { setError("Please enter your name."); return; }
        await register(form.name, form.email, form.password);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#0D0A14;--surface:#13101E;--border:rgba(180,159,212,.12);--border-h:rgba(180,159,212,.4);--text:#F0EAF8;--muted:rgba(160,140,190,.55);--accent:#B49FD4;--ft:'Cormorant Garamond',serif;--fb:'Outfit',sans-serif}
        body{background:var(--bg);font-family:var(--fb)}
        .auth-shell{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:2rem}
        .auth-card{width:100%;max-width:420px;border:1px solid var(--border);border-radius:12px;padding:2.8rem 2.4rem;background:var(--surface);animation:fadeUp .45s ease both}
        .auth-logo{font-family:var(--ft);font-size:1.6rem;letter-spacing:.06em;color:var(--text);text-align:center;margin-bottom:2rem}
        .auth-logo em{font-style:italic;color:var(--accent)}
        .auth-title{font-family:var(--ft);font-size:1.7rem;font-weight:500;color:var(--text);text-align:center;line-height:1.2;margin-bottom:.4rem}
        .auth-title em{font-style:italic;color:var(--accent)}
        .auth-sub{font-size:.78rem;color:var(--muted);text-align:center;margin-bottom:2rem;font-weight:300}
        .auth-field{margin-bottom:1.1rem}
        .auth-label{display:block;font-size:.68rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:.45rem}
        .auth-input{width:100%;padding:.75rem 1rem;background:rgba(180,159,212,.05);border:1px solid var(--border);border-radius:6px;font-family:var(--fb);font-size:.88rem;color:var(--text);outline:none;transition:border-color .2s}
        .auth-input:focus{border-color:var(--border-h)}
        .auth-input::placeholder{color:rgba(160,140,190,.3)}
        .auth-error{font-size:.75rem;color:#e88;background:rgba(220,80,80,.08);border:1px solid rgba(220,80,80,.2);border-radius:6px;padding:.6rem .9rem;margin-bottom:1rem;text-align:center}
        .auth-btn{width:100%;padding:.9rem;background:var(--text);color:#1C1028;border:none;border-radius:6px;font-family:var(--fb);font-size:.88rem;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:opacity .2s,transform .2s;margin-top:.4rem}
        .auth-btn:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
        .auth-btn:disabled{opacity:.35;cursor:default}
        .auth-toggle{text-align:center;margin-top:1.4rem;font-size:.78rem;color:var(--muted)}
        .auth-toggle button{background:none;border:none;color:var(--accent);cursor:pointer;font-size:.78rem;font-family:var(--fb);text-decoration:underline;text-underline-offset:3px;transition:opacity .2s}
        .auth-toggle button:hover{opacity:.75}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-logo">dres<em>sed</em></div>
          <h1 className="auth-title">
            {mode === "login" ? <>Wel<em>come</em> back</> : <>Create an <em>account</em></>}
          </h1>
          <p className="auth-sub">
            {mode === "login"
              ? "Sign in to access your personal style assistant"
              : "Join and discover outfits curated for every occasion"}
          </p>

          <form onSubmit={submit} noValidate>
            {mode === "register" && (
              <div className="auth-field">
                <label className="auth-label">Your name</label>
                <input className="auth-input" type="text" placeholder="Priya Sharma" value={form.name} onChange={set("name")} autoComplete="name" />
              </div>
            )}
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} autoComplete="email" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"} value={form.password} onChange={set("password")} minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="auth-toggle">
            {mode === "login" ? (
              <>New here? <button onClick={() => { setMode("register"); setError(""); }}>Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={() => { setMode("login"); setError(""); }}>Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}