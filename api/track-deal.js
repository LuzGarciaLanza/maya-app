module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") return res.status(405).end();

  const { partner_name, business_type, action, lang } = req.body || {};
  if (!partner_name || !business_type) return res.status(400).end();

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/deal_clicks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ partner_name, business_type, action, lang }),
      }
    );
    return res.status(response.ok ? 200 : 500).end();
  } catch {
    return res.status(500).end();
  }
};
