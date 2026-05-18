// GET  ?code=XXX  → check status without redeeming
// POST { code }   → mark as redeemed

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const code = req.method === "GET" ? req.query.code : req.body?.code;
  if (!code) return res.status(400).json({ error: 'Code required' });

  try {
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/deal_codes?code=eq.${encodeURIComponent(code)}&select=*`,
      { headers }
    );
    const rows = await checkRes.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'not_found' });
    }

    const row = rows[0];

    // GET → just check status
    if (req.method === "GET") {
      return res.status(200).json({
        valid: !row.redeemed_at,
        already_redeemed: !!row.redeemed_at,
        partner_name: row.partner_name,
        business_type: row.business_type,
        deal_description: row.deal_description || null,
        generated_at: row.generated_at,
        redeemed_at: row.redeemed_at || null,
        code: row.code,
      });
    }

    // POST → redeem
    if (row.redeemed_at) {
      return res.status(409).json({
        error: 'already_redeemed',
        partner_name: row.partner_name,
        redeemed_at: row.redeemed_at
      });
    }

    await fetch(
      `${SUPABASE_URL}/rest/v1/deal_codes?id=eq.${row.id}`,
      {
        method: 'PATCH',
        headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify({ redeemed_at: new Date().toISOString() })
      }
    );

    return res.status(200).json({
      success: true,
      partner_name: row.partner_name,
      business_type: row.business_type,
      generated_at: row.generated_at
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
