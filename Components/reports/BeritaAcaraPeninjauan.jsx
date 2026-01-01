import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function BeritaAcaraPeninjauan({ tanah, pejabat, printRef }) {
  const today = format(new Date(), 'dd MMMM yyyy', { locale: id });
  
 

  return (
    <div 
      ref={printRef}
      className="print-container"
      style={{
        fontFamily: 'Times New Roman, serif',
        fontSize: '12pt',
        padding: '0pt 36pt 36pt 36pt',
        maxWidth: '21cm',
        margin: '0 auto',
        backgroundColor: 'white',
        border: '0px solid #ccc',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <style>
        {`
          .print-only {
            display: none;
          }
          @media print {
            @page {
              margin: 36pt;
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
            .print-only {
              display: block !important;
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

      {/* Watermark Logo */}
      <div className="print-only" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        opacity: 0.15,
        pointerEvents: 'none'
      }}>
        <img 
          src={`${import.meta.env.BASE_URL}img/logokota.png`}
          alt="Watermark"
          style={{ width: '800px', height: 'auto' }}
        />
      </div>

      {/* Title */}
      <p style={{ margin: 0, textAlign: 'center', marginBottom: '8pt' }}>
        <b><u><span style={{ fontSize: '14pt' }}>&nbsp;</span></u></b>
      </p>

      <p style={{ margin: 0, textAlign: 'center', marginBottom: '16pt', marginTop: '-20' }}>
        <b><u><span style={{ fontSize: '14pt' }}>BERITA ACARA PENINJAUAN TANAH</span></u></b>
      </p>

      {/* Identity Table */}
      <table style={{ width: '100%', marginLeft: '0', borderCollapse: 'collapse', marginBottom: '16pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '120pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>N a m a</p>
            </td>
            <td style={{ width: '15pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>{tanah?.nama_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? 'U m u r'
                  : 'Tempat Tanggal Lahir'}
              </p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? `${tanah.tempat_tgl_lahir_pemilik} Tahun`
                  : tanah?.tempat_tgl_lahir_pemilik}
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>Nik</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>{tanah?.nik_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>Warga Negara</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>Indonesia</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>Pekerjaan</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>{tanah?.pekerjaan_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>Tempat Tinggal</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ margin: 0, lineHeight: '150%' }}>{tanah?.alamat_pemilik}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ margin: 0, textAlign: 'justify', marginBottom: '12pt', marginTop: '12pt' }}>
        Tanah dimaksud telah di tinjau lokasi, benar milik nama tersebut diatas bahwa tanah tersebut tidak dalam keadaan sengketa dengan pihak lain dan belum memiliki surat – surat tanah lainya.
      </p>

      <p style={{ margin: 0, marginBottom: '12pt', marginTop: '12pt' }}>
        Ukuran Tanah <b><u>+</u></b> {tanah?.luas_perkalian} = {(tanah?.luas_meter || 0) % 1 === 0 ? Math.floor(tanah?.luas_meter || 0) : (tanah?.luas_meter || 0).toString().replace('.', ',')} M<sup>2</sup>
      </p>

      <p style={{ margin: 0, marginBottom: '8pt', marginTop: '12pt' }}>Dengan batas – batas sebagai berikut :</p>

      {/* Batas dengan QR Code */}
      <div style={{ position: 'relative', marginBottom: '16pt', marginTop: '8pt' }}>
        <table style={{ width: 'calc(100% - 110px)', marginLeft: '0', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ width: '150pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ margin: 0, textIndent: '1.7pt', lineHeight: '150%' }}>Sebelah Utara dengan</p>
                <p style={{ margin: 0, textIndent: '1.7pt', lineHeight: '150%' }}>Sebelah Timur dengan</p>
                <p style={{ margin: 0, textIndent: '1.7pt', lineHeight: '150%' }}>Sebelah Selatan dengan</p>
                <p style={{ margin: 0, textIndent: '1.7pt', lineHeight: '150%' }}>Sebelah Barat dengan</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ margin: 0, textAlign: 'justify', lineHeight: '150%' }}>: {tanah?.batas_utara}</p>
                <p style={{ margin: 0, textAlign: 'justify', lineHeight: '150%' }}>: {tanah?.batas_timur}</p>
                <p style={{ margin: 0, textAlign: 'justify', lineHeight: '150%' }}>: {tanah?.batas_selatan}</p>
                <p style={{ margin: 0, textAlign: 'justify', lineHeight: '150%' }}>: {tanah?.batas_barat}</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* QR Code */}
        {tanah?.latitude && tanah?.longitude && (
          <div style={{ position: 'absolute', right: '0', top: '-20px', textAlign: 'center', width: '100px' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '8pt', fontWeight: 'bold' }}>QR Code Maps</p>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
              alt="QR Code Koordinat"
              style={{ width: '90px', height: '90px', border: '1px solid #000', display: 'block', margin: '0 auto' }}
            />
            <p style={{ margin: '4px 0 0 0', fontSize: '7pt', lineHeight: '1.2' }}>
              Lat: {tanah.latitude}<br/>
              Long: {tanah.longitude}
            </p>
          </div>
        )}
      </div>

      <p style={{ margin: 0, marginBottom: '16pt', marginTop: '12pt' }}>
        Demikian surat peninjauan dibuat untuk perlunya.
      </p>

      {/* Signatures */}
      <table style={{ marginLeft: '5.4pt', borderCollapse: 'collapse', marginBottom: '12pt' }}>
        <tbody>
          <tr>
            <td colSpan={4} style={{ width: '19.0cm', padding: '0cm 5.4pt' }}>
              <p style={{ margin: 0, marginLeft: '334.55pt' }}>Palu, ......................................202...</p>
              <p style={{ margin: 0, textAlign: 'center' }}>Peninjau lokasi</p>
            </td>
          </tr>
          <tr>
            <td style={{ width: '191.4pt', padding: '0cm 5.4pt', verticalAlign: 'top' }}>
              <p style={{ margin: 0, textAlign: 'center' }}>Mengetahui RT.</p>
              
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>
                <b><u style={{ fontFamily: 'Arial, sans-serif' }}>...................</u></b>
              </p>
            </td>
            <td colSpan={2} style={{ width: '5.0cm', padding: '0cm 5.4pt', verticalAlign: 'top' }}>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
            </td>
            <td style={{ width: '205.5pt', padding: '0cm 5.4pt', verticalAlign: 'top' }}>
              <p style={{ margin: 0, textAlign: 'center' }}>Yang Bermohon</p>
              
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>
                <b><u style={{ fontFamily: 'Arial, sans-serif' }}>{tanah?.nama_pemilik}</u></b>
              </p>
            </td>
          </tr>
          <tr>
            <td colSpan={4} style={{ width: '19.0cm', padding: '0cm 5.4pt' }}>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>Dilaporkan dan diagendakan kepada kami</p>
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ width: '9.0cm', padding: '0cm 5.4pt', verticalAlign: 'top' }}>
              <p style={{ margin: 0, textAlign: 'center' }}>Lurah {tanah?.kelurahan}</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>
                <b><u>{tanah?.nama_lurah || '.....................'}</u></b>
              </p>
              <p style={{ margin: 0, textAlign: 'center' }}>NIP. {tanah?.nip_lurah || '.....................'}</p>
            </td>
            <td colSpan={2} style={{ width: '10.0cm', padding: '0cm 5.4pt', verticalAlign: 'top' }}>
              <p style={{ margin: 0, textAlign: 'center' }}>Kasi Pemerintahan</p>
              
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>&nbsp;</p>
              <p style={{ margin: 0, textAlign: 'center' }}>
                <b><u>{tanah?.nama_kasi_pemerintahan || '.....................'}</u></b>
              </p>
              <p style={{ margin: 0, textAlign: 'center' }}>NIP. {tanah?.nip_kasi_pemerintahan || '.....................'}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}