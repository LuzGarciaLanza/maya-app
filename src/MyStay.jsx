// MyStay.jsx — Guest view of host's property info

export default function MyStay({ hostData, onBack, lang }) {
  if (!hostData) return null;

  const t = {
    back: { en: "Back", es: "Volver", fr: "Retour" }[lang] || "Back",
    noInfo: { en: "No info added yet", es: "Sin información aún", fr: "Pas encore d'info" }[lang],
  };

  const sections = [
    {
      emoji: "🔑",
      title: { en: "Check-in & Access", es: "Check-in & Acceso", fr: "Arrivée & Accès" }[lang],
      items: [
        { label: { en: "Check-in", es: "Check-in", fr: "Arrivée" }[lang], value: hostData.checkin_time },
        { label: { en: "Check-out", es: "Check-out", fr: "Départ" }[lang], value: hostData.checkout_time },
        { label: { en: "Door code", es: "Código de puerta", fr: "Code d'entrée" }[lang], value: hostData.door_code, mono: true },
        { label: { en: "How to get in", es: "Cómo entrar", fr: "Comment entrer" }[lang], value: hostData.access_instructions },
        { label: { en: "Address", es: "Dirección", fr: "Adresse" }[lang], value: hostData.exact_address },
        { label: { en: "Parking", es: "Estacionamiento", fr: "Stationnement" }[lang], value: hostData.parking_info },
      ],
    },
    {
      emoji: "📶",
      title: "WiFi",
      items: [
        { label: { en: "Network", es: "Red", fr: "Réseau" }[lang], value: hostData.wifi_name, mono: true, highlight: true },
        { label: { en: "Password", es: "Contraseña", fr: "Mot de passe" }[lang], value: hostData.wifi_password, mono: true, highlight: true },
      ],
    },
    {
      emoji: "🏠",
      title: { en: "The Property", es: "La Propiedad", fr: "Le Logement" }[lang],
      items: [
        { label: { en: "Floor / Unit", es: "Piso / Unidad", fr: "Étage / Unité" }[lang], value: hostData.floor_unit },
        { label: { en: "A/C", es: "Aire acondicionado", fr: "Climatisation" }[lang], value: hostData.ac_instructions },
        { label: { en: "Hot water", es: "Agua caliente", fr: "Eau chaude" }[lang], value: hostData.boiler_instructions },
        { label: { en: "Washer", es: "Lavadora", fr: "Machine à laver" }[lang], value: hostData.washer_instructions },
        { label: { en: "Trash", es: "Basura", fr: "Poubelle" }[lang], value: hostData.trash_info },
        { label: { en: "House rules", es: "Reglas", fr: "Règles" }[lang], value: hostData.house_rules },
      ],
    },
    {
      emoji: "🛒",
      title: { en: "Nearby services", es: "Servicios cercanos", fr: "Services proches" }[lang],
      items: [
        { label: { en: "Supermarket", es: "Supermercado", fr: "Supermarché" }[lang], value: hostData.nearest_supermarket },
        { label: { en: "Pharmacy", es: "Farmacia", fr: "Pharmacie" }[lang], value: hostData.nearest_pharmacy },
        { label: { en: "Hospital", es: "Hospital", fr: "Hôpital" }[lang], value: hostData.nearest_hospital },
        { label: { en: "ATM", es: "Cajero ATM", fr: "Distributeur" }[lang], value: hostData.nearest_atm },
        { label: { en: "Host's pick", es: "Restaurante recomendado", fr: "Resto du host" }[lang], value: hostData.recommended_restaurant },
      ],
    },
    {
      emoji: "🚕",
      title: { en: "Transport", es: "Transporte", fr: "Transport" }[lang],
      items: [
        { label: { en: "To the center", es: "Al centro", fr: "Au centre" }[lang], value: hostData.how_to_centro },
        { label: { en: "To the beach", es: "A la playa", fr: "À la plage" }[lang], value: hostData.how_to_beach },
        { label: { en: "Trusted taxi", es: "Taxi de confianza", fr: "Taxi fiable" }[lang], value: hostData.trusted_taxi },
      ],
    },
    {
      emoji: "⭐",
      title: { en: "Host's recommendations", es: "Recomendaciones del host", fr: "Recommandations du host" }[lang],
      items: [
        { label: { en: "Favorites", es: "Mis favoritos", fr: "Mes favoris" }[lang], value: hostData.host_recommendations },
        { label: { en: "Tours", es: "Tours recomendados", fr: "Tours recommandés" }[lang], value: hostData.tours_info },
        { label: { en: "Extra tips", es: "Otros datos", fr: "Autres infos" }[lang], value: hostData.extra_notes },
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

        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <div style={{ fontSize: 11, color: "#00ACC1", letterSpacing: 3, fontWeight: 700, marginBottom: 6 }}>
            🏠 MY STAY
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 900, color: "white", marginBottom: 4,
            lineHeight: 1.2,
          }}>
            {hostData.property_name || "Tu alojamiento"}
          </h1>
          {hostData.floor_unit && (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              {hostData.floor_unit}
            </div>
          )}
        </div>
      </div>

      {/* Emergency contact — always visible at top */}
      {hostData.emergency_contact && (
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
              {hostData.emergency_contact}
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
