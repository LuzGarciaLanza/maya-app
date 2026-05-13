// api/host-property.js
// CRUD for host_properties table in Supabase
// GET  ?code=XXXXX          → fetch one property (public, published only)
// GET  ?code=XXXXX&edit=1   → fetch for editing (service key)
// POST { ...fields }        → create new property
// PATCH { host_code, ...fields } → update existing property

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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

function generateHostCode(propertyName) {
  const slug = (propertyName || "maya")
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

  // ── GET — fetch property by host_code ──────────────────────────
  if (req.method === "GET") {
    const { code, edit } = req.query;
    if (!code) return res.status(400).json({ error: "Missing code" });

    // edit mode: return even unpublished (host editing their own)
    const filter = edit
      ? `host_code=eq.${code}`
      : `host_code=eq.${code}&is_published=eq.true&is_active=eq.true`;

    const r = await sbFetch(
      `host_properties?${filter}&select=*`,
      {},
      !!edit // use service key for edit mode
    );
    const data = await r.json();
    if (!data || data.length === 0) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(data[0]);
  }

  // ── POST — create new property ─────────────────────────────────
  if (req.method === "POST") {
    const body = req.body;
    if (!body) return res.status(400).json({ error: "Missing body" });

    const host_code = generateHostCode(body.property_name);
    const payload = {
      ...body,
      host_code,
      is_published: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const r = await sbFetch(
      "host_properties",
      { method: "POST", body: JSON.stringify(payload) },
      true
    );
    const data = await r.json();
    if (r.status >= 400) return res.status(r.status).json(data);
    const row = Array.isArray(data) ? data[0] : data;
    return res.status(201).json(row);
  }

  // ── PATCH — update existing property ──────────────────────────
  if (req.method === "PATCH") {
    const body = req.body;
    if (!body?.host_code) return res.status(400).json({ error: "Missing host_code" });

    const { host_code, ...fields } = body;
    const payload = { ...fields, updated_at: new Date().toISOString() };

    const r = await sbFetch(
      `host_properties?host_code=eq.${host_code}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      true
    );
    const data = await r.json();
    if (r.status >= 400) return res.status(r.status).json(data);
    const row = Array.isArray(data) ? data[0] : data;
    return res.status(200).json(row || { host_code });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
