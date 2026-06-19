export default async function handler(req, res) {
  const baseUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

  try {
    let targetUrl = baseUrl;
    const fetchOptions = {
      method: req.method, // 'GET' atau 'POST' diteruskan dari client
      headers: {
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
        Host: "rpp.bapenda.jatengprov.go.id",
      },
    };

    // LOGIKA PERBEDAAN METHOD
    if (req.method === "GET") {
      // Untuk GET: tambahkan query parameter ke URL
      const query = new URLSearchParams(req.query).toString();
      targetUrl = `${baseUrl}?${query}`;
    } else if (req.method === "POST") {
      // Untuk POST: kirimkan body JSON
      fetchOptions.body = JSON.stringify(req.body);
    } else {
      return res.status(405).json({ error: "Method tidak diizinkan" });
    }

    // Eksekusi request ke Bapenda
    const response = await fetch(targetUrl, fetchOptions);

    // Parsing response
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { raw_response: responseText };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Proxy gagal", details: error.message });
  }
}
