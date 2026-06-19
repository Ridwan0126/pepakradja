export default async function handler(req, res) {
  const baseUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

  const targetUrl =
    req.method === "GET"
      ? `${baseUrl}?${new URLSearchParams(req.query)}`
      : baseUrl;
  try {
    // Ambil header dari request asal (dari browser user)
    const { "x-api-key": apiKey, ...headersToForward } = req.headers;

    // const fetchOptions = {
    //   method: req.method,
    //   headers: {
    //     ...headersToForward,
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //     "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
    //     Referer: "https://rpp.bapenda.jatengprov.go.id/",
    //     Origin: "https://rpp.bapenda.jatengprov.go.id/",
    //     "User-Agent":
    //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", // ← TAMBAH INI
    //   },
    // };

    const fetchOptions = {
      method: req.method,
      headers: {
        // Jangan forward headersToForward jika tidak perlu
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
        // Hapus header Referer dan Origin jika tidak wajib,
        // atau gunakan URL yang benar-benar sesuai dengan environment Anda.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };

    if (req.method !== "GET" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // const response = await fetch(targetUrl, fetchOptions);

    // const responseText = await response.text();

    // console.log("Status dari Bapenda:", response.status);
    // console.log("Isi respons mentah:", responseText);

    // return res.status(response.status).json({
    //   success: response.ok,
    //   body: responseText,
    // });
    const response = await fetch(targetUrl, fetchOptions);
    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // Jika gagal di-parse, berarti itu HTML error dari WAF
      return res.status(502).json({
        success: false,
        error: "Server tujuan menolak permintaan (WAF Blocked)",
      });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal berkomunikasi", details: error.message });
  }
}
