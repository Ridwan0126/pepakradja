export default async function handler(req, res) {
  // 1. Set CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  // cara set nya
  try {
    // 2. Ambil API_KEY dari environment variable
    const API_KEY = process.env.BAPENDA_API_KEY;
    const API_BASE_URL = process.env.BAPENDA_API_BASE_URL;

    console.log("[API Proxy] Environment Check:", {
      API_KEY_EXISTS: !!API_KEY,
      API_BASE_URL_EXISTS: !!API_BASE_URL,
      METHOD: req.method,
      QUERY: req.query,
    });

    if (!API_KEY || !API_BASE_URL) {
      console.error("[Error] Missing environment variables:", {
        API_KEY: API_KEY ? "SET" : "MISSING",
        API_BASE_URL: API_BASE_URL ? "SET" : "MISSING",
      });
      return res.status(500).json({
        success: false,
        error: "Environment variables tidak dikonfigurasi",
        details: {
          API_KEY: API_KEY ? "SET" : "MISSING",
          API_BASE_URL: API_BASE_URL ? "SET" : "MISSING",
        },
      });
    }

    // 3. Bangun URL
    let targetUrl = `${API_BASE_URL}/set-password`;
    if (req.method === "GET" && req.query.set_password_token) {
      targetUrl += `?set_password_token=${encodeURIComponent(req.query.set_password_token)}`;
    }

    // 4. Lakukan Fetch
    console.log("[API Proxy] Requesting:", {
      URL: targetUrl,
      METHOD: req.method,
      HAS_API_KEY: !!API_KEY,
    });

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // 5. Tangani Response
    const data = await response.json().catch(() => ({}));

    console.log("[API Proxy] Response:", {
      STATUS: response.status,
      SUCCESS: response.ok,
      HAS_DATA: !!data,
    });

    if (!response.ok) {
      console.error("[API Proxy] Error Response:", {
        STATUS: response.status,
        DATA: data,
      });
    }

    // Kembalikan status dari API asli ke klien
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("[API Proxy] Exception:", error);
    return res.status(500).json({
      success: false,
      error: "Gagal memproses request ke server Bapenda",
    });
  }
}
