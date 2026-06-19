export default async function handler(req, res) {
  // 1. Set CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 2. Ambil API_KEY dari environment variable
    const API_KEY =
      process.env.BAPENDA_API_KEY || "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";
    const API_BASE_URL =
      process.env.BAPENDA_API_BASE_URL ||
      "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr";

    if (!API_KEY) {
      console.error("[Error] API_KEY tidak ditemukan di environment variables");
      return res
        .status(500)
        .json({ success: false, error: "Konfigurasi server salah" });
    }

    // 3. Bangun URL
    let targetUrl = `${API_BASE_URL}/set-password`;
    if (req.method === "GET" && req.query.set_password_token) {
      targetUrl += `?set_password_token=${encodeURIComponent(req.query.set_password_token)}`;
    }

    // 4. Lakukan Fetch
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // 5. Tangani Response
    const data = await response.json().catch(() => ({})); // Menangani jika response bukan JSON

    console.log(`[API Proxy] Status Target: ${response.status}`);

    // Kembalikan status dari API asli ke klien
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[API Proxy] Exception:", error);
    return res
      .status(500)
      .json({
        success: false,
        error: "Gagal memproses request ke server Bapenda",
      });
  }
}
