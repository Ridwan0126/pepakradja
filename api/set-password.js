/**
 * API Proxy Handler untuk Set Password
 * Melewatkan request ke Bapenda API dengan API Key yang aman di backend
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Ambil API key dari environment variable
    const API_KEY = process.env.BAPENDA_API_KEY;
    const API_BASE_URL =
      process.env.BAPENDA_API_BASE_URL ||
      "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr";

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        error: "API_KEY tidak dikonfigurasi",
      });
    }

    // Build target URL dengan query parameters
    let targetUrl = `${API_BASE_URL}/set-password`;

    // Untuk GET request (token validation)
    if (req.method === "GET") {
      const { set_password_token } = req.query;
      if (set_password_token) {
        targetUrl += `?set_password_token=${encodeURIComponent(set_password_token)}`;
      }
    }

    // Header yang akan diteruskan ke Bapenda API
    // Token header: xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1
    const fetchHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

    // Konfigurasi fetch
    const fetchOptions = {
      method: req.method,
      headers: fetchHeaders,
    };

    // Jika ada body (untuk POST/PUT), tambahkan body
    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    console.log(`[API] ${req.method} ${targetUrl}`);

    // Call Bapenda API
    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get("content-type");

    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = {
        success: false,
        message: "Server mengembalikan format non-JSON",
        rawResponse: text,
      };
    }

    // Log response
    console.log(`[API] Status: ${response.status}`, responseData);

    // Return response dengan status code yang sama
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error("[API] Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Gagal berkomunikasi dengan server",
      details: error.message,
    });
  }
}
