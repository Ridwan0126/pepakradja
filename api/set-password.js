export default async function handler(req, res) {
  // Pastikan tidak ada double slash
  const baseUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

  const targetUrl =
    req.method === "GET"
      ? `${baseUrl}?${new URLSearchParams(req.query)}`
      : baseUrl;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const responseText = await response.text();

    // Log untuk debugging di Vercel/Terminal
    console.log("Target:", targetUrl);
    console.log("Response Status:", response.status);

    // Validasi: Apakah respons benar-benar JSON?
    if (!responseText.trim().startsWith("{")) {
      return res.status(502).json({
        success: false,
        error:
          "Server Bapenda mengembalikan format yang salah (bukan JSON). Cek URL atau Firewall.",
      });
    }

    return res.status(response.status).json(JSON.parse(responseText));
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Proxy Error", details: error.message });
  }
}
