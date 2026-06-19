export default async function handler(req, res) {
  // Gunakan URL langsung dari target untuk menghindari manipulasi query yang salah
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password`;

  try {
    // 1. Bersihkan headers, hapus yang bisa menyebabkan konflik
    const {
      host,
      connection,
      "content-length": cl,
      ...headersToForward
    } = req.headers;

    const fetchOptions = {
      method: req.method,
      headers: {
        ...headersToForward,
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    // 2. Pastikan body dikirim hanya jika ada
    if (req.method === "POST" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    // 3. Ambil data dengan benar
    const responseText = await response.text();

    // Kirim balik ke frontend
    res.status(response.status).json({
      status: response.status,
      body: responseText,
    });
  } catch (error) {
    res.status(500).json({ error: "Gagal", details: error.message });
  }
}
