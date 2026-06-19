const API_KEY = "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1";
const TARGET_API =
  "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

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

  if (req.method === "GET") {
    // Verifikasi token
    const { set_password_token } = req.query;

    console.log(
      "[v0] GET request with token:",
      set_password_token?.substring(0, 10) + "...",
    );

    if (!set_password_token) {
      return res.status(400).json({ error: "Token tidak ditemukan" });
    }

    try {
      const targetUrl = `${TARGET_API}?set_password_token=${encodeURIComponent(set_password_token)}`;

      console.log("[v0] Fetching from:", targetUrl);

      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          Accept: "application/json",
          "User-Agent": "Pepakraja-App/1.0",
        },
      });

      console.log("[v0] Response status:", response.status);

      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json();
        } catch {
          responseData = await response.text();
        }
      } else {
        responseData = await response.text();
      }

      console.log(
        "[v0] Response data:",
        typeof responseData === "string"
          ? responseData.substring(0, 100)
          : responseData,
      );

      res.status(response.status).json({
        status: response.status,
        success: response.status === 200,
        data: responseData,
      });
    } catch (error) {
      console.error("[v0] Error verifying token:", error.message);
      res
        .status(500)
        .json({ error: "Gagal verifikasi token", details: error.message });
    }
  } else if (req.method === "POST") {
    // Set password baru
    try {
      const { set_password_token, password, password_confirmation } = req.body;

      if (!set_password_token || !password || !password_confirmation) {
        return res.status(400).json({ error: "Data tidak lengkap" });
      }

      console.log(
        "[v0] POST request with token:",
        set_password_token?.substring(0, 10) + "...",
      );

      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": API_KEY,
          "User-Agent": "Pepakraja-App/1.0",
        },
        body: JSON.stringify({
          set_password_token,
          password,
          password_confirmation,
        }),
      };

      console.log("[v0] Sending POST to:", TARGET_API);

      const response = await fetch(TARGET_API, fetchOptions);

      console.log("[v0] Response status:", response.status);

      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json();
        } catch {
          responseData = await response.text();
        }
      } else {
        responseData = await response.text();
      }

      console.log(
        "[v0] Response:",
        typeof responseData === "string"
          ? responseData.substring(0, 100)
          : responseData,
      );

      res.status(response.status).json({
        status: response.status,
        success: response.status === 200 || response.status === 201,
        data: responseData,
      });
    } catch (error) {
      console.error("[v0] Error setting password:", error.message);
      res
        .status(500)
        .json({ error: "Gagal set password", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method tidak diizinkan" });
  }
}
