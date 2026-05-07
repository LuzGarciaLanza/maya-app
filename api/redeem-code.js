module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  };

  try {
    // 1. Check if code exists
    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/deal_codes?code=eq.${encodeURIComponent(code)}&select=*`,
      { headers }
    );
    const rows = await checkRes.json();

    if (!rows.length) {
      return res.status(404).json({ error: 'not_found' });
    }

    const row = rows[0];

    // 2. Already redeemed?
    if (row.redeemed_at) {
      return res.status(409).json({
        error: 'already_redeemed',
        partner_name: row.partner_name,
        redeemed_at: row.redeemed_at
      });
    }

    // 3. Mark as redeemed
    await fetch(
      `${supabaseUrl}/rest/v1/deal_codes?code=eq.${encodeURIComponent(code)}`,
      {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
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
