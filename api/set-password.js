const API_KEY = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";
const TARGET_API =
  "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

// Helper function untuk detect if response is the specific error HTML page from WAF
function isErrorHtmlResponse(text) {
  return (
    text.includes("Request Rejected") && text.includes("Your support ID is:")
  );
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key, Accept",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // Verify token
      const { set_password_token } = req.query;

      if (!set_password_token) {
        return res
          .status(400)
          .json({ success: false, error: "Token tidak ditemukan" });
      }

      console.log("[v0] GET: Verifying token");

      const verifyUrl = `${TARGET_API}?set_password_token=${encodeURIComponent(set_password_token)}`;

      const response = await fetch(verifyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": API_KEY,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Host: "rpp.bapenda.jatengprov.go.id",
          Referer: "https://rpp.bapenda.jatengprov.go.id/",
          Origin: "https://rpp.bapenda.jatengprov.go.id/",
        },
      });

      const responseText = await response.text();

      console.log("[v0] GET Response status:", response.status);
      console.log(
        "[v0] GET Response (first 200 chars):",
        responseText.substring(0, 200),
      );

      // Check if response is error HTML
      if (isErrorHtmlResponse(responseText)) {
        return res.status(403).json({
          success: false,
          error: "API menolak request - periksa API key atau token",
          details: responseText.substring(0, 100),
        });
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      return res.status(response.status).json({
        success: response.status === 200,
        status: response.status,
        data: data,
      });
    } else if (req.method === "POST") {
      // Set password
      const { set_password_token, password, password_confirmation } = req.body;

      if (!set_password_token || !password || !password_confirmation) {
        return res
          .status(400)
          .json({ success: false, error: "Data tidak lengkap" });
      }

      console.log("[v0] POST: Setting password for token");

      const response = await fetch(TARGET_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": API_KEY,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Host: "rpp.bapenda.jatengprov.go.id",
          Referer: "https://rpp.bapenda.jatengprov.go.id/",
          Origin: "https://rpp.bapenda.jatengprov.go.id/",
        },
        body: JSON.stringify({
          set_password_token,
          password,
          password_confirmation,
        }),
      });

      const responseText = await response.text();

      console.log("[v0] POST Response status:", response.status);
      console.log(
        "[v0] POST Response (first 300 chars):",
        responseText.substring(0, 300),
      );

      // Check if response is error HTML (even if status is 200)
      if (isErrorHtmlResponse(responseText)) {
        console.log(
          "[v0] ERROR: API returned HTML error page despite 200 status",
        );
        return res.status(403).json({
          success: false,
          error:
            "API menolak request - kemungkinan masalah WAF atau format request",
          debugInfo: {
            statusFromAPI: response.status,
            responsePreview: responseText.substring(0, 150),
          },
        });
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      const isSuccess = response.status === 200 || response.status === 201;

      return res.status(response.status).json({
        success: isSuccess,
        status: response.status,
        data: data,
      });
    } else {
      return res
        .status(405)
        .json({ success: false, error: "Method tidak diizinkan" });
    }
  } catch (error) {
    console.error("[v0] Backend error:", error.message);
    res.status(500).json({
      success: false,
      error: "Error di backend",
      details: error.message,
    });
  }
}
