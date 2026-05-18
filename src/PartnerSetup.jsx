import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "maya_partner_edit_code";
const ADMIN_SECRET = "MAYAADMIN2026";

const CATEGORIES = [
  { id: "food",        emoji: "🍽",  color: "#FF6B35", en: "Restaurants & Bars",  es: "Restaurantes & Bares",   fr: "Restaurants & Bars" },
  { id: "tours",       emoji: "🤿",  color: "#1E88E5", en: "Tours & Activities",  es: "Tours & Actividades",    fr: "Excursions" },
  { id: "wellness",    emoji: "💆",  color: "#8E24AA", en: "Wellness & Spa",      es: "Bienestar & Spa",        fr: "Bien-être & Spa" },
  { id: "dental",      emoji: "🦷",  color: "#00897B", en: "Dental & Medical",    es: "Dental & Médico",        fr: "Dentaire & Médical" },
  { id: "shopping",    emoji: "🛍",  color: "#F4511E", en: "Shopping",            es: "Compras",                fr: "Shopping" },
  { id: "hotels",      emoji: "🏨",  color: "#4527A0", en: "Hotels & Rentals",    es: "Hoteles & Rentals",      fr: "Hôtels & Locations" },
  { id: "transport",   emoji: "🚕",  color: "#43A047", en: "Transport",           es: "Transporte",             fr: "Transport" },
  { id: "experiences", emoji: "📸",  color: "#E53935", en: "Experiences",         es: "Experiencias",           fr: "Expériences" },
];

const EMPTY = {
  business_name: "", category: "", address: "", whatsapp: "52",
  contact_name: "", contact_email: "",
  discount_es: "", description_es: "", savings_es: "", how_to_redeem_es: "",
  discount_en: "", description_en: "", savings_en: "", how_to_redeem_en: "",
  discount_fr: "", description_fr: "", savings_fr: "", how_to_redeem_fr: "",
  deal_code: "", color: "#00897B", emoji: "🏪", valid_until: "",
};

function colorForCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  return cat ? cat.color : "#00897B";
}
function emojiForCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  return cat ? cat.emoji : "🏪";
}

const S = {
  wrap: { minHeight: "100vh", background: "#012A2A", fontFamily: "'Poppins', sans-serif", color: "white", paddingBottom: 60 },
  header: { background: "linear-gradient(160deg, #006666 0%, #004D4D 60%, #012A2A 100%)", padding: "44px 20px 24px", textAlign: "center" },
  card: { maxWidth: 480, margin: "20px auto 0", padding: "0 16px" },
  section: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px 16px", marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#00ACC1", textTransform: "uppercase", marginBottom: 14 },
  label: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 5, display: "block", fontWeight: 600 },
  input: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "white", padding: "11px 13px", fontSize: 13, fontFamily: "'Poppins',sans-serif", outline: "none", marginBottom: 12, boxSizing: "border-box" },
  textarea: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "white", padding: "11px 13px", fontSize: 13, fontFamily: "'Poppins',sans-serif", outline: "none", marginBottom: 12, resize: "vertical", minHeight: 68, boxSizing: "border-box" },
  row: { display: "flex", gap: 10 },
  btnPrimary: { width: "100%", background: "linear-gradient(135deg, #FF6B35, #FF8A50)", border: "none", borderRadius: 14, color: "white", fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700, padding: "15px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 20px rgba(255,107,53,0.35)" },
  btnSecondary: { flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, color: "rgba(255,255,255,0.6)", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, padding: "13px", cursor: "pointer" },
  btnTeal: { flex: 1, background: "rgba(0,172,193,0.15)", border: "1px solid rgba(0,172,193,0.35)", borderRadius: 14, color: "#00ACC1", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, padding: "13px", cursor: "pointer" },
};

function Field({ label, name, value, onChange, placeholder, type = "text", hint, autoComplete }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 5, marginTop: -4 }}>{hint}</div>}
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={S.input} autoComplete={autoComplete || "on"} />
    </div>
  );
}
function TextArea({ label, name, value, onChange, placeholder, hint }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 5, marginTop: -4 }}>{hint}</div>}
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} style={S.textarea} />
    </div>
  );
}

// Preview card (same style as in the app's deals screen)
function PreviewCard({ data }) {
  const cat = CATEGORIES.find(c => c.id === data.category);
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ background: data.color, borderRadius: 20, padding: "2px 10px", fontSize: 10, color: "white", fontFamily: "Arial" }}>
                {cat ? `${cat.emoji} ${cat.es}` : "Categoría"}
              </span>
            </div>
            <div style={{ fontWeight: "bold", fontSize: 15, color: "white", marginBottom: 4 }}>{data.business_name || "Nombre del negocio"}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "Arial", lineHeight: 1.5 }}>{data.description_es || "Descripción del negocio..."}</div>
          </div>
          <div style={{ background: `${data.color}33`, border: `1px solid ${data.color}66`, borderRadius: 10, padding: "6px 10px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "Arial", marginBottom: 2 }}>Ahorrás</div>
            <div style={{ fontSize: 12, fontWeight: "bold", color: "white", fontFamily: "Arial" }}>{data.savings_es || "—"}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, background: `${data.color}22`, border: `1px solid ${data.color}44`, borderRadius: 8, padding: "8px 12px" }}>
          <div style={{ fontSize: 13, color: "white", fontFamily: "Arial", fontWeight: "bold" }}>🎁 {data.discount_es || "Descuento..."}</div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerSetup() {
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === ADMIN_SECRET;

  const [step, setStep]               = useState(1);
  const [data, setData]               = useState(EMPTY);
  const [partnerCode, setPartnerCode] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [error, setError]             = useState(null);
  const [translating, setTranslating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [copied, setCopied]           = useState(false);

  // Load existing draft
  useEffect(() => {
    const code = localStorage.getItem(STORAGE_KEY);
    if (!code) return;
    setPartnerCode(code);
    fetch(`/api/partner?code=${code}&edit=1`)
      .then(r => r.json())
      .then(row => { if (row?.partner_code) setData(d => ({ ...d, ...row })); })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
    setSaved(false);
  }

  const saveStep = useCallback(async (nextStep) => {
    setSaving(true); setError(null);
    try {
      if (!partnerCode) {
        const r = await fetch("/api/partner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, ...(isAdmin ? { _admin_secret: ADMIN_SECRET } : {}) }),
        });
        const row = await r.json();
        if (!r.ok) throw new Error(row.error || row.message || JSON.stringify(row) || "Error al guardar");
        setPartnerCode(row.partner_code);
        localStorage.setItem(STORAGE_KEY, row.partner_code);
      } else {
        const r = await fetch("/api/partner", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, partner_code: partnerCode }),
        });
        if (!r.ok) { const e = await r.json(); throw new Error(e.error || e.message || JSON.stringify(e) || "Error"); }
      }
      setSaved(true);
      if (nextStep) setStep(nextStep);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  }, [data, partnerCode, isAdmin]);

  // Auto-translate ES → EN + FR using Claude
  async function autoTranslate() {
    if (!data.description_es && !data.discount_es) return;
    setTranslating(true);
    try {
      const toTranslate = {
        discount: data.discount_es,
        description: data.description_es,
        savings: data.savings_es,
        how_to_redeem: data.how_to_redeem_es,
      };
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Translate this deal info to English AND French. Return ONLY valid JSON with keys: en_discount, en_description, en_savings, en_how_to_redeem, fr_discount, fr_description, fr_savings, fr_how_to_redeem. No extra text.\n${JSON.stringify(toTranslate)}`,
          }],
        }),
      });
      const result = await res.json();
      const raw = result?.content?.[0]?.text || "";
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const t = JSON.parse(match[0]);
        setData(d => ({
          ...d,
          discount_en: t.en_discount || d.discount_en,
          description_en: t.en_description || d.description_en,
          savings_en: t.en_savings || d.savings_en,
          how_to_redeem_en: t.en_how_to_redeem || d.how_to_redeem_en,
          discount_fr: t.fr_discount || d.discount_fr,
          description_fr: t.fr_description || d.description_fr,
          savings_fr: t.fr_savings || d.savings_fr,
          how_to_redeem_fr: t.fr_how_to_redeem || d.how_to_redeem_fr,
        }));
      }
    } catch (e) { /* silent */ }
    finally { setTranslating(false); }
  }

  async function submitFinal() {
    await saveStep(null);
    if (isAdmin) {
      // Admin: activate immediately
      await fetch("/api/partner", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner_code: partnerCode, is_active: true, _admin_secret: ADMIN_SECRET }),
      });
      setSubmitted(true);
    } else {
      // Future: redirect to Stripe
      setSubmitted(true); // for now just mark as submitted (pending review)
    }
  }

  function copyLink() {
    const url = `https://holamaya.lat/partner-setup?edit=${partnerCode}&admin=${ADMIN_SECRET}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  // ── Steps ──────────────────────────────────────────────────────
  const step1 = (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>🏪 Tu negocio</div>
        <Field label="Nombre del negocio *" name="business_name" value={data.business_name} onChange={handleChange} placeholder="Ej: El Fogon, Allure Spa..." />
        <div>
          <label style={S.label}>Categoría *</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setData(d => ({ ...d, category: cat.id, color: cat.color, emoji: cat.emoji }))}
                style={{ background: data.category === cat.id ? "rgba(0,172,193,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${data.category === cat.id ? "rgba(0,172,193,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, color: data.category === cat.id ? "#4DD9E8" : "rgba(255,255,255,0.6)", padding: "9px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, textAlign: "left", fontFamily: "'Poppins',sans-serif" }}>
                {cat.emoji} {cat.es}
              </button>
            ))}
          </div>
        </div>
        <Field label="Dirección / ubicación" name="address" value={data.address} onChange={handleChange} placeholder="Calle 12 entre 5ta y 10ma Ave" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>📱 Contacto</div>
        <Field label="WhatsApp de reservas" name="whatsapp" value={data.whatsapp} onChange={handleChange} placeholder="529841234567" hint="Código de país + número. México: 52 + 10 dígitos" autoComplete="off" />
        <Field label="Tu nombre" name="contact_name" value={data.contact_name} onChange={handleChange} placeholder="Nombre del responsable" />
        <Field label="Email (interno, no visible al turista)" name="contact_email" value={data.contact_email} onChange={handleChange} placeholder="email@negocio.com" type="email" />
      </div>
    </>
  );

  const step2 = (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>🎁 El descuento (en español)</div>
        <Field label="Código de descuento" name="deal_code" value={data.deal_code} onChange={handleChange} placeholder="MAYA-FOGON" hint="El turista presenta este código para obtener el descuento" />
        <TextArea label="¿Qué descuento ofrecés? *" name="discount_es" value={data.discount_es} onChange={handleChange} placeholder="15% de descuento en toda la carta" />
        <TextArea label="Descripción del negocio" name="description_es" value={data.description_es} onChange={handleChange} placeholder="Tacos al pastor en comal de leña, ambiente local, precio justo..." />
        <div style={S.row}>
          <div style={{ flex: 1 }}>
            <Field label="¿Cuánto ahorra el turista?" name="savings_es" value={data.savings_es} onChange={handleChange} placeholder="Ahorra $200-400 MXN" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Válido hasta (opcional)" name="valid_until" value={data.valid_until} onChange={handleChange} type="date" />
          </div>
        </div>
        <TextArea label="¿Cómo canjear?" name="how_to_redeem_es" value={data.how_to_redeem_es} onChange={handleChange} placeholder="Mencioná el código MAYA-FOGON al pedir la cuenta" />
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>🌐 Traducción automática</div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, lineHeight: 1.6 }}>
          Traducimos el deal al inglés y francés automáticamente. Podés revisar y editar después.
        </p>
        <button onClick={autoTranslate} disabled={translating || (!data.discount_es && !data.description_es)}
          style={{ ...S.btnTeal, width: "100%" }}>
          {translating ? "⏳ Traduciendo..." : "🌐 Traducir a EN y FR automáticamente"}
        </button>
        {(data.discount_en || data.discount_fr) && (
          <div style={{ marginTop: 12, padding: 12, background: "rgba(0,172,193,0.08)", borderRadius: 10, fontSize: 11, color: "#4DD9E8" }}>
            ✓ Traducido — podés editar los campos EN/FR si querés ajustar algo
          </div>
        )}
      </div>

      {/* Optional: manual EN/FR fields */}
      {(data.discount_en || data.discount_fr) && (
        <div style={S.section}>
          <div style={S.sectionTitle}>EN — English</div>
          <TextArea label="Discount" name="discount_en" value={data.discount_en} onChange={handleChange} placeholder="15% off entire menu" />
          <TextArea label="Description" name="description_en" value={data.description_en} onChange={handleChange} placeholder="" />
          <Field label="Savings" name="savings_en" value={data.savings_en} onChange={handleChange} placeholder="Save $15-30 USD" />
          <TextArea label="How to redeem" name="how_to_redeem_en" value={data.how_to_redeem_en} onChange={handleChange} placeholder="" />

          <div style={S.sectionTitle}>FR — Français</div>
          <TextArea label="Réduction" name="discount_fr" value={data.discount_fr} onChange={handleChange} placeholder="15% sur toute la carte" />
          <TextArea label="Description" name="description_fr" value={data.description_fr} onChange={handleChange} placeholder="" />
          <Field label="Économies" name="savings_fr" value={data.savings_fr} onChange={handleChange} placeholder="Économise 15-30 USD" />
          <TextArea label="Comment utiliser" name="how_to_redeem_fr" value={data.how_to_redeem_fr} onChange={handleChange} placeholder="" />
        </div>
      )}
    </>
  );

  const step3 = (
    <>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowPreview(v => !v)} style={{ ...S.btnTeal, width: "100%" }}>
          {showPreview ? "▲ Ocultar preview" : "👁 Ver cómo aparece en la app"}
        </button>
      </div>
      {showPreview && <div style={{ marginBottom: 16 }}><PreviewCard data={data} /></div>}

      {!submitted ? (
        <div style={S.section}>
          <div style={S.sectionTitle}>🚀 {isAdmin ? "Activar deal" : "Enviar para revisión"}</div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16, lineHeight: 1.6 }}>
            {isAdmin
              ? "Modo admin — el deal se activa inmediatamente en la app."
              : "Revisaremos tu deal y te contactamos en 24hs para activarlo. El pago se gestiona al activar."
            }
          </p>
          <button onClick={submitFinal} disabled={saving || !data.business_name || !data.category || !data.discount_es}
            style={{ ...S.btnPrimary, background: isAdmin ? "linear-gradient(135deg, #00897B, #00ACC1)" : "linear-gradient(135deg, #FF6B35, #FF8A50)" }}>
            {saving ? "Guardando..." : isAdmin ? "⚡ Activar ahora" : "📩 Enviar deal"}
          </button>
        </div>
      ) : (
        <div style={{ background: "rgba(0,172,193,0.1)", border: "1px solid rgba(0,172,193,0.3)", borderRadius: 16, padding: "20px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#00ACC1", marginBottom: 6 }}>
            {isAdmin ? "¡Deal activo en la app!" : "¡Deal enviado!"}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4, lineHeight: 1.6 }}>
            Código: <span style={{ color: "white", fontFamily: "monospace", fontWeight: 700 }}>{partnerCode}</span>
          </div>
          {isAdmin && (
            <button onClick={copyLink} style={{ ...S.btnPrimary, marginTop: 14 }}>
              {copied ? "✓ ¡Copiado!" : "📋 Copiar link de edición"}
            </button>
          )}
        </div>
      )}
    </>
  );

  const STEPS = [
    { id: 1, emoji: "🏪", label: "El negocio" },
    { id: 2, emoji: "🎁", label: "El deal" },
    { id: 3, emoji: "🚀", label: "Publicar" },
  ];

  return (
    <div style={S.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={S.header}>
        <div style={{ fontSize: 13, letterSpacing: 4, color: "#00ACC1", fontWeight: 700, marginBottom: 4 }}>
          🌴 MAYA · SOCIOS
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 4 }}>
          {isAdmin ? "🔑 Panel Admin" : "Publicá tu deal"}
        </h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
          Tus descuentos en el celular de miles de turistas
        </p>
      </div>

      {/* Progress */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 6 }}>
        {STEPS.map((s, idx) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : 0, gap: 6 }}>
            <div style={{ width: 28, height: 22, borderRadius: 20, background: step > s.id ? "#00ACC1" : step === s.id ? "#FF6B35" : "rgba(255,255,255,0.12)", border: `1px solid ${step > s.id ? "#00ACC1" : step === s.id ? "#FF6B35" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0 }}>
              {step > s.id ? "✓" : s.emoji}
            </div>
            {idx < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: step > s.id ? "#00ACC1" : "rgba(255,255,255,0.1)", borderRadius: 2 }} />}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
        Paso {step} de 3 · <span style={{ color: "rgba(255,255,255,0.7)" }}>{STEPS[step - 1].label}</span>
      </div>

      {saved && (
        <div style={{ maxWidth: 480, margin: "10px auto 0", padding: "0 16px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(0,172,193,0.15)", border: "1px solid rgba(0,172,193,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#00ACC1", fontWeight: 600 }}>✓ Guardado</span>
        </div>
      )}
      {error && (
        <div style={{ maxWidth: 480, margin: "10px auto 0", padding: "0 16px" }}>
          <div style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.35)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#FF8A50" }}>⚠️ {error}</div>
        </div>
      )}

      <div style={S.card}>
        {step === 1 && step1}
        {step === 2 && step2}
        {step === 3 && step3}
      </div>

      {/* Nav buttons */}
      <div style={{ maxWidth: 480, margin: "8px auto 0", padding: "0 16px" }}>
        {step < 3 ? (
          <div style={S.row}>
            {step > 1 && <button onClick={() => setStep(s => s - 1)} style={S.btnSecondary}>← Atrás</button>}
            <button onClick={() => saveStep(step + 1)} style={{ ...S.btnPrimary, flex: 1 }} disabled={saving}>
              {saving ? "Guardando..." : `Siguiente → ${STEPS[step].emoji}`}
            </button>
          </div>
        ) : !submitted && (
          <div style={S.row}>
            <button onClick={() => setStep(2)} style={S.btnSecondary}>← Atrás</button>
            <button onClick={() => saveStep(null)} style={{ ...S.btnTeal, flex: 1 }} disabled={saving}>
              {saving ? "Guardando..." : "💾 Guardar borrador"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        input:focus, textarea:focus { border-color: rgba(0,172,193,0.5) !important; background: rgba(0,172,193,0.08) !important; }
        button:disabled { opacity: 0.5; cursor: not-allowed !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
