export default async function handler(req, res) {
  const baseUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

  // Jika GET, tambahkan query string. Jika POST, biarkan URL dasar.
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
        // Wajib dikembalikan karena server tujuan memvalidasi asal request
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };

    // Sertakan body hanya jika POST/PUT
    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Ambil respons dalam bentuk teks dulu agar aman
    const responseText = await response.text();

    // Coba parse ke JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // Jika gagal parse, berarti ini halaman HTML dari WAF/Server
      return res
        .status(502)
        .json({
          success: false,
          error: "Ditolak oleh Server (WAF)",
          details: responseText,
        });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Proxy Error", details: error.message });
  }
}
