export default async function handler(req, res) {
  const query = new URLSearchParams(req.query).toString();
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?${query}`;

  try {
    // 1. Persiapkan header (hindari meneruskan semua header dari browser
    // karena bisa menyebabkan masalah dengan Host/Connection)
    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // 2. Lakukan request ke server Bapenda
    const response = await fetch(targetUrl, fetchOptions);
    const status = response.status;
    const responseText = await response.text();

    console.log("Status dari Bapenda:", status);
    console.log("Isi respons mentah:", responseText);

    // 3. Coba deteksi apakah JSON atau bukan
    let finalData;
    try {
      finalData = JSON.parse(responseText);
    } catch (e) {
      // Jika bukan JSON, bungkus pesan errornya
      finalData = {
        message: "Server Bapenda tidak memberikan JSON",
        raw: responseText.substring(0, 500),
      };
    }

    // 4. Kirim satu kali saja
    return res.status(status).json(finalData);
  } catch (error) {
    console.error("Error pada Proxy:", error);
    return res
      .status(500)
      .json({ error: "Gagal berkomunikasi", details: error.message });
  }
}
