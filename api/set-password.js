export default async function handler(req, res) {
  const query = new URLSearchParams(req.query).toString();
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?${query}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        "X-Requested-With": "XMLHttpRequest", // Tambahkan ini
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Cek status secara eksplisit
    const status = response.status;
    const responseText = await response.text();

    console.log("Status dari Bapenda:", status);
    console.log("Isi respons mentah:", responseText); // Lihat di log Vercel!

    res.status(status).json({ status, body: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
