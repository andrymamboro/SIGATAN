import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function SuratPermohonan({ tanah, pejabat, printRef }) {
  const today = format(new Date(), 'dd MMMM yyyy', { locale: id });
  
  // const getPejabat = (jabatan) => pejabat.find(p => p.jabatan === jabatan) || {};
  // const lurah = getPejabat('Lurah');
  // const camat = getPejabat('Camat');

  return (
    <div 
      ref={printRef}
      className="print-container"
      style={{
        fontFamily: 'Times New Roman, serif',
        fontSize: '11pt',
        padding: '20pt 36pt 36pt 36pt',
        maxWidth: '21cm',
        margin: '0 auto',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <style>
        {`
          @media print {
            @page {
              margin: 20pt 36pt 36pt 36pt;
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

      {/* Right aligned header */}
      <table style={{ marginLeft: '332.55pt', borderCollapse: 'collapse', marginBottom: '5pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '35.45pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', margin: 0 }}>Yth.</p>
            </td>
            <td style={{ width: '147.7pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', margin: 0 }}>Kepada</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', margin: 0 }}>Bapak Lurah {tanah?.kelurahan} / Camat {tanah?.kecamatan}</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', margin: 0 }}>di - Tempat</p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '115%', marginBottom: '20pt' }}>
        Perihal : Permohonan Penerbitan SKPT/ Surat Penyerahan
      </p>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '115%', marginBottom: '8pt' }}>
        Saya yang bertanda di bawah ini :
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '19.6pt', marginBottom: '5pt', fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%' }}>
        <tbody>
          <tr>
            <td style={{ width: '180px', minWidth: '160px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>N a m a</td>
            <td style={{ width: '18px', padding: '2px 0', verticalAlign: 'top', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>:</td>
            <td style={{ minWidth: '260px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>{tanah?.nama_pemilik}</td>
          </tr>
          <tr>
            <td style={{ width: '180px', minWidth: '160px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>
              {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                ? 'U m u r'
                : 'Tempat Tanggal Lahir'}
            </td>
            <td style={{ width: '18px', padding: '2px 0', verticalAlign: 'top', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>:</td>
            <td style={{ minWidth: '260px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>
              {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                ? `${tanah.tempat_tgl_lahir_pemilik} Tahun`
                : tanah?.tempat_tgl_lahir_pemilik}
            </td>
          </tr>
          <tr>
            <td style={{ width: '180px', minWidth: '160px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>Nik</td>
            <td style={{ width: '18px', padding: '2px 0', verticalAlign: 'top', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>:</td>
            <td style={{ minWidth: '260px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>{tanah?.nik_pemilik}</td>
          </tr>
          <tr>
            <td style={{ width: '180px', minWidth: '160px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>Warga Negara</td>
            <td style={{ width: '18px', padding: '2px 0', verticalAlign: 'top', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>:</td>
            <td style={{ minWidth: '260px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>Indonesia</td>
          </tr>
          <tr>
            <td style={{ width: '180px', minWidth: '160px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>Pekerjaan</td>
            <td style={{ width: '18px', padding: '2px 0', verticalAlign: 'top', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>:</td>
            <td style={{ minWidth: '260px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>{tanah?.pekerjaan_pemilik}</td>
          </tr>
          <tr>
            <td style={{ width: '180px', minWidth: '160px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>Tempat Tinggal</td>
            <td style={{ width: '18px', padding: '2px 0', verticalAlign: 'top', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>:</td>
            <td style={{ minWidth: '260px', padding: '2px 12px', verticalAlign: 'top', whiteSpace: 'nowrap', fontSize: '11pt', fontFamily: 'Arial, sans-serif' }}>{tanah?.alamat_pemilik}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', textAlign: 'justify', textIndent: '21.3pt', marginBottom: '12pt' }}>
        Dengan ini saya mengajukan permohonan dihadapan Bapak Lurah {tanah?.kelurahan}, kiranya dapat menerbitkan Surat Keterangan Penguasaan Tanah (SKPT) / Surat Penyerahan (SP), 
        adapun tanah / lokasi yang saya mohon belum memiliki surat-surat / sertifikat dengan luas <b><u>+</u> {(tanah?.luas_meter || 0) % 1 === 0 ? Math.floor(tanah?.luas_meter || 0) : (tanah?.luas_meter || 0).toString().replace('.', ',')} M<sup>2</sup></b> (terbilang: <b>{tanah?.luas_terbilang} Meter Persegi</b>) adalah milik saya yang bertanda tangan dibawah ini 
        yang diperoleh secara {tanah?.asal_usul || '...............'}
      </p>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', textAlign: 'justify', textIndent: '21.3pt', marginBottom: '5pt' }}>
        Bahwa tanah tersebut terletak di Kelurahan {tanah?.kelurahan} Kecamatan {tanah?.kecamatan}, dengan batas-batas sebagai berikut :
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '32.4pt', marginBottom: '5pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '135pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textIndent: '1.7pt', margin: 0 }}>Sebelah Utara dengan</p>
            </td>
            <td style={{ width: '362.5pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textAlign: 'justify', margin: 0 }}>: {tanah?.batas_utara}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textIndent: '1.7pt', margin: 0 }}>Sebelah Timur dengan</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textAlign: 'justify', margin: 0 }}>: {tanah?.batas_timur}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textIndent: '1.7pt', margin: 0 }}>Sebelah Selatan dengan</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textAlign: 'justify', margin: 0 }}>: {tanah?.batas_selatan}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textIndent: '1.7pt', margin: 0 }}>Sebelah Barat dengan</p>
            </td>
            <td style={{ padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '150%', textAlign: 'justify', margin: 0 }}>: {tanah?.batas_barat}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '115%', marginBottom: '5pt' }}>
        Dengan ini melampirkan persyaratan sebagai berikut :
      </p>

      <div style={{ marginLeft: '39.3pt', marginBottom: '12pt' }}>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '115%', textIndent: '-18pt', margin: 0 }}>
          1. Foto Copy KTP dan Kartu Keluarga.
        </p>
        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '115%', textIndent: '-18pt', margin: 0 }}>
          2. Surat Surat Lainnya akan terlampir
        </p>
      </div>

      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', textAlign: 'justify', textIndent: '21.3pt', lineHeight: '115%', marginBottom: '5pt' }}>
        Demikian Surat Permohonan ini saya buat dengan sebenarnya dan apabila dikemudian hari ternyata lokasi / tanah yang saya mohon ada sengketa dengan subyek pemegang hak maupun obyek hak, 
        maka segala akibat yang ditimbulkan sepenuhnya menjadi tanggung jawab saya dan bersedia dituntut berdasarkan hukum yang berlaku.
      </p>

      {/* Signature section */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '40.85pt', marginTop: '5pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '248.05pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ margin: 0 }}>&nbsp;</p>
            </td>
            <td style={{ width: '241pt', padding: '0', verticalAlign: 'top' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', margin: 0 }}>
                Palu, ......................................202...
              </p>
              <p style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', margin: 0 }}>Yang bermohon</p>
              <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', textAlign: 'center', margin: 0 }}>
                <b><u>{tanah?.nama_pemilik}</u></b>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}