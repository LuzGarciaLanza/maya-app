// MyStay.jsx — Guest view of host's property info
import { useState } from "react";

const TEXT_FIELDS = [
  "property_name","floor_unit","checkin_time","checkout_time","door_code",
  "access_instructions","exact_address","parking_info","wifi_name","wifi_password",
  "ac_instructions","boiler_instructions","washer_instructions","trash_info",
  "house_rules","emergency_contact","nearest_supermarket","nearest_pharmacy",
  "nearest_hospital","nearest_atm","recommended_restaurant","how_to_centro",
  "how_to_beach","trusted_taxi","host_recommendations","tours_info","extra_notes",
];

export default function MyStay({ hostData, onBack, lang }) {
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated]   = useState(null); // null = show original

  if (!hostData) return null;

  const data = translated || hostData; // show translated if available

  const langName = { en: "English", es: "español", fr: "français" }[lang] || "English";

  async function translateContent() {
    setTranslating(true);
    try {
      // Build a compact object with only filled text fields
      const toTranslate = {};
      TEXT_FIELDS.forEach(k => { if (hostData[k]) toTranslate[k] = hostData[k]; });

      const prompt = `Translate the following JSON property info fields to ${langName}.
Return ONLY a valid JSON object with the same keys and translated values. No extra text.
${JSON.stringify(toTranslate)}`;

      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const result = await res.json();
      const raw = result?.content?.[0]?.text || "";
      // Extract JSON from response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setTranslated({ ...hostData, ...parsed });
      }
    } catch (e) {
      // silent fail — keep original
    } finally {
      setTranslating(false);
    }
  }

  const t = {
    back: { en: "Back", es: "Volver", fr: "Retour" }[lang] || "Back",
    noInfo: { en: "No info added yet", es: "Sin información aún", fr: "Pas encore d'info" }[lang],
  };

  const sections = [
    {
      emoji: "🔑",
      title: { en: "Check-in & Access", es: "Check-in & Acceso", fr: "Arrivée & Accès" }[lang],
      items: [
        { label: { en: "Check-in", es: "Check-in", fr: "Arrivée" }[lang], value: data.checkin_time },
        { label: { en: "Check-out", es: "Check-out", fr: "Départ" }[lang], value: data.checkout_time },
        { label: { en: "Door code", es: "Código de puerta", fr: "Code d'entrée" }[lang], value: data.door_code, mono: true },
        { label: { en: "How to get in", es: "Cómo entrar", fr: "Comment entrer" }[lang], value: data.access_instructions },
        { label: { en: "Address", es: "Dirección", fr: "Adresse" }[lang], value: data.exact_address },
        { label: { en: "Parking", es: "Estacionamiento", fr: "Stationnement" }[lang], value: data.parking_info },
      ],
    },
    {
      emoji: "📶",
      title: "WiFi",
      items: [
        { label: { en: "Network", es: "Red", fr: "Réseau" }[lang], value: data.wifi_name, mono: true, highlight: true },
        { label: { en: "Password", es: "Contraseña", fr: "Mot de passe" }[lang], value: data.wifi_password, mono: true, highlight: true },
      ],
    },
    {
      emoji: "🏠",
      title: { en: "The Property", es: "La Propiedad", fr: "Le Logement" }[lang],
      items: [
        { label: { en: "Floor / Unit", es: "Piso / Unidad", fr: "Étage / Unité" }[lang], value: data.floor_unit },
        { label: { en: "A/C", es: "Aire acondicionado", fr: "Climatisation" }[lang], value: data.ac_instructions },
        { label: { en: "Hot water", es: "Agua caliente", fr: "Eau chaude" }[lang], value: data.boiler_instructions },
        { label: { en: "Washer", es: "Lavadora", fr: "Machine à laver" }[lang], value: data.washer_instructions },
        { label: { en: "Trash", es: "Basura", fr: "Poubelle" }[lang], value: data.trash_info },
        { label: { en: "House rules", es: "Reglas", fr: "Règles" }[lang], value: data.house_rules },
      ],
    },
    {
      emoji: "🛒",
      title: { en: "Nearby services", es: "Servicios cercanos", fr: "Services proches" }[lang],
      items: [
        { label: { en: "Supermarket", es: "Supermercado", fr: "Supermarché" }[lang], value: data.nearest_supermarket },
        { label: { en: "Pharmacy", es: "Farmacia", fr: "Pharmacie" }[lang], value: data.nearest_pharmacy },
        { label: { en: "Hospital", es: "Hospital", fr: "Hôpital" }[lang], value: data.nearest_hospital },
        { label: { en: "ATM", es: "Cajero ATM", fr: "Distributeur" }[lang], value: data.nearest_atm },
        { label: { en: "Host's pick", es: "Restaurante recomendado", fr: "Resto du host" }[lang], value: data.recommended_restaurant },
      ],
    },
    {
      emoji: "🚕",
      title: { en: "Transport", es: "Transporte", fr: "Transport" }[lang],
      items: [
        { label: { en: "To the center", es: "Al centro", fr: "Au centre" }[lang], value: data.how_to_centro },
        { label: { en: "To the beach", es: "A la playa", fr: "À la plage" }[lang], value: data.how_to_beach },
        { label: { en: "Trusted taxi", es: "Taxi de confianza", fr: "Taxi fiable" }[lang], value: data.trusted_taxi },
      ],
    },
    {
      emoji: "⭐",
      title: { en: "Host's recommendations", es: "Recomendaciones del host", fr: "Recommandations du host" }[lang],
      items: [
        { label: { en: "Favorites", es: "Mis favoritos", fr: "Mes favoris" }[lang], value: data.host_recommendations },
        { label: { en: "Tours", es: "Tours recomendados", fr: "Tours recommandés" }[lang], value: data.tours_info },
        { label: { en: "Extra tips", es: "Otros datos", fr: "Autres infos" }[lang], value: data.extra_notes },
      ],
    },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#012A2A",
      fontFamily: "'Poppins', sans-serif", color: "white",
      maxWidth: 700, margin: "0 auto",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #006666 0%, #004D4D 60%, #012A2A 100%)",
        padding: "44px 16px 20px", position: "relative",
      }}>
        {/* Back button */}
        <button onClick={onBack} style={{
          position: "absolute", top: 48, left: 16,
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 20, color: "white", padding: "5px 14px",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Poppins',sans-serif",
        }}>
          ← {t.back}
        </button>

        {/* Translate button — top right */}
        {lang !== "es" && (
          <button
            onClick={translated ? () => setTranslated(null) : translateContent}
            disabled={translating}
            style={{
              position: "absolute", top: 48, right: 16,
              background: translated ? "rgba(0,172,193,0.25)" : "rgba(255,255,255,0.12)",
              border: `1px solid ${translated ? "rgba(0,172,193,0.5)" : "rgba(255,255,255,0.2)"}`,
              borderRadius: 20, color: translated ? "#4DD9E8" : "white",
              padding: "5px 12px", fontSize: 11, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Poppins',sans-serif",
            }}>
            {translating ? "⏳" : translated ? "✓ " + langName : "🌐 " + langName}
          </button>
        )}

        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <div style={{ fontSize: 11, color: "#00ACC1", letterSpacing: 3, fontWeight: 700, marginBottom: 6 }}>
            🏠 MY STAY
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 900, color: "white", marginBottom: 4,
            lineHeight: 1.2,
          }}>
            {data.property_name || "Tu alojamiento"}
          </h1>
          {data.floor_unit && (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              {data.floor_unit}
            </div>
          )}
        </div>
      </div>

      {/* Emergency contact — always visible at top */}
      {data.emergency_contact && (
        <div style={{
          margin: "14px 14px 0",
          background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
          borderRadius: 14, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 22 }}>🆘</span>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,107,53,0.8)", fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>
              {{ en: "EMERGENCY CONTACT", es: "EMERGENCIAS", fr: "URGENCES" }[lang]}
            </div>
            <div style={{ fontSize: 13, color: "white", fontWeight: 600 }}>
              {data.emergency_contact}
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div style={{ padding: "14px 14px 40px", flex: 1, overflowY: "auto" }}>
        {sections.map((sec) => {
          const filled = sec.items.filter(i => i.value);
          if (!filled.length) return null;
          return (
            <div key={sec.title} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, marginBottom: 12, overflow: "hidden",
            }}>
              {/* Section header */}
              <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>{sec.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#00ACC1", letterSpacing: 1.5, textTransform: "uppercase" }}>
                  {sec.title}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: "10px 16px 6px" }}>
                {filled.map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start",
                  }}>
                    <div style={{
                      fontSize: 10, color: "rgba(255,255,255,0.35)",
                      minWidth: 88, paddingTop: 2, fontWeight: 600,
                      lineHeight: 1.4, flexShrink: 0,
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: item.highlight ? "#4DD9E8" : "rgba(255,255,255,0.85)",
                      lineHeight: 1.55,
                      fontFamily: item.mono ? "monospace" : "'Poppins',sans-serif",
                      fontWeight: item.highlight ? 700 : 400,
                      background: item.mono ? "rgba(0,172,193,0.08)" : "transparent",
                      borderRadius: item.mono ? 6 : 0,
                      padding: item.mono ? "2px 6px" : 0,
                      flex: 1,
                      wordBreak: "break-word",
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer note */}
        <div style={{ textAlign: "center", padding: "8px 0 0" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", lineHeight: 2 }}>
            Info provided by your host · holamaya.lat
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
