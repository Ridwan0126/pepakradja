export default async function handler(req, res) {
  const query = new URLSearchParams(req.query).toString();
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?${query}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        // Menyamarkan identitas agar dianggap berasal dari domain Bapenda
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal berkomunikasi dengan server Bapenda" });
  }
}
