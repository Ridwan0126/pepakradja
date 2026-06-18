export default async function handler(req, res) {
  // Ambil query string dari request (misal: ?set_password_token=...)
  const query = new URLSearchParams(req.query).toString();
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?${query}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        Accept: "application/json",
      },
      // Hanya kirim body jika method-nya POST/PUT
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal berkomunikasi dengan server Bapenda" });
  }
}
