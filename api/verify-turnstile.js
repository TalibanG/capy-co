export default async function handler(req, res) {
  const { token } = req.body;
  const secret = process.env.TURNSTILE_SECRET;

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token })
  });

  const data = await response.json();
  res.json({ success: data.success });
}
