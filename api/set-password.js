export default async function handler(req, res) {
  // 1. Perbaiki struktur URL (hapus / sebelum ?)
  const baseUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";
  const query = new URLSearchParams(req.query).toString();
  const targetUrl = req.method === "GET" ? `${baseUrl}?${query}` : baseUrl;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        "Content-Type": "application/json",
        // Gunakan User-Agent yang paling umum
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        // Tambahkan header Referer yang mengarah ke domain mereka
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Debugging: Log header respons untuk melihat pesan keamanan
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries()),
    );

    const data = await response
      .json()
      .catch(() => ({ error: "Format respons tidak valid" }));
    return res.status(response.status).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Proxy gagal", details: error.message });
  }
}
