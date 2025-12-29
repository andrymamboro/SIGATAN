import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function BeritaAcaraTandaBatasNew({ tanah, pejabat, printRef }) {
  const today = format(new Date(), 'dd MMMM yyyy', { locale: id });
  
  // const getPejabat = (jabatan) => pejabat.find(p => p.jabatan === jabatan) || {};
  // const lurah = getPejabat('Lurah');
  // const camat = getPejabat('Camat');

  return (
    <div ref={printRef} className="print-container" style={{
      fontFamily: '"Times New Roman", serif',
      fontSize: '12pt',
      wordWrap: 'break-word',
      backgroundColor: 'white',
      padding: '36pt',
      maxWidth: '21cm',
      margin: '0 auto',
      border: '1px solid #ccc',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <style>
        {`
          .print-only {
            display: none;
          }
          @media print {
            @page { 
              size: 21cm 841.95pt; 
              margin: 36pt; 
            }
            body * {
              visibility: hidden !important;
            }
            body { 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
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
          src="/img/logokota.png"
          alt="Watermark"
          style={{ width: '600px', height: 'auto' }}
        />
      </div>

      {/* Title */}
      <p style={{margin: 0, textAlign: 'center'}}>
        <span style={{fontSize: '14pt', fontFamily: 'Arial, sans-serif', textDecoration: 'none'}}>&nbsp;</span>
      </p>
      
      <p style={{margin: 0, textAlign: 'center'}}>
        <strong><u><span style={{fontSize: '14pt'}}>SURAT PERNYATAAN TANDA BATAS</span></u></strong>
      </p>

      <p style={{margin: 0}}>
        <span style={{fontSize: '10pt', fontFamily: 'Arial, sans-serif'}}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </p>

      <p style={{margin: 0}}>
        <span style={{fontSize: '10pt', fontFamily: 'Arial, sans-serif'}}>&nbsp;</span>
      </p>

      {/* Content */}
      <p style={{margin: 0, textAlign: 'justify', marginBottom: '12pt'}}>
        Kami masing-masing yang bertanda tangan / cap /ibu jari kiri dibawah ini, yang berbatasan langsung dengan lokasi tanah sebagai berikut:
      </p>

      {/* Data Tanah Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '12pt',
        border: '0px solid #000'
      }}>
        <tbody>
          <tr>
            <td style={{
              width: '35%',
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              Nama Pemilik
            </td>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              {tanah?.nama_pemilik}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              Lokasi
            </td>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              {tanah?.lokasi}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              Kelurahan
            </td>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              {tanah?.kelurahan}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              Kecamatan
            </td>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              {tanah?.kecamatan}
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              Luas Tanah
            </td>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              {tanah?.luas_meter} M² ({tanah?.luas_terbilang})
            </td>
          </tr>
          <tr>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top'
            }}>
              Koordinat
            </td>
            <td style={{
              padding: '6pt',
              border: '0px solid #000',
              verticalAlign: 'top',
              position: 'relative'
            }}>
              Latitude: {tanah?.latitude}, Longitude: {tanah?.longitude}
              {tanah?.latitude && tanah?.longitude && (
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: 'center'
                }}>
                  <img 
                    width="60" 
                    height="60"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
                    alt="QR Code Koordinat"
                    style={{border: '1px solid #ccc', display: 'block'}}
                  />
                  <p style={{margin: '2px 0 0 0', fontSize: '6pt'}}>QR Maps</p>
                </span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{margin: 0, textAlign: 'justify', marginBottom: '12pt'}}>
        Yang telah diukur sendiri oleh Pemohon/pihak kelurahan/pihak kecamatan. Demikian Surat Pernyataan Tanda Batas ini kami buat dengan sebenarnya, serta dapat dipergunakan sebagaimana mestinya.
      </p>

      <p style={{margin: 0, lineHeight: '115%', fontWeight: 'bold', marginBottom: '8pt'}}>
        Batas-batas Tanah:
      </p>

      {/* Table */}
      <table style={{
        width: '552.85pt',
        marginLeft: '-8.8pt',
        borderCollapse: 'collapse',
        border: 0,
        cellSpacing: 0,
        cellPadding: 0
        
      }}>
        <tbody>
          {/* Row 1 - Utara & Timur */}
          <tr style={{height: '110.85pt'}}>
            <td style={{
              width: '262.3pt',
              padding: '0cm 5.4pt 0cm 5.4pt',
              height: '110.85pt',
              verticalAlign: 'top'
            }}>
              <p style={{margin: 0, textAlign: 'center'}}>Batas Sebelah Utara</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                {tanah?.batas_utara || '........................'}
              </p>
            </td>
            <td style={{
              width: '290.55pt',
              padding: '0cm 5.4pt 0cm 5.4pt',
              height: '110.85pt',
              verticalAlign: 'top'
            }}>
              <p style={{margin: 0, textAlign: 'center'}}>Batas Sebelah Timur</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                {tanah?.batas_timur || '........................'}
              </p>
            </td>
          </tr>

          {/* Row 2 - Selatan & Barat */}
          <tr style={{height: '106.75pt'}}>
            <td style={{
              width: '262.3pt',
              padding: '0cm 5.4pt 0cm 5.4pt',
              height: '106.75pt',
              verticalAlign: 'top'
            }}>
              <p style={{margin: 0, textAlign: 'center'}}>Batas Sebelah Selatan</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                {tanah?.batas_selatan || '........................'}
              </p>
            </td>
            <td style={{
              width: '290.55pt',
              padding: '0cm 5.4pt 0cm 5.4pt',
              height: '106.75pt',
              verticalAlign: 'top'
            }}>
              <p style={{margin: 0, textAlign: 'center'}}>Batas Sebelah Barat</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                {tanah?.batas_barat || '........................'}
              </p>
            </td>
          </tr>

          {/* Row 3 - Signatures */}
          <tr style={{height: '169.25pt'}}>
            <td style={{
              width: '262.3pt',
              padding: '0cm 5.4pt 0cm 5.4pt',
              height: '169.25pt',
              verticalAlign: 'top'
            }}>
               <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>
                Dilaporkan dan diagendakan kepada kami
              </p>
              <p style={{margin: 0, textAlign: 'center'}}>
                CAMAT {tanah?.kecamatan?.toUpperCase()}
              </p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>
                <strong><u>{tanah?.nama_camat || '.............................................'}</u></strong>
              </p>
              <p style={{margin: 0, textAlign:"center"}}>
                NIP. {tanah?.nip_camat || '...........................................'}
              </p>
              <p style={{margin: 0, textAlign: 'center'}}>
                <u><span style={{textDecoration: 'none'}}>&nbsp;</span></u>
              </p>
            </td>
            <td style={{
              width: '290.55pt',
              padding: '0cm 5.4pt 0cm 5.4pt',
              height: '169.25pt',
              verticalAlign: 'top'
            }}>
              <p style={{margin: 0, textAlign: 'center'}}>
                Palu, ......................................202...
              </p>
              <p style={{margin: 0, textAlign: 'center'}}>
                Dilaporkan dan diagendakan kepada kami
              </p>
              <p style={{margin: 0, textAlign: 'center'}}>
                LURAH {tanah?.kelurahan?.toUpperCase()}
              </p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center'}}>
                <strong><u>{tanah?.nama_lurah || '.............................................'}</u></strong>
              </p>
              <p style={{margin: 0, textAlign: 'center'}}>
                NIP. {tanah?.nip_lurah || '...........................................'}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{margin: 0}}>
        <span style={{fontFamily: '"Brush Script MT"', color: '#BFBFBF'}}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </p>
    </div>
  );
}
