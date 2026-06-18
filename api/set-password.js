// api/set-password.js
export default async function handler(req, res) {
  const targetUrl =
    "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/pepakraja/wr/set-password";

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
