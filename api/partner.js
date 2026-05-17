// api/partner.js — CRUD for partners table
// GET  ?active=1            → all active partners (public)
// GET  ?code=XXX            → one partner by code
// GET  ?code=XXX&edit=1     → for editing (service key)
// POST { ...fields }        → create new partner
// PATCH { partner_code, ...fields } → update

const SUPABASE_URL     = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY    = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_SECRET = process.env.PARTNER_ADMIN_SECRET || "MAYAADMIN2026";

function sbFetch(path, options = {}, useService = false) {
  const key = useService ? SUPABASE_SERVICE_KEY : SUPABASE_ANON_KEY;
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Prefer": "return=representation",
      ...(options.headers || {}),
    },
  });
}

function generatePartnerCode(businessName) {
  const slug = (businessName || "partner")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${slug}-${rand}`;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── GET ───────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { active, code, edit } = req.query;

    if (active) {
      // All active partners for the deals screen
      const r = await sbFetch(
        "partners?is_active=eq.true&order=is_featured.desc,created_at.asc&select=*"
      );
      const data = await r.json();
      return res.status(200).json(Array.isArray(data) ? data : []);
    }

    if (code) {
      const filter = edit
        ? `partners?partner_code=eq.${code}&select=*`
        : `partners?partner_code=eq.${code}&is_active=eq.true&select=*`;
      const r = await sbFetch(filter, {}, !!edit);
      const data = await r.json();
      if (!data || data.length === 0) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(data[0]);
    }

    return res.status(400).json({ error: "Missing query param" });
  }

  // ── POST — create ─────────────────────────────────────────────
  if (req.method === "POST") {
    const body = req.body;
    if (!body?.business_name) return res.status(400).json({ error: "Missing business_name" });

    const isAdmin = body._admin_secret === ADMIN_SECRET;
    const partner_code = generatePartnerCode(body.business_name);

    const { _admin_secret, ...rest } = body;
    const payload = {
      ...rest,
      partner_code,
      is_active: isAdmin ? true : false, // admin → live immediately
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const r = await sbFetch("partners", { method: "POST", body: JSON.stringify(payload) }, true);
    const data = await r.json();
    if (r.status >= 400) return res.status(r.status).json(data);
    const row = Array.isArray(data) ? data[0] : data;
    return res.status(201).json(row);
  }

  // ── PATCH — update ────────────────────────────────────────────
  if (req.method === "PATCH") {
    const body = req.body;
    if (!body?.partner_code) return res.status(400).json({ error: "Missing partner_code" });

    const { partner_code, _admin_secret, ...fields } = body;

    // Only admin can set is_active
    if (fields.is_active !== undefined && _admin_secret !== ADMIN_SECRET) {
      delete fields.is_active;
    }

    const payload = { ...fields, updated_at: new Date().toISOString() };
    const r = await sbFetch(
      `partners?partner_code=eq.${partner_code}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      true
    );
    const data = await r.json();
    if (r.status >= 400) return res.status(r.status).json(data);
    return res.status(200).json(Array.isArray(data) ? data[0] : { partner_code });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
