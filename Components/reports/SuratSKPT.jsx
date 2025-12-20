import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';



export default function SuratSKPT({ tanah, wilayah, printRef }) {
  const today = format(new Date(), 'dd MMMM yyyy', { locale: id });
  
  // Ambil nama pejabat dari props tanah (hasil simpan form)
  const camat = {
    nama: tanah?.nama_camat,
    nip: tanah?.nip_camat,
    jabatan: tanah?.jabatan_camat
  };
  const lurah = {
    nama: tanah?.nama_lurah,
    nip: tanah?.nip_lurah,
    jabatan: tanah?.jabatan_lurah
  };

  
  



  return (
    <div ref={printRef} className="print-container" style={{
      fontFamily: '"Times New Roman", serif',
      fontSize: '12pt',
      wordWrap: 'break-word',
      backgroundColor: 'white',
      padding: '10pt 20pt 10pt 20pt',
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
              margin: 10pt 20pt 10pt 20pt; 
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
          src="/Components/img/logokota.png"
          alt="Watermark"
          style={{ width: '600px', height: 'auto' }}
        />
      </div>

      {/* Header dengan Logo */}
      <div style={{position: 'relative', textAlign: 'center', marginLeft: '36pt', textIndent: '36pt'}}>
        <span style={{
          position: 'absolute',
          left: '-40px',
          top: '9px',
          width: '147px',
          height: '136px'
        }}>
          <img 
            width="90" 
            height="88"
            src="/Components/img/logokota.png"
            alt="Logo Kota Palu"
          />
        </span>
        <p style={{margin: '-5pt'}}>
          <strong style={{fontSize: '20pt'}}>PEMERINTAH KOTA PALU</strong>
        </p>
        <p style={{margin: -15}}>
          <strong style={{fontSize: '18pt'}}>KECAMATAN {tanah?.kecamatan?.toUpperCase()}</strong>
        </p>
        <p style={{margin: -10}}>
          <strong style={{fontSize: '22pt'}}>KELURAHAN {tanah?.kelurahan?.toUpperCase()}</strong>
        </p>
        <p style={{margin: 0, fontFamily: 'Arial Unicode MS, serif',textAlign: 'center', fontSize: '12pt'}}>
          {wilayah
            ? (wilayah.alamat_kantor_kelurahan
                ? wilayah.alamat_kantor_kelurahan
                : <span style={{ color: 'red' }}>isi dulu alamat kantor kelurahan di pages Wilayah</span>
              )
            : <span style={{ color: 'red' }}>Data wilayah belum tersedia</span>
          }
        </p>
       
      </div>

      {/* Line Separator */}
      <div style={{marginLeft: '72pt', textIndent: '36pt', marginTop: '10pt', marginBottom: '10pt'}}>
        <img width="700" height="7" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" style={{backgroundColor: '#000', width: '100%', height: '3px'}} alt="" />
      </div>

      {/* Title */}
      <p style={{margin: 0, textAlign: 'center'}}>
        <strong><u style={{fontSize: '14pt'}}>SURAT KETERANGAN PENGUASAAN TANAH</u></strong>
      </p>

      <p style={{margin: 0, fontSize: '11pt', marginTop: '5pt',textAlign: 'center'}}>
        Nomor : {tanah?.nomor_skpt || '......................................................................'}
      </p>

      <p style={{margin: 0}}>&nbsp;</p>

      {/* Content */}
      <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}>
        Yang bertanda tangan dibawah ini Kepala Kelurahan {tanah?.kelurahan} Kecamatan {tanah?.kecamatan} Kota Palu Propinsi Sulawesi Tengah, menerangkan dengan sebenarnya bahwa :
      </p>

      {/* <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}></p> */}
      {/* Table Data Pemilik */}
      <table style={{width: '522.8pt', borderCollapse: 'collapse'}}>
        <tbody>
          <tr style={{height: '79.4pt'}}>
            <td style={{width: '180pt', minWidth: '160pt', verticalAlign: 'top', padding: '0cm 12pt'}}>
              <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}>N a m a</p>
              <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? 'U m u r'
                  : 'Tempat Tanggal Lahir'}
              </p>
              <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}>Nik</p>
              <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}>Warga Negara</p>
              <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}>Pekerjaan</p>
              <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt'}}>Tempat Tinggal</p>
            </td>
            <td style={{width: '24pt', verticalAlign: 'top', padding: '0cm 0.5pt', textAlign: 'center'}}>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>:</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>:</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>:</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>:</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>:</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>:</p>
            </td>
            <td style={{minWidth: '320pt', width: '100%', verticalAlign: 'top', padding: '0cm 12pt'}}>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}><strong>{tanah?.nama_pemilik}</strong></p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? `${tanah.tempat_tgl_lahir_pemilik} Tahun`
                  : tanah?.tempat_tgl_lahir_pemilik}
              </p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>{tanah?.nik_pemilik}</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>Indonesia</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>{tanah?.pekerjaan_pemilik}</p>
              <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt'}}>{tanah?.alamat_pemilik}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt', marginTop: '5pt'}}>
        Benar menguasai sebidang tanah, yang digunakan untuk pekarangan / kintal rumah ( Non Pertanian ) dengan status tanah yang dikuasai langsung oleh Negara (bekas tanah swapraja) seluas <strong>{(tanah?.luas_meter || 0) % 1 === 0 ? Math.floor(tanah?.luas_meter || 0) : (tanah?.luas_meter || 0).toString().replace('.', ',')} M<sup>2</sup> ({tanah?.luas_terbilang} meter persegi)</strong>, yang terletak di Kelurahan {tanah?.kelurahan} Kecamatan {tanah?.kecamatan} dengan batas-batas sebagai berikut :
      </p>

      <p style={{margin: 0, fontSize: '8pt'}}>&nbsp;</p>

      {/* Table Batas dengan QR Code */}
      <div style={{position: 'relative'}}>
        <table style={{marginLeft: '5.4pt', borderCollapse: 'collapse'}}>
          <tbody>
            <tr style={{height: '63.5pt'}}>
              <td style={{width: '5cm', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
                <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', lineHeight: '115%', fontSize: '11pt'}}>Sebelah Utara dengan</p>
                <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', lineHeight: '115%', fontSize: '11pt'}}>Sebelah Timur dengan</p>
                <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', lineHeight: '115%', fontSize: '11pt'}}>Sebelah Selatan dengan</p>
                <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', lineHeight: '115%', fontSize: '11pt'}}>Sebelah Barat dengan</p>
              </td>
              <td style={{width: '371.25pt', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
                <p style={{margin: 0, textAlign: 'justify', lineHeight: '115%', fontSize: '11pt'}}>: {tanah?.batas_utara}</p>
                <p style={{margin: 0, textAlign: 'justify', lineHeight: '115%', fontSize: '11pt'}}>: {tanah?.batas_timur}</p>
                <p style={{margin: 0, textAlign: 'justify', lineHeight: '115%', fontSize: '11pt'}}>: {tanah?.batas_selatan}</p>
                <p style={{margin: 0, textAlign: 'justify', lineHeight: '115%', fontSize: '11pt'}}>: {tanah?.batas_barat}</p>
              </td>
            </tr>
          </tbody>
        </table>
        
        {tanah?.latitude && tanah?.longitude && (
          <div style={{
            position: 'absolute',
            right: '0px',
            top: '0',
            textAlign: 'center'
          }}>
            <img 
              width="70" 
              height="70"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
              alt="QR Code Koordinat"
              style={{border: '1px solid #ccc'}}
            />
            <p style={{margin: 0, fontSize: '7pt', marginTop: '4pt', lineHeight: '1.2'}}>
              Lat: {tanah?.latitude}<br/>
              Long: {tanah?.longitude}
            </p>
          </div>
        )}
      </div>

      <p style={{margin: 0, textAlign: 'justify', fontSize: '11pt', marginTop: '12pt'}}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Selanjutnya diterangkan menurut pengakuan yang bersangkutan dihadapan Lurah sesuai Permohonan tanggal ..................., bahwa tanah tersebut berasal dari Tanah Negara bekas Tanah swapraja yang diperoleh secara {tanah?.asal_usul}
      </p>

      <p style={{margin: 0, textAlign: 'justify', textIndent: '21.3pt', fontSize: '11pt', marginTop: '0pt'}}>
        Bahwa diatas tanah tersebut telah diusahakan sebagai tanah pekarangan, dan belum berdiri bangunan rumah milik yang bersangkutan dan hingga sekarang tetap dikuasai serta dimanfaatkan oleh yang bersangkutan sebagai Tanah Pekarangan ( Non Pertanian ) serta pihak lain tidak ada yang keberatan / tidak dalam keadaan sengketa.
      </p>

      <p style={{margin: 0, textAlign: 'justify', textIndent: '22.5pt', fontSize: '11pt', marginTop: '0pt'}}>
        Demikian Surat Keterangan Penguasaan Tanah ini dibuat dengan sebenarnya untuk digunakan sebagaimana mestinya dan mengingat sumpah jabatan, dan apabila diatas tanah tersebut terdapat  sertifikat / surat penyerahan orang lain, maka SKPT ini batal dengan sendirinya demi hukum.
      </p>

      <p style={{margin: 0, textAlign: 'justify', textIndent: '22.5pt', fontSize: '11pt'}}>&nbsp;</p>
     
     
      {/* Signatures Table */}
      <table style={{width: '524.5pt', marginLeft: '5.4pt', borderCollapse: 'collapse'}}>
        <tbody>
          <tr style={{height: '59.2pt'}}>
            <td style={{width: '269.35pt', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
              <p style={{margin: 0, lineHeight: '115%', fontSize: '11pt'}}>
                Tanggal. ...................................................... 202..
              </p>
              <p style={{marginTop: '5pt', lineHeight: '115%', fontSize: '11pt'}}>
                Nomor. ........................................................ 202...
              </p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>Dilaporkan dan di agendakan kepada kami</p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>CAMAT {tanah?.kecamatan?.toUpperCase()}</p>
            </td>
            <td style={{width: '9cm', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
              <p style={{margin: 0, lineHeight: '150%', fontSize: '11pt'}}>&nbsp;</p>
              <p style={{margin: 0, lineHeight: '150%', fontSize: '11pt'}}>&nbsp;</p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>Palu, ......................................202...</p>
                            <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>LURAH {tanah?.kelurahan?.toUpperCase()}</p>
            </td>
          </tr>
          <tr style={{height: '50.05pt'}}>
            <td style={{width: '269.35pt', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
              <p style={{margin: 0, fontSize: '11pt'}}>&nbsp;</p>
              <p style={{margin: 0, fontSize: '11pt'}}>&nbsp;</p>
            </td>
            <td style={{width: '9cm', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
              <p style={{margin: 0, fontSize: '11pt'}}>&nbsp;</p>
              <p style={{margin: 0, fontSize: '11pt'}}>&nbsp;</p>
              {/* <p style={{margin: 0, fontSize: '11pt'}}>&nbsp;</p>
              <p style={{margin: 0, fontSize: '11pt'}}>&nbsp;</p> */}
            </td>
          </tr>
          <tr style={{height: '33.4pt'}}>
            <td style={{width: '269.35pt', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                <strong><u>{tanah?.nama_camat || '......................................'}</u></strong>
              </p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                NIP. {tanah?.nip_camat || '......................................'}
              </p>
            </td>
            <td style={{width: '9cm', verticalAlign: 'top', padding: '0cm 5.4pt'}}>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                <strong><u>{tanah?.nama_lurah || '......................................'}</u></strong>
              </p>
              <p style={{margin: 0, textAlign: 'center', fontSize: '11pt'}}>
                NIP. {tanah?.nip_lurah || '......................................'}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}