export default async function handler(req, res) {
  const targetUrl =
    req.method === "GET"
      ? `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password?${new URLSearchParams(req.query).toString()}`
      : `https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password`;
  try {
    // Ambil header dari request asal (dari browser user)
    const headersToForward = {};
    // Di dalam fetchOptions, tambahkan User-Agent
    const fetchOptions = {
      method: req.method,
      headers: {
        ...headersToForward, // Hati-hati: forward header asli kadang membawa referer/user-agent yang salah
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Host: "rpp.bapenda.jatengprov.go.id",
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
