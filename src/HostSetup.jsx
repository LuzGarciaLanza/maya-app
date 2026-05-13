import { useState, useEffect, useCallback } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "maya_host_edit_code";

const EMPTY = {
  host_name: "", host_email: "",
  property_name: "", floor_unit: "",
  checkin_time: "3:00 PM", checkout_time: "11:00 AM",
  door_code: "", access_instructions: "", exact_address: "",
  parking_info: "", wifi_name: "", wifi_password: "",
  ac_instructions: "", boiler_instructions: "", washer_instructions: "",
  trash_info: "", house_rules: "", emergency_contact: "",
  nearest_supermarket: "", nearest_pharmacy: "", nearest_hospital: "",
  nearest_atm: "", recommended_restaurant: "",
  how_to_centro: "", how_to_beach: "", trusted_taxi: "",
  host_recommendations: "", tours_info: "", extra_notes: "",
};

const STEPS = [
  { id: 1, label: "Check-in & Acceso",  emoji: "🔑" },
  { id: 2, label: "La Propiedad",       emoji: "🏠" },
  { id: 3, label: "Servicios cercanos", emoji: "🛒" },
  { id: 4, label: "Extras & Publicar",  emoji: "⭐" },
];

// ─── Styled primitives (inline — no CSS modules needed) ───────────────────────
const S = {
  wrap: {
    minHeight: "100vh",
    background: "#012A2A",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    padding: "0 0 60px",
  },
  header: {
    background: "linear-gradient(160deg, #006666 0%, #004D4D 60%, #012A2A 100%)",
    padding: "44px 20px 24px",
    textAlign: "center",
  },
  logo: {
    fontSize: 13, letterSpacing: 4, color: "#00ACC1", fontWeight: 700,
    marginBottom: 4,
  },
  title: {
    fontSize: 22, fontWeight: 900, color: "white", marginBottom: 4,
  },
  sub: {
    fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5,
  },
  progress: {
    display: "flex", alignItems: "center",
    padding: "16px 20px 0",
    maxWidth: 480, margin: "0 auto",
    gap: 6,
  },
  stepDot: (active, done) => ({
    width: done ? 28 : active ? 28 : 22,
    height: 22,
    borderRadius: 20,
    background: done ? "#00ACC1" : active ? "#FF6B35" : "rgba(255,255,255,0.12)",
    border: `1px solid ${done ? "#00ACC1" : active ? "#FF6B35" : "rgba(255,255,255,0.15)"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, fontWeight: 700, color: "white",
    transition: "all 0.25s",
    flexShrink: 0,
  }),
  stepLine: (done) => ({
    flex: 1, height: 2,
    background: done ? "#00ACC1" : "rgba(255,255,255,0.1)",
    borderRadius: 2, transition: "background 0.3s",
  }),
  stepLabel: {
    textAlign: "center", maxWidth: 480, margin: "6px auto 0",
    fontSize: 11, color: "rgba(255,255,255,0.45)",
  },
  card: {
    maxWidth: 480, margin: "20px auto 0",
    padding: "0 16px",
  },
  section: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: "18px 16px", marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#00ACC1",
    textTransform: "uppercase", marginBottom: 14,
  },
  label: {
    fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 5,
    display: "block", fontWeight: 600,
  },
  input: {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
    color: "white", padding: "11px 13px",
    fontSize: 13, fontFamily: "'Poppins',sans-serif",
    outline: "none", marginBottom: 12,
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
    color: "white", padding: "11px 13px",
    fontSize: 13, fontFamily: "'Poppins',sans-serif",
    outline: "none", marginBottom: 12, resize: "vertical", minHeight: 72,
    boxSizing: "border-box",
  },
  row: { display: "flex", gap: 10 },
  btnPrimary: {
    width: "100%", background: "linear-gradient(135deg, #FF6B35, #FF8A50)",
    border: "none", borderRadius: 14, color: "white",
    fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 700,
    padding: "15px 20px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 6px 20px rgba(255,107,53,0.35)",
  },
  btnSecondary: {
    flex: 1, background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14,
    color: "rgba(255,255,255,0.6)",
    fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600,
    padding: "13px", cursor: "pointer",
  },
  btnTeal: {
    flex: 1, background: "rgba(0,172,193,0.15)",
    border: "1px solid rgba(0,172,193,0.35)", borderRadius: 14,
    color: "#00ACC1",
    fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600,
    padding: "13px", cursor: "pointer",
  },
  savedBadge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "rgba(0,172,193,0.15)", border: "1px solid rgba(0,172,193,0.3)",
    borderRadius: 20, padding: "4px 12px",
    fontSize: 11, color: "#00ACC1", fontWeight: 600,
  },
};

// ─── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, placeholder, type = "text", hint }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 5, marginTop: -4 }}>{hint}</div>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={S.input}
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, hint }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 5, marginTop: -4 }}>{hint}</div>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={S.textarea}
      />
    </div>
  );
}

// ─── Preview component ────────────────────────────────────────────────────────
function Preview({ data, hostCode }) {
  const sections = [
    {
      emoji: "🔑", title: "Check-in & Acceso",
      items: [
        { label: "Check-in", value: data.checkin_time },
        { label: "Check-out", value: data.checkout_time },
        { label: "Código de puerta", value: data.door_code },
        { label: "Cómo llegar", value: data.access_instructions },
        { label: "Dirección", value: data.exact_address },
        { label: "Estacionamiento", value: data.parking_info },
        { label: "WiFi", value: data.wifi_name && data.wifi_password ? `${data.wifi_name} / ${data.wifi_password}` : data.wifi_name || data.wifi_password },
      ],
    },
    {
      emoji: "🏠", title: "La Propiedad",
      items: [
        { label: "Piso / Unidad", value: data.floor_unit },
        { label: "Aire acondicionado", value: data.ac_instructions },
        { label: "Boiler / Agua caliente", value: data.boiler_instructions },
        { label: "Lavadora", value: data.washer_instructions },
        { label: "Basura", value: data.trash_info },
        { label: "Reglas de la casa", value: data.house_rules },
        { label: "Emergencias", value: data.emergency_contact },
      ],
    },
    {
      emoji: "🛒", title: "Servicios cercanos",
      items: [
        { label: "Supermercado", value: data.nearest_supermarket },
        { label: "Farmacia", value: data.nearest_pharmacy },
        { label: "Hospital / Clínica", value: data.nearest_hospital },
        { label: "Cajero ATM", value: data.nearest_atm },
        { label: "Restaurante recomendado", value: data.recommended_restaurant },
      ],
    },
    {
      emoji: "🚕", title: "Transporte",
      items: [
        { label: "Al centro", value: data.how_to_centro },
        { label: "A la playa", value: data.how_to_beach },
        { label: "Taxi de confianza", value: data.trusted_taxi },
      ],
    },
    {
      emoji: "⭐", title: "Recomendaciones del host",
      items: [
        { label: "Mis favoritos", value: data.host_recommendations },
        { label: "Tours y actividades", value: data.tours_info },
        { label: "Otros datos importantes", value: data.extra_notes },
      ],
    },
  ];

  return (
    <div style={{ background: "#012A2A", borderRadius: 16, border: "1px solid rgba(0,172,193,0.25)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #004D4D, #006666)", padding: "20px 18px" }}>
        <div style={{ fontSize: 11, color: "#00ACC1", letterSpacing: 3, fontWeight: 700, marginBottom: 4 }}>MY STAY</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "white" }}>{data.property_name || "Tu propiedad"}</div>
        {data.floor_unit && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{data.floor_unit}</div>}
      </div>

      {/* Sections */}
      <div style={{ padding: "12px 14px" }}>
        {sections.map((sec) => {
          const filled = sec.items.filter(i => i.value);
          if (!filled.length) return null;
          return (
            <div key={sec.title} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#00ACC1", letterSpacing: 1.5, marginBottom: 8 }}>
                {sec.emoji} {sec.title.toUpperCase()}
              </div>
              {filled.map(item => (
                <div key={item.label} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", minWidth: 90, paddingTop: 2, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, flex: 1 }}>{item.value}</div>
                </div>
              ))}
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 0 6px" }} />
            </div>
          );
        })}
      </div>

      {/* Link */}
      {hostCode && (
        <div style={{ margin: "0 14px 16px", background: "rgba(255,213,79,0.08)", border: "1px solid rgba(255,213,79,0.25)", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 10, color: "#FFD54F", fontWeight: 700, marginBottom: 4 }}>LINK PARA TUS HUÉSPEDES</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "monospace", wordBreak: "break-all" }}>
            holamaya.lat?host={hostCode}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HostSetup() {
  const [step, setStep]         = useState(1);
  const [data, setData]         = useState(EMPTY);
  const [hostCode, setHostCode] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [published, setPublished]     = useState(false);
  const [copied, setCopied]           = useState(false);

  // Load existing draft on mount
  useEffect(() => {
    const code = localStorage.getItem(STORAGE_KEY);
    if (!code) return;
    setHostCode(code);
    fetch(`/api/host-property?code=${code}&edit=1`)
      .then(r => r.json())
      .then(row => {
        if (row && row.host_code) {
          setData(d => ({ ...d, ...row }));
          setPublished(row.is_published);
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
    setSaved(false);
  }

  // Save current step
  const saveStep = useCallback(async (nextStep) => {
    setSaving(true);
    setError(null);
    try {
      if (!hostCode) {
        // First save → create
        const r = await fetch("/api/host-property", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const row = await r.json();
        if (!r.ok) throw new Error(row.error || "Error al guardar");
        setHostCode(row.host_code);
        localStorage.setItem(STORAGE_KEY, row.host_code);
      } else {
        // Update
        const r = await fetch("/api/host-property", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, host_code: hostCode }),
        });
        if (!r.ok) {
          const err = await r.json();
          throw new Error(err.error || "Error al guardar");
        }
      }
      setSaved(true);
      if (nextStep) setStep(nextStep);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [data, hostCode]);

  async function publish() {
    setSaving(true);
    setError(null);
    try {
      const r = await fetch("/api/host-property", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host_code: hostCode, is_published: true }),
      });
      if (!r.ok) throw new Error("Error al publicar");
      setPublished(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function copyLink() {
    const url = `https://holamaya.lat?host=${hostCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Steps content ──────────────────────────────────────────────────────────
  const step1 = (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>🏷️ Tu propiedad</div>
        <Field label="Nombre de la propiedad *" name="property_name" value={data.property_name} onChange={handleChange} placeholder="Ej: Depto Azul, Casa Coralina…" />
        <Field label="Tu nombre" name="host_name" value={data.host_name} onChange={handleChange} placeholder="Nombre del host" />
        <Field label="Tu email (privado)" name="host_email" value={data.host_email} onChange={handleChange} placeholder="para recuperar tu cuenta" type="email" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>🔑 Check-in & Horarios</div>
        <div style={S.row}>
          <div style={{ flex: 1 }}>
            <Field label="Check-in" name="checkin_time" value={data.checkin_time} onChange={handleChange} placeholder="3:00 PM" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Check-out" name="checkout_time" value={data.checkout_time} onChange={handleChange} placeholder="11:00 AM" />
          </div>
        </div>
        <Field label="Código de puerta / caja de llaves" name="door_code" value={data.door_code} onChange={handleChange} placeholder="Ej: 1234# · o instrucciones de la caja" />
        <TextArea label="Instrucciones de acceso" name="access_instructions" value={data.access_instructions} onChange={handleChange} placeholder="Cómo entrar al edificio, qué puerta, ascensor, etc." hint="Todo lo que necesita saber un huésped nuevo para entrar solo" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>📍 Ubicación</div>
        <TextArea label="Dirección exacta" name="exact_address" value={data.exact_address} onChange={handleChange} placeholder="Calle 34 entre Ave 5 y Ave 10, Depto 302, Playa del Carmen" />
        <TextArea label="Estacionamiento" name="parking_info" value={data.parking_info} onChange={handleChange} placeholder="Cochera cubierta incluida · lugar #12 · o calle X" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>📶 WiFi</div>
        <div style={S.row}>
          <div style={{ flex: 1 }}>
            <Field label="Nombre de la red" name="wifi_name" value={data.wifi_name} onChange={handleChange} placeholder="CasaAzul_5G" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Contraseña" name="wifi_password" value={data.wifi_password} onChange={handleChange} placeholder="maya2026" />
          </div>
        </div>
      </div>
    </>
  );

  const step2 = (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>🏠 La propiedad</div>
        <Field label="Piso y número de departamento" name="floor_unit" value={data.floor_unit} onChange={handleChange} placeholder="Piso 3, Depto 302" />
        <TextArea label="❄️ Aire acondicionado" name="ac_instructions" value={data.ac_instructions} onChange={handleChange} placeholder="Presioná MODE hasta COOL · temperatura recomendada: 22°C · apagalo al salir" />
        <TextArea label="🚿 Boiler / Agua caliente" name="boiler_instructions" value={data.boiler_instructions} onChange={handleChange} placeholder="Switch rojo en el baño · esperá 10 min antes de ducharte · apagar después de usar" />
        <TextArea label="👕 Lavadora" name="washer_instructions" value={data.washer_instructions} onChange={handleChange} placeholder="Jabón bajo el sink · ciclo normal 30 min · tender en la terraza" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>🗑️ Basura & Limpieza</div>
        <TextArea label="Basura — días y lugar" name="trash_info" value={data.trash_info} onChange={handleChange} placeholder="Lunes y jueves · bolsa negra en el contenedor del pasillo · no tirar por balcón" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>📋 Reglas de la casa</div>
        <TextArea label="Reglas" name="house_rules" value={data.house_rules} onChange={handleChange} placeholder="No fumar adentro · no mascotas · silencio después de 11pm · máx 2 huéspedes extra con aviso previo" hint="Sé claro y amigable — esto lo leerán cuando tengan dudas" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>🆘 Contacto de emergencia</div>
        <Field label="Tu nombre y número de WhatsApp" name="emergency_contact" value={data.emergency_contact} onChange={handleChange} placeholder="Ej: Carlos (host) · WhatsApp +52 984 123 4567" />
      </div>
    </>
  );

  const step3 = (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>🛒 Servicios cercanos</div>
        <Field label="Supermercado más cercano" name="nearest_supermarket" value={data.nearest_supermarket} onChange={handleChange} placeholder="Walmart Express · 2 cuadras por Calle 34" />
        <Field label="Farmacia más cercana" name="nearest_pharmacy" value={data.nearest_pharmacy} onChange={handleChange} placeholder="Farmacia del Ahorro · Calle 28 y Ave 10" />
        <Field label="Hospital / Clínica" name="nearest_hospital" value={data.nearest_hospital} onChange={handleChange} placeholder="CMQ Hospital · Ave 1 entre Calle 12 y 14" />
        <Field label="Cajero ATM más cercano" name="nearest_atm" value={data.nearest_atm} onChange={handleChange} placeholder="BBVA · 5ta Ave con Calle 30" />
        <Field label="Restaurante que recomendás" name="recommended_restaurant" value={data.recommended_restaurant} onChange={handleChange} placeholder="El Fogon · Calle 30 y Ave 10 · los mejores tacos al pastor" />
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>🚕 Transporte</div>
        <TextArea label="Cómo llegar al centro" name="how_to_centro" value={data.how_to_centro} onChange={handleChange} placeholder="Colectivo azul en Ave 20 · $15 pesos · sale cada 5 min · bájate en 5ta y Calle 2" />
        <TextArea label="Cómo llegar a la playa" name="how_to_beach" value={data.how_to_beach} onChange={handleChange} placeholder="10 min a pie por Calle 34 hasta llegar al malecón · acceso libre en Playa 38" />
        <Field label="Taxi o transporte de confianza" name="trusted_taxi" value={data.trusted_taxi} onChange={handleChange} placeholder="Juan (confiable, habla inglés) · WhatsApp +52 984 555 1234" />
      </div>
    </>
  );

  const step4 = (
    <>
      <div style={S.section}>
        <div style={S.sectionTitle}>⭐ Recomendaciones personales</div>
        <TextArea label="Mis lugares favoritos" name="host_recommendations" value={data.host_recommendations} onChange={handleChange} placeholder="Para desayuno me encanta La Esquina del Kilo · de noche el Canibal Royal tiene buena onda · cenote Cristalino es el más lindo cerca" hint="Esto hace la diferencia — los huéspedes lo agradecen mucho" />
        <TextArea label="Tours y actividades que recomendás" name="tours_info" value={data.tours_info} onChange={handleChange} placeholder="Chichén Itzá con Cancun Adventures (preguntar por Miguel) · cenotes + comida con Maya Tours · precio acordado $800 pesos" />
        <TextArea label="Cualquier otro dato importante" name="extra_notes" value={data.extra_notes} onChange={handleChange} placeholder="El ascensor tiene demora por las mañanas · el mercado artesanal del sábado en Parque Los Fundadores es gratis · evitar salir solo de madrugada por Ave 30 norte" />
      </div>

      {/* Preview */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setShowPreview(v => !v)} style={S.btnTeal}>
          {showPreview ? "▲ Ocultar vista previa" : "👁 Ver cómo lo verá tu huésped"}
        </button>
      </div>
      {showPreview && (
        <div style={{ marginBottom: 16 }}>
          <Preview data={data} hostCode={hostCode} />
        </div>
      )}

      {/* Publish */}
      {!published ? (
        <div style={S.section}>
          <div style={S.sectionTitle}>🚀 Publicar</div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, lineHeight: 1.6 }}>
            Al publicar, se activa tu link. Podés editarlo en cualquier momento y los cambios se reflejan de inmediato.
          </p>
          <button
            onClick={async () => { await saveStep(null); await publish(); }}
            style={{ ...S.btnPrimary, background: "linear-gradient(135deg, #00897B, #00ACC1)" }}
            disabled={saving || !hostCode}
          >
            {saving ? "Guardando…" : "🌐 Publicar y activar mi link"}
          </button>
        </div>
      ) : (
        <div style={{ background: "rgba(0,172,193,0.1)", border: "1px solid rgba(0,172,193,0.3)", borderRadius: 16, padding: "20px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#00ACC1", marginBottom: 6 }}>¡Tu link está activo!</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16, lineHeight: 1.6 }}>
            Mandáselo a tus huéspedes por WhatsApp, mensaje de Airbnb, o pegá un QR en el depto.
          </div>
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontFamily: "monospace", fontSize: 13, color: "white", wordBreak: "break-all" }}>
            holamaya.lat?host={hostCode}
          </div>
          <button onClick={copyLink} style={{ ...S.btnPrimary, marginBottom: 8 }}>
            {copied ? "✓ ¡Copiado!" : "📋 Copiar link"}
          </button>
          <button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`¡Hola! Para info sobre el depto y recomendaciones locales, abrí Maya: https://holamaya.lat?host=${hostCode}`)}`, "_blank")}
            style={{ ...S.btnPrimary, background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          >
            📱 Compartir por WhatsApp
          </button>
        </div>
      )}
    </>
  );

  const stepContent = [null, step1, step2, step3, step4][step];

  return (
    <div style={S.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>🌴 MAYA · MY STAY</div>
        <h1 style={S.title}>Configura tu propiedad</h1>
        <p style={S.sub}>Tus huéspedes tendrán toda la info del depto<br />en su celular en segundos.</p>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={S.progress}>
          {STEPS.map((s, idx) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : 0, gap: 6 }}>
              <div style={S.stepDot(step === s.id, step > s.id)}>
                {step > s.id ? "✓" : s.emoji}
              </div>
              {idx < STEPS.length - 1 && <div style={S.stepLine(step > s.id)} />}
            </div>
          ))}
        </div>
        <div style={S.stepLabel}>
          Paso {step} de {STEPS.length} · <span style={{ color: "rgba(255,255,255,0.7)" }}>{STEPS[step - 1].label}</span>
        </div>
      </div>

      {/* Saved indicator */}
      {saved && (
        <div style={{ maxWidth: 480, margin: "12px auto 0", padding: "0 16px" }}>
          <span style={S.savedBadge}>✓ Guardado automáticamente</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ maxWidth: 480, margin: "10px auto 0", padding: "0 16px" }}>
          <div style={{ background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.35)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#FF8A50" }}>
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* Step content */}
      <div style={S.card}>{stepContent}</div>

      {/* Navigation */}
      <div style={{ maxWidth: 480, margin: "8px auto 0", padding: "0 16px" }}>
        {step < 4 ? (
          <div style={S.row}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={S.btnSecondary}>
                ← Atrás
              </button>
            )}
            <button
              onClick={() => saveStep(step + 1)}
              style={{ ...S.btnPrimary, flex: 1 }}
              disabled={saving}
            >
              {saving ? "Guardando…" : `Siguiente → ${STEPS[step].emoji}`}
            </button>
          </div>
        ) : (
          step < 4 || (!published && (
            <div style={S.row}>
              <button onClick={() => setStep(3)} style={S.btnSecondary}>← Atrás</button>
              <button
                onClick={() => saveStep(null)}
                style={{ ...S.btnTeal, flex: 1 }}
                disabled={saving}
              >
                {saving ? "Guardando…" : "💾 Guardar borrador"}
              </button>
            </div>
          ))
        )}
        {step === 4 && !published && (
          <div style={{ ...S.row, marginTop: 8 }}>
            <button onClick={() => setStep(3)} style={S.btnSecondary}>← Atrás</button>
            <button
              onClick={() => saveStep(null)}
              style={{ ...S.btnTeal, flex: 1 }}
              disabled={saving}
            >
              {saving ? "Guardando…" : "💾 Guardar borrador"}
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
