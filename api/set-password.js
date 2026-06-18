export default async function handler(req, res) {
  // 1. Ambil query string dari request masuk agar token tidak hilang
  const query = new URLSearchParams(req.query).toString();

  // 2. Pastikan URL target akurat (tidak ada double slash)
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?${query}`;

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        // Penting: Tambahkan host agar server tujuan mengenali asalnya
        Host: "rpp.bapenda.jatengprov.go.id",
      },
    };

    // Tambahkan body hanya jika ada data (POST/PUT)
    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

    // Ambil data dari response
    const data = await response.json();

    // Teruskan status dan data dari Bapenda ke Frontend
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res
      .status(500)
      .json({
        error: "Gagal berkomunikasi dengan server Bapenda",
        details: error.message,
      });
  }
}
