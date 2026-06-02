import { useState } from "react";
import { FileText, Download, Printer, Search, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Swal from "sweetalert2";

export default function SKRD() {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchForm, setSearchForm] = useState({
    id_obyek: "",
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1,
  });

  const [formData, setFormData] = useState({});

  // DATA SEMENTARA OBYEK
  const obyekList = [
    {
      id: "09.00.00.00.0.01464.02",
      nama: "Sewa Tanah dan Bangunan - Type 120",
      id_wr: 3314,
    },
    {
      id: "09.00.00.00.0.01465.02",
      nama: "Sewa Tanah dan Bangunan - Type 90",
      id_wr: 3314,
    },
    {
      id: "09.00.00.00.0.01466.02",
      nama: "Sewa Tanah dan Bangunan - Type 70",
      id_wr: 3314,
    },
  ];

  // SESSION LOGIN
  const session =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wr_session")) || {}
      : {};

  const loginUser = session?.user?.nama || "SUPERADMIN";

  // FORMAT CETAK
  const printDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

  // VALIDASI FORMAT
  // const validateIdObyek = (value) => {
  //   const regex = /^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d\.\d{5}\.\d{2}$/;
  //   return regex.test(value);
  // };

  // AUTO FORMAT
  // const autoFormat = (value) => {
  //   const clean = value.replace(/\D/g, "").slice(0, 18);

  //   const parts = [
  //     clean.slice(0, 2),
  //     clean.slice(2, 4),
  //     clean.slice(4, 6),
  //     clean.slice(6, 8),
  //     clean.slice(8, 9),
  //     clean.slice(9, 14),
  //     clean.slice(14, 16),
  //   ];

  //   return parts.filter(Boolean).join(".");
  // };

  // FORMAT TANGGAL
  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  // FORMAT RUPIAH
  const rupiah = (val) => Number(val || 0).toLocaleString("id-ID");

  // API
  const handleSearchAPI = async () => {
    const { id_obyek, tahun, bulan } = searchForm;

    if (!id_obyek) {
      Swal.fire(
        "Pilih Obyek",
        "Silakan pilih obyek retribusi terlebih dahulu",
        "warning",
      );
      return;
    }

    const selectedObyek = obyekList.find((item) => item.id === id_obyek);

    const id_wr = selectedObyek?.id_wr || 3314;

    setLoading(true);

    try {
      const res = await fetch(
        `/bapenda-api/pepakraja/skrd?id_wr=${id_wr}&id_obyek=${id_obyek}&tahun=${tahun}&bulan=${bulan}`,
        {
          method: "GET",
          headers: {
            token: "mQ8xL2vNpR7kHdYcTa4ZwEuBjF1sGn9",
            Accept: "application/json",
          },
        },
      );

      const result = await res.json();

      if (result.code !== "00" || !result.data || result.data.length === 0) {
        Swal.fire("Tidak ditemukan", "Data SKRD tidak ditemukan", "warning");
        return;
      }

      const d = result.data[0];

      const pejabat = d.json_pejabat ? JSON.parse(d.json_pejabat) : {};

      setFormData({
        nomor: d.no_penetapan || "-",
        nomorGrms: d.no_penetapan_grms || "-",
        tanggal: formatDate(d.tanggal),

        nama: d.wr?.nama || d.nama_wr || "-",
        alamat: d.wr?.alamat || d.alamat_wr || "-",
        nik: d.wr?.nik_npwp || "-",
        telepon: d.wr?.telepon || "-",
        npwrd: d.wr?.npwrd || "-",

        obyek: d.nama_obyek || d.obyek?.obyek_retribusi || "-",

        lokasi: d.alamat_obyek || d.obyek?.alamat || "-",

        satuan: d.obyek?.satuan?.deskripsi || d.obyek?.satuan?.satuan || "-",

        jenis: d.obyek?.tariftbl?.penerimaan || "Jasa",

        tarif: d.tarif || 0,

        masa: `${formatDate(d.masa_dari)} - ${formatDate(d.masa_sampai)}`,

        volume: d.volume || 0,

        volumeFull: `${d.volume || 0} ${d.obyek?.satuan?.deskripsi || ""}`,

        total: d.ketetapan || 0,

        jatuhTempo: formatDate(d.jatuh_tempo),

        kepala: pejabat.nama_kepala || "KEPALA UPPD",

        nip: pejabat.nip_kepala || "-",

        kota: pejabat.kota || "KUDUS",

        jabatan: pejabat.jabatan_kepala || "KEPALA UPPD",

        namaOpd: d.opd?.nama || "BADAN PENGELOLA PENDAPATAN DAERAH",

        namaUppd: d.uppd?.nama || "-",

        alamatUppd: d.uppd?.alamat || "-",

        qr: d.qrcode_link || `SKRD-${d.no_penetapan}`,
      });

      setShowPreviewModal(true);
    } catch (error) {
      console.error(error);

      Swal.fire("Error", "Gagal mengambil data SKRD", "error");
    } finally {
      setLoading(false);
    }
  };

  // PRINT
  // const handlePrint = () => {
  //   window.print();
  // };

  const handlePrint = () => {
    const printContent = document.getElementById("skrd-document").outerHTML;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>SPTRD</title>
        <style>
           html,
        body {
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
        .payment-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payment-table td:first-child {
          width: 25px;
          vertical-align: top;
        }

        .payment-table td {
          padding-bottom: 8px;
          text-align: justify;
        }
        .input-modern {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 12px 14px;
          border-radius: 12px;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .btn-action {
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        /* F4 PAPER */
        .skrd-paper {
          width: 100%;
          max-width: 210mm;
          min-height: 330mm;

          padding: 10mm 14mm 15mm 14mm;

          box-sizing: border-box;

          background: white;

          position: relative;

          color: #111827;

          box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);

          overflow: hidden;
        }

        /* HEADER */
        .header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .logo-side {
          width: 80px;
        }

        .logo-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .title-side {
          flex: 1;
          text-align: center;
        }

        .title-side h1,
        .title-side h2,
        .title-side h3 {
          margin: 0;
          line-height: 1.3;
        }

        .title-side h1 {
          font-size: 18px;
        }

        .title-side h2 {
          font-size: 17px;
        }

        .title-side h3 {
          font-size: 16px;
          margin-top: 4px;
        }

        .model-side {
          width: 90px;
          text-align: right;
          font-size: 12px;
          font-weight: bold;
        }

        .top-code {
          text-align: right;
          margin-top: 2px;
          font-size: 12px;
        }

        .line-top {
          border: none;
          border-top: 1.3px solid #111;
          margin-top: 4px;
        }

        /* TITLE */
        .doc-title {
          text-align: center;
          margin-top: 5px;
        }

        .doc-title h1 {
          font-size: 17px;
          margin: 0;
        }

        .doc-title p {
          margin: 3px 0;
          font-size: 14px;
        }

        /* SECTION */
        .section {
          display: flex;
          margin-top: 2px;
        }

        .section-title {
          width: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .section-content {
          flex: 1;
        }

        .section-content h2 {
          margin: 0 0 8px;
          font-size: 15px;
        }

        /* TABLE */
        .table-detail {
          width: 100%;
          border-collapse: collapse;
        }

        .table-detail td {
          padding: 3px 0;
          vertical-align: top;
          font-size: 14px;
          line-height: 1.5;
        }

        .table-detail td:nth-child(1) {
          width: 220px;
        }

        .table-detail td:nth-child(2) {
          width: 20px;
          text-align: center;
        }

        /* PAYMENT */
        .payment-list {
          margin: 0;
          padding-left: 22px;
          font-size: 14px;
        }

        .payment-list li {
          color: black;
          margin-bottom: 6px;
          line-height: 1.6;
          text-align: justify;
        }

        /* FOOTER */
        .footer-area {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        /* QR */
        .qr-side {
          width: 45%;
        }

        .qr-box {
          width: 100px;
          height: 100px;
          border: 1.5px solid #111;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: white;
          margin-top: 4px;
        }

        .copy-text {
          margin-top: 10px;
        }

        .copy-text p {
          margin: 2px 0;
          font-size: 11px;
        }

        /* TTD */
        .ttd-side {
          width: 40%;
          text-align: left;
          font-size: 14px;
        }

        .ttd-space {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 5px 0;
        }

        .ttd-image {
          width: 140px;
          object-fit: contain;
        }

        .ttd-name {
          font-weight: bold;
          text-decoration: underline;
        }

        /* BOTTOM */
        .bottom-print {
          position: absolute;
          bottom: 8mm;
          left: 14mm;
          font-size: 10px;
          font-style: italic;
        }

        /* PAGE F4 */
        @page {
          size: 210mm 330mm;
          margin: 0;
        }

        /* PRINT */
        @media print {
          html,
          body {
            width: 210mm;
            height: 330mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #skrd-document,
          #skrd-document * {
            visibility: visible;
          }

          #skrd-document {
            position: absolute;
            left: 0;
            top: 0;

            width: 210mm !important;
            min-height: 330mm !important;

            margin: 0 !important;

            box-shadow: none !important;

            overflow: hidden !important;

            page-break-after: avoid !important;
            break-after: avoid-page !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .footer-area,
          .section,
          .doc-title,
          .header-wrap {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: F4 portrait;
            margin: 0;
          }
        }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  // DOWNLOAD PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById("skrd-document");

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 0,

        filename: `SKRD-${formData.nomor}.pdf`,

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        },

        jsPDF: {
          unit: "mm",

          // F4
          format: [330, 210],

          orientation: "portrait",
        },

        pagebreak: {
          mode: ["avoid-all"],
        },
      })
      .from(element)
      .save();
  };

  const bulanList = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const tahunList = Array.from({ length: 5 }, (_, i) => 2023 + i);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* SEARCH */}
      <div className="pt-32 pb-16 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <FileText size={24} />
            Pencarian SKRD
          </h1>

          <div className="grid md:grid-cols-4 gap-4">
            <select
              className="input-modern"
              value={searchForm.id_obyek}
              onChange={(e) =>
                setSearchForm({
                  ...searchForm,
                  id_obyek: e.target.value,
                })
              }
            >
              <option value="">Pilih Obyek Retribusi</option>

              {obyekList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>

            <select
              className="input-modern"
              value={searchForm.tahun}
              onChange={(e) =>
                setSearchForm({
                  ...searchForm,
                  tahun: e.target.value,
                })
              }
            >
              {tahunList.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <select
              className="input-modern"
              value={searchForm.bulan}
              onChange={(e) =>
                setSearchForm({
                  ...searchForm,
                  bulan: e.target.value,
                })
              }
            >
              {bulanList.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearchAPI}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Search size={18} />
              {loading ? "Loading..." : "Cari"}
            </button>
          </div>
        </div>
        <Link to="/sptrd">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
            <h3 className="font-bold text-blue-700">Belum memiliki SKRD?</h3>

            <p className="text-sm text-gray-600 mt-2">
              Buat SPTRD terlebih dahulu dan pilih obyek retribusi yang akan
              diajukan ke OPD terkait.
            </p>
          </div>
        </Link>
      </div>

      {/* MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto">
          {/* ACTION */}
          <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-lg p-4 flex flex-wrap gap-3 justify-center print:hidden">
            <button
              onClick={handleDownloadPDF}
              className="btn-action bg-blue-700"
            >
              <Download size={18} />
              Download PDF
            </button>

            <button onClick={handlePrint} className="btn-action bg-gray-700">
              <Printer size={18} />
              Print
            </button>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="btn-action bg-red-600"
            >
              <X size={18} />
              Tutup
            </button>
          </div>

          {/* DOCUMENT */}
          <div className="flex justify-center py-12 print:p-0">
            <div id="skrd-document" className="skrd-paper">
              {/* HEADER */}
              <div className="header-wrap">
                <div className="logo-side">
                  <img
                    src="/images/logo-jateng-official.png"
                    alt="Logo"
                    className="logo-img"
                  />
                </div>

                <div className="title-side">
                  <h1>
                    <b>PEMERINTAH PROVINSI JAWA TENGAH</b>
                  </h1>

                  <h2>
                    <b>{formData.namaOpd}</b>
                  </h2>

                  <p className="text-sm">{formData.namaUppd}</p>
                </div>

                <div className="model-side">
                  <span>Model : RD 02</span>
                </div>
              </div>

              <div className="top-code">{formData.nik}</div>

              <hr className="line-top" />

              {/* TITLE */}
              <div className="doc-title">
                <h1>
                  <b>SURAT KETETAPAN RETRIBUSI DAERAH (SKRD)</b>
                </h1>

                <p>
                  <b>Nomor :</b> {formData.nomor}
                </p>

                <p>
                  <b>Tanggal :</b> {formData.tanggal}
                </p>
              </div>

              {/* I */}
              <div className="section">
                <div className="section-title">I.</div>

                <div className="section-content">
                  <h2>WAJIB RETRIBUSI</h2>

                  <table className="table-detail">
                    <tbody className="text-sm">
                      <tr>
                        <td>1. Nama</td>
                        <td>:</td>
                        <td>{formData.nama}</td>
                      </tr>

                      <tr>
                        <td>2. Alamat</td>
                        <td>:</td>
                        <td>{formData.alamat}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* II */}
              <div className="section">
                <div className="section-title">II.</div>

                <div className="section-content">
                  <h2>OBYEK RETRIBUSI</h2>

                  <table className="table-detail">
                    <tbody>
                      <tr>
                        <td>1. Obyek Retribusi</td>
                        <td>:</td>
                        <td>{formData.obyek}</td>
                      </tr>

                      <tr>
                        <td>2. Lokasi</td>
                        <td>:</td>
                        <td>{formData.lokasi}</td>
                      </tr>

                      <tr>
                        <td>3. Satuan</td>
                        <td>:</td>
                        <td>{formData.satuan}</td>
                      </tr>

                      <tr>
                        <td>4. Jenis Retribusi</td>
                        <td>:</td>
                        <td>{formData.jenis}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* III */}
              <div className="section">
                <div className="section-title">III.</div>

                <div className="section-content">
                  <h2>KETETAPAN RETRIBUSI</h2>

                  <table className="table-detail">
                    <tbody>
                      <tr>
                        <td>1. Masa Retribusi</td>
                        <td>:</td>
                        <td>{formData.masa}</td>
                      </tr>

                      <tr>
                        <td>2. Volume</td>
                        <td>:</td>
                        <td>{formData.volumeFull}</td>
                      </tr>

                      <tr>
                        <td>3. Retribusi terhutang</td>
                        <td>:</td>
                        <td>Rp {rupiah(formData.total)}</td>
                      </tr>

                      <tr>
                        <td>4. Jatuh Tempo Pembayaran</td>
                        <td>:</td>
                        <td>{formData.jatuhTempo}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* IV */}
              <div className="section">
                <div className="section-title">IV.</div>

                <div className="section-content">
                  <h2>PEMBAYARAN</h2>

                  <table className="payment-table">
                    <tbody className="text-sm">
                      <tr>
                        <td>1.</td>
                        <td>
                          Pembayaran dilakukan pada rekening Kas Umum Daerah
                          melalui Bendahara Penerimaan dan/atau Bendahara
                          Penerimaan Pembantu pada OPD yang melakukan pemungutan
                          Retribusi Daerah dan/atau UPPD/UPT/Balai di
                          masing-masing OPD.
                        </td>
                      </tr>

                      <tr>
                        <td>2.</td>
                        <td>
                          Jatuh tempo pembayaran adalah 15 (lima belas) hari /
                          {formData.jatuhTempo} terhitung mulai tanggal
                          SKRD/SKRD Jabatan/SKRDKBT diterbitkan.
                        </td>
                      </tr>

                      <tr>
                        <td>3.</td>
                        <td>
                          Keterlambatan pembayaran dapat dikenakan sanksi
                          administratif berupa bunga sebesarnya 1% perbulan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FOOTER */}
              <div className="footer-area">
                {/* QR */}
                <div className="qr-side">
                  <p className="text-sm">( Link Pembayaran )</p>

                  <div className="qr-box">
                    <QRCodeSVG value={formData.qr} size={90} includeMargin />
                  </div>

                  <div className="copy-text">
                    <p>Lembar 1 : Wajib Retribusi</p>
                    <p>Lembar 2 : Seksi/Petugas yang menangani Retribusi</p>
                    <p>Lembar 3 : Arsip Unit Kerja.</p>
                    <p>Informasi : 08123123123</p>
                  </div>
                </div>

                {/* TTD */}
                <div className="ttd-side">
                  <p>
                    {formData.kota}, {formData.tanggal}
                  </p>

                  <p>{formData.jabatan}</p>

                  <div className="ttd-space">
                    {/* <img src="/ttd.png" alt="TTD" className="ttd-image" /> */}
                  </div>

                  <p className="ttd-name">{formData.kepala}</p>

                  <p>NIP. {formData.nip}</p>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="bottom-print">
                dicetak oleh : {loginUser} pada : {printDate}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
        .payment-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payment-table td:first-child {
          width: 25px;
          vertical-align: top;
        }

        .payment-table td {
          padding-bottom: 8px;
          text-align: justify;
        }
        .input-modern {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 12px 14px;
          border-radius: 12px;
          outline: none;
          font-size: 14px;
          background: white;
        }

        .btn-action {
          color: white;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        /* F4 PAPER */
        .skrd-paper {
          width: 100%;
          max-width: 210mm;
          min-height: 330mm;

          padding: 10mm 14mm 15mm 14mm;

          box-sizing: border-box;

          background: white;

          position: relative;

          color: #111827;

          box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);

          overflow: hidden;
        }

        /* HEADER */
        .header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .logo-side {
          width: 80px;
        }

        .logo-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }

        .title-side {
          flex: 1;
          text-align: center;
        }

        .title-side h1,
        .title-side h2,
        .title-side h3 {
          margin: 0;
          line-height: 1.3;
        }

        .title-side h1 {
          font-size: 18px;
        }

        .title-side h2 {
          font-size: 17px;
        }

        .title-side h3 {
          font-size: 16px;
          margin-top: 4px;
        }

        .model-side {
          width: 90px;
          text-align: right;
          font-size: 12px;
          font-weight: bold;
        }

        .top-code {
          text-align: right;
          margin-top: 2px;
          font-size: 12px;
        }

        .line-top {
          border: none;
          border-top: 1.3px solid #111;
          margin-top: 4px;
        }

        /* TITLE */
        .doc-title {
          text-align: center;
          margin-top: 5px;
        }

        .doc-title h1 {
          font-size: 17px;
          margin: 0;
        }

        .doc-title p {
          margin: 3px 0;
          font-size: 14px;
        }

        /* SECTION */
        .section {
          display: flex;
          margin-top: 2px;
        }

        .section-title {
          width: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .section-content {
          flex: 1;
        }

        .section-content h2 {
          margin: 0 0 8px;
          font-size: 15px;
        }

        /* TABLE */
        .table-detail {
          width: 100%;
          border-collapse: collapse;
        }

        .table-detail td {
          padding: 3px 0;
          vertical-align: top;
          font-size: 14px;
          line-height: 1.5;
        }

        .table-detail td:nth-child(1) {
          width: 220px;
        }

        .table-detail td:nth-child(2) {
          width: 20px;
          text-align: center;
        }

        /* PAYMENT */
        .payment-list {
          margin: 0;
          padding-left: 22px;
          font-size: 14px;
        }

        .payment-list li {
          color: black;
          margin-bottom: 6px;
          line-height: 1.6;
          text-align: justify;
        }

        /* FOOTER */
        .footer-area {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        /* QR */
        .qr-side {
          width: 45%;
        }

        .qr-box {
          width: 100px;
          height: 100px;
          border: 1.5px solid #111;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: white;
          margin-top: 4px;
        }

        .copy-text {
          margin-top: 10px;
        }

        .copy-text p {
          margin: 2px 0;
          font-size: 11px;
        }

        /* TTD */
        .ttd-side {
          width: 40%;
          text-align: left;
          font-size: 14px;
        }

        .ttd-space {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 5px 0;
        }

        .ttd-image {
          width: 140px;
          object-fit: contain;
        }

        .ttd-name {
          font-weight: bold;
          text-decoration: underline;
        }

        /* BOTTOM */
        .bottom-print {
          position: absolute;
          bottom: 8mm;
          left: 14mm;
          font-size: 10px;
          font-style: italic;
        }

        /* PAGE F4 */
        @page {
          size: 210mm 330mm;
          margin: 0;
        }

        /* PRINT */
        @media print {
          html,
          body {
            width: 210mm;
            height: 330mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;

            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #skrd-document,
          #skrd-document * {
            visibility: visible;
          }

          #skrd-document {
            position: absolute;
            left: 0;
            top: 0;

            width: 210mm !important;
            min-height: 330mm !important;

            margin: 0 !important;

            box-shadow: none !important;

            overflow: hidden !important;

            page-break-after: avoid !important;
            break-after: avoid-page !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .footer-area,
          .section,
          .doc-title,
          .header-wrap {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: F4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
