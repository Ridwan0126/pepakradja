export default async function handler(req, res) {
  const query = new URLSearchParams(req.query).toString();
  const targetUrl = `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?${query}`;

  try {
    // Ambil header dari request asal (dari browser user)
    const { "x-api-key": apiKey, ...headersToForward } = req.headers;

    const fetchOptions = {
      method: req.method,
      headers: {
        ...headersToForward, // Meneruskan header asli user
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1", // Tetap kirim API Key Anda
        Referer: "https://rpp.bapenda.jatengprov.go.id/",
        Origin: "https://rpp.bapenda.jatengprov.go.id/",
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const status = response.status;
    const responseText = await response.text();

    console.log("Status dari Bapenda:", status);
    console.log("Isi respons mentah:", responseText); // Lihat di log Vercel!

    res.status(status).json({ status, body: responseText });

    // Jika response bukan JSON (misal HTML halaman error), tangani agar tidak crash
    const contentType = response.headers.get("content-type");
    const data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : { message: "Server Bapenda mengembalikan error non-JSON" };

    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal berkomunikasi", details: error.message });
  }
}
