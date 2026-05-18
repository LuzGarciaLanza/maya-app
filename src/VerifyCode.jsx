// VerifyCode.jsx — Partner staff scans QR → sees this page
// URL: holamaya.lat/verify?code=MAYA-FOGON-X4K2

import { useState, useEffect } from "react";

export default function VerifyCode() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code") || "";

  const [status, setStatus] = useState("loading"); // loading | valid | redeemed | not_found | error
  const [info, setInfo]     = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [done, setDone]     = useState(false);

  useEffect(() => {
    if (!code) { setStatus("not_found"); return; }
    fetch(`/api/redeem-code?code=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(data => {
        setInfo(data);
        if (data.error === "not_found") setStatus("not_found");
        else if (data.already_redeemed) setStatus("redeemed");
        else setStatus("valid");
      })
      .catch(() => setStatus("error"));
  }, [code]);

  async function redeem() {
    setRedeeming(true);
    try {
      const r = await fetch("/api/redeem-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await r.json();
      if (r.ok) { setDone(true); setStatus("redeemed"); }
      else if (data.error === "already_redeemed") {
        setInfo(i => ({ ...i, redeemed_at: data.redeemed_at }));
        setStatus("redeemed");
      }
    } catch (e) { /* silent */ }
    finally { setRedeeming(false); }
  }

  const wrap = {
    minHeight: "100vh", background: "#012A2A",
    fontFamily: "'Poppins', sans-serif", color: "white",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "32px 20px", maxWidth: 460, margin: "0 auto",
  };

  if (status === "loading") return (
    <div style={wrap}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Verificando código...</div>
    </div>
  );

  if (status === "not_found") return (
    <div style={wrap}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>❓</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Código no encontrado</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
        Este código no existe en el sistema.<br />Pedile al turista que abra Maya y genere su código.
      </div>
    </div>
  );

  if (status === "error") return (
    <div style={wrap}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Error de conexión</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
        Intentá de nuevo en unos segundos.
      </div>
      <button onClick={() => window.location.reload()}
        style={{ marginTop: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, color: "white", padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
        Reintentar
      </button>
    </div>
  );

  if (status === "redeemed") return (
    <div style={wrap}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{done ? "✅" : "🔒"}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: done ? "#4DD9E8" : "#FF8A50" }}>
        {done ? "¡Canjeado exitosamente!" : "Código ya utilizado"}
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20, textAlign: "center" }}>
        {info?.partner_name && <><strong style={{ color: "white" }}>{info.partner_name}</strong><br /></>}
        {info?.redeemed_at && `Canjeado el ${new Date(info.redeemed_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}`}
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", fontFamily: "monospace" }}>
        {code}
      </div>
      <div style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.2)" }}>holamaya.lat · socios</div>
    </div>
  );

  // status === "valid"
  return (
    <div style={wrap}>
      {/* Logo */}
      <div style={{ fontSize: 11, letterSpacing: 3, color: "#00ACC1", fontWeight: 700, marginBottom: 24 }}>
        🌴 MAYA · SOCIOS
      </div>

      {/* Valid badge */}
      <div style={{ background: "rgba(0,172,193,0.12)", border: "1px solid rgba(0,172,193,0.35)", borderRadius: 16, padding: "20px 24px", width: "100%", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#4DD9E8", marginBottom: 4 }}>Código válido</div>
        {info?.partner_name && (
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
            {info.partner_name}
          </div>
        )}
        {info?.deal_description && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
            {info.deal_description}
          </div>
        )}
      </div>

      {/* Code display */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", width: "100%", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2, marginBottom: 6, fontWeight: 600 }}>CÓDIGO</div>
        <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: "white", letterSpacing: 2 }}>{code}</div>
        {info?.generated_at && (
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
            Generado {new Date(info.generated_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
          </div>
        )}
      </div>

      {/* Redeem button */}
      <button onClick={redeem} disabled={redeeming}
        style={{ width: "100%", background: "linear-gradient(135deg, #00897B, #00ACC1)", border: "none", borderRadius: 14, color: "white", fontFamily: "'Poppins',sans-serif", fontSize: 16, fontWeight: 700, padding: "16px", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,172,193,0.3)", opacity: redeeming ? 0.7 : 1 }}>
        {redeeming ? "⏳ Marcando..." : "✅ Marcar como canjeado"}
      </button>

      <div style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.8 }}>
        Al tocar el botón, el código queda registrado<br />como utilizado y no podrá usarse de nuevo.
      </div>
    </div>
  );
}
