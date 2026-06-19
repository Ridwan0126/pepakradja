export default async function handler(req, res) {
  if (req.method === "GET") {
    // Verifikasi token
    const { set_password_token } = req.query;

    if (!set_password_token) {
      return res.status(400).json({ error: "Token tidak ditemukan" });
    }

    try {
      const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?set_password_token=${encodeURIComponent(set_password_token)}`;

      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
          Accept: "application/json",
        },
      });

      const responseText = await response.text();

      res.status(response.status).json({
        status: response.status,
        body: responseText,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Gagal verifikasi token", details: error.message });
    }
  } else if (req.method === "POST") {
    // Set password baru
    try {
      const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password`;

      // Hanya kirim headers yang essential - hindari forwarding semua headers
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        },
        body: JSON.stringify(req.body),
      };

      console.log("[v0] Sending request to:", targetUrl);
      console.log("[v0] Payload:", JSON.stringify(req.body));

      const response = await fetch(targetUrl, fetchOptions);

      // Coba parse JSON, jika gagal ambil text
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

      console.log("[v0] Response status:", response.status);
      console.log("[v0] Response data:", responseData);

      res.status(response.status).json({
        status: response.status,
        success: response.status === 200 || response.status === 201,
        data: responseData,
      });
    } catch (error) {
      console.error("[v0] Error:", error.message);
      res
        .status(500)
        .json({ error: "Gagal set password", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method tidak diizinkan" });
  }
}
