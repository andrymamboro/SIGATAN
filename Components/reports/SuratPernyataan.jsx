import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

export default function SuratPernyataan({ tanah, pejabat, printRef }) {
  // const today = format(new Date(), 'dd MMMM yyyy', { locale: id });

  return (
    <div 
      ref={printRef}
      className="print-container"
      style={{
        fontFamily: 'Times New Roman, serif',
        fontSize: '10pt',
        padding: '30pt 30pt 30pt 30pt',
        maxWidth: '21cm',
        margin: '0 auto',
        backgroundColor: 'white',
        border: '0px solid #ccc',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
            <QRCodeSVG
              value={`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`}
              size={90}
              style={{ border: '1px solid #000', display: 'block', margin: '0 auto', background: '#fff' }}
              includeMargin={false}
            />
              size: A4;
            }
            body * {
              visibility: hidden !important;
            }
            body { 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-family: 'Times New Roman', serif;
              margin: 0;
              padding: 0;
            }
            .print-container,
            .print-container * {
              visibility: visible !important;
            }
            .no-print,
            .no-print * { 
              display: none !important;
              visibility: hidden !important;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              border: none !important;
              box-shadow: none !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
          }
        `}
      </style>
      
      {/* Print Date */}
      <div className="print-only" style={{
        position: 'fixed',
        bottom: '10pt',
        left: '10pt',
        fontSize: '8pt',
        color: '#666',
        zIndex: 1
      }}>
        {format(new Date(), 'dd/MM/yyyy')}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '12pt', marginTop: '-12pt' }}>
        <span style={{ fontFamily: 'Arial, sans-serif', textDecoration: 'underline', fontSize: '12pt' }}>
          SURAT PERNYATAAN
        </span>
      </div>

      {/* Content */}
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', marginBottom: '5pt' }}>
        Yang bertanda tangan di bawah ini :
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '5.4pt', marginBottom: '5pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '115.8pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.65pt', margin: 0 }}>N a m a</p>
            </td>
            <td style={{ width: '11.8pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>:</p>
            </td>
            <td style={{ width: '404pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>{tanah?.nama_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.65pt', margin: 0 }}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? 'U m u r'
                  : 'Tempat Tanggal Lahir'}
              </p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? `${tanah.tempat_tgl_lahir_pemilik} Tahun`
                  : tanah?.tempat_tgl_lahir_pemilik}
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.65pt', margin: 0 }}>Nik</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>{tanah?.nik_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.65pt', margin: 0 }}>Warga Negara</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>Indonesia</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.65pt', margin: 0 }}>Pekerjaan</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>{tanah?.pekerjaan_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.65pt', margin: 0 }}>Tempat Tinggal</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>{tanah?.alamat_pemilik}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', marginBottom: '0pt' }}>
        Dengan ini menyatakan dengan benar dan sanggup diangkat sumpah bahwa tanah yang terletak di Kelurahan {tanah?.kelurahan} Kecamatan {tanah?.kecamatan} Kota Palu, 
        Seluas <b><u>+</u> {(tanah?.luas_meter || 0) % 1 === 0 ? Math.floor(tanah?.luas_meter || 0) : (tanah?.luas_meter || 0).toString().replace('.', ',')} M<sup>2</sup></b> <b>({tanah?.luas_terbilang} Meter Persegi)</b> dan batas-batas sebagai berikut :
      </p>

      <div style={{ position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '5.4pt', marginBottom: '5pt' }}>
          <tbody>
            <tr>
              <td style={{ width: '127.6pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.7pt', marginTop: '5pt' }}>Sebelah Utara dengan</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textAlign: 'justify', marginTop: '5pt' }}>: {tanah?.batas_utara}</p>
              </td>
            </tr> <tr>
              <td style={{ width: '127.6pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.7pt', marginTop: '5pt' }}>Sebelah Timur dengan</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textAlign: 'justify', marginTop: '5pt' }}>: {tanah?.batas_timur}</p>
              </td>
            </tr>

            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.7pt', marginTop: '5pt' }}>Sebelah Selatan dengan</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textAlign: 'justify', marginTop: '5pt' }}>: {tanah?.batas_selatan}</p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textIndent: '1.7pt', marginTop: '5pt' }}>Sebelah Barat dengan</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', textAlign: 'justify', marginTop: '5pt' }}>: {tanah?.batas_barat}</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* QR Code */}
        {tanah?.latitude && tanah?.longitude && (
          <div style={{ position: 'absolute', right: '0', top: '-15pt', textAlign: 'center', width: '90px' }}>
            <p style={{ margin: '0 0 2px 0', fontSize: '7pt', fontWeight: 'bold' }}>QR Code Maps</p>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
              alt="QR Code Koordinat"
              style={{ width: '90px', height: '90px', border: '1px solid #000', display: 'block', margin: '0 auto' }}
            />
            <p style={{ margin: '4px 0 0 0', fontSize: '6pt', lineHeight: '1.2' }}>
              Lat: {tanah.latitude}<br/>
              Long: {tanah.longitude}
            </p>
          </div>
        )}
      </div>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', marginBottom: '5pt' }}>
        Benar adalah milik yang bertanda tangan / cap ibu jari kiri dibawah ini yang saya peroleh secara {tanah?.asal_usul || '................'}
      </p>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', marginBottom: '5pt' }}>
        Dengan penjelasan dan ketentuan sebagai berikut :
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '5pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '12.5pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: 0 }}>1.</p>
            </td>
            <td style={{ width: '521.65pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', margin: 0 }}>
                Bahwa atas tanah tersebut sesuai dengan tanggal pernyataan ini tidak dikenakan sitaan dan Tidak tersangkut sebagai tanggungan sesuai piutang atau tidak ada beban beban lainnya
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: 0 }}>2.</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', margin: 0 }}>
                Bahwa tanah tersebut tidak dalam sengketa dengan pihak lain, baik sengketa terhadap Subyek Pemengang Hak maupun Obyek Hak, tanda tanda batas ataupun tanaman / bangunan yang Ada diatas tanah tersebut, 
                dan mengenai luas tanah tersebut telah di ukur oleh petugas pengukur Kecamatan / saya ukur sendiri / tidak diukur dan hanya perkiraan saya dengan pihak Kedua serta penandatanganan Surat Pernyataan Tanda Batas dan Surat Pernyataan Ahli Waris saya / Kami bawakan sendiri untuk ditanda tangani bersama dengan saksi saksi yang bertanda dibawah.
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: 0 }}>3.</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', margin: 0 }}>
                Bahwa tanah yang dimohon belum bersertifikat dan belum pernah dimohonkan hak atas tanahnya.
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: 0 }}>4.</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', margin: 0 }}>
                Apabila di kemudian hari ternyata pernyataan saya ini tidak benar, maka saya di anggap memberikan keterangan <b>PALSU</b> Kepada pemerintah sesuai pasal 242 ayat 1, 2 dan 3 KUH pidana, oleh karena itu saya bertanggung jawab serta bersedia ditindak sesuai ketentuan perundang undangan yang berlaku.
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: 0 }}>5.</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', margin: 0 }}>
                Bahwa sehubungan dengan poin 4 diatas, maka saya menyatakan melepas hak atas tanah tersebut dan Surat Keputusan Haknya / Sertifikatnya dinyatakan karena hukum
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: 0 }}>6.</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', margin: 0 }}>
                Bahwa apabila dikemudian hari ternyata pernyataan saya ini terbukti tidak benar, maka segala akibat hukum yang ditimbulkan sepenuhnya menjadi tanggung jawab saya, dan tidak melibatkan pihak RT / RW Lurah dan Camat Selaku Pejabat Pembuat Surat Penyerahan ( SP )
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: 0 }}>7.</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', margin: 0 }}>
                Bahwa Tanah tersebut, apa bila ada gugatan / tuntutan dari pihak keluarga maupun pihak lain, maka saya dan ahli waris lainya akan bertanggung jawab, dan bersedia dituntut sesuai hukum yang berlaku
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'justify', marginBottom: '12pt' }}>
        Demikian pernyataan ini saya buat dan saya tanda tangani tanpa paksaan oleh siapapun dan pihak manapun untuk dipergunakan seperlunya.
      </p>

      {/* Signature section */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '5.4pt', marginTop: '20pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '226.8pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'center', textIndent: '21.3pt', margin: 0 }}>Mengetahui</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'center', textIndent: '21.3pt', margin: 0 }}>LURAH {tanah?.kelurahan?.toUpperCase()}</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: '35pt 0 0 0' }}>&nbsp;</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'center', margin: 0 }}>
                <b><u>{tanah?.nama_lurah || '.....................'}</u></b>
              </p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'center', margin: 0 }}>
                NIP. {tanah?.nip_lurah || '.....................'}
              </p>
            </td>
            <td style={{ width: '92.15pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ margin: 0 }}>&nbsp;</p>
            </td>
            <td style={{ width: '205.55pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'center', margin: 0 }}>
                Palu, ......................................202...
              </p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'center', margin: 0 }}>Yang Membuat Pernyataan</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', margin: '35pt 0 0 0' }}>&nbsp;</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', textAlign: 'center', margin: 0 }}>
                <b><u>{tanah?.nama_pemilik}</u></b>
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Materai (optional, uncomment if needed) */}
      {/* <div style={{ textAlign: 'center', color: '#E7E6E6', fontSize: '10pt', marginTop: '12pt' }}>
        <p>Materai Rp. 10.000,-</p>
      </div> */}

      {/* Witnesses */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '25pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>1.</p>
            </td>
            <td style={{ width: '180pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>Ketua RT..........................................</p>
            </td>
            <td style={{ width: '150pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>1. (................................)</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>2.</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>Sdr...................................................</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '115%', margin: 0 }}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? `${tanah.tempat_tgl_lahir_pemilik} Tahun`
                  : tanah?.tempat_tgl_lahir_pemilik}
              </p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>Tokoh Masyarakat............................</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>3. (................................)</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: '150%', margin: 0 }}>&nbsp;</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
