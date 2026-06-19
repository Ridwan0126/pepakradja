export default async function handler(req, res) {
  const baseUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

  const targetUrl =
    req.method === "GET"
      ? `${baseUrl}?${new URLSearchParams(req.query)}`
      : baseUrl;
  try {
    // Ambil header dari request asal (dari browser user)
    const { "x-api-key": apiKey, ...headersToForward } = req.headers;

    const fetchOptions = {
      method: req.method,
      headers: {
        ...headersToForward,
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", // ← TAMBAH INI
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    const responseText = await response.text();

    console.log("Status dari Bapenda:", response.status);
    console.log("Isi respons mentah:", responseText);

    return res.status(response.status).json({
      success: response.ok,
      body: responseText,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal berkomunikasi", details: error.message });
  }
}
