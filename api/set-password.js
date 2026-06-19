export default async function handler(req, res) {
  // const query = new URLSearchParams(req.query).toString();
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
        ...headersToForward, // Meneruskan header asli user
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1", // Tetap kirim API Key Anda
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const status = response.status;

    console.log("Status dari Bapenda:", status);

    // Jika response bukan JSON (misal HTML halaman error), tangani agar tidak crash
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = {
        raw: await response.text(),
      };
    }
    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal berkomunikasi", details: error.message });
  }
}
