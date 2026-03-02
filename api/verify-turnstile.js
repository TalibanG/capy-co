export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Parse body — Vercel auto-parses JSON when Content-Type is application/json
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const token = body && body.token;

    if (!token) {
      console.error('[Turnstile] No token in request body:', body);
      return res.status(400).json({ success: false, error: 'Missing token' });
    }

    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) {
      console.error('[Turnstile] TURNSTILE_SECRET env var is not set');
      // Fail open so orders aren't blocked by misconfiguration
      return res.json({ success: true, warning: 'secret_missing' });
    }

    console.log('[Turnstile] verifying token (length:', token.length, ')');

    // Cloudflare recommends application/x-www-form-urlencoded
    const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString()
    });

    const data = await cfRes.json();
    console.log('[Turnstile] Cloudflare response:', JSON.stringify(data));

    return res.json({ success: data.success, errorCodes: data['error-codes'] || [] });

  } catch (err) {
    console.error('[Turnstile] handler error:', err.message);
    // Fail open on unexpected errors — log but don't block the order
    return res.status(200).json({ success: true, warning: 'verification_error', error: err.message });
  }
}
