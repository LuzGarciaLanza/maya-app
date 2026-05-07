module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, partner_name, business_type, deal_id, lang } = req.body;
  if (!code || !partner_name || !business_type || !deal_id) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/deal_codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Prefer': 'resolution=ignore-duplicates,return=minimal'
      },
      body: JSON.stringify({ code, partner_name, business_type, deal_id, lang })
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
