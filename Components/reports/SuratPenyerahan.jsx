import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function SuratPenyerahan({ tanah, wilayah, printRef }) {
  const today = format(new Date(), 'dd MMMM yyyy', { locale: id });
  
  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div 
      ref={printRef}
      className="print-container"
      style={{
        fontFamily: 'Times New Roman, serif',
        fontSize: '12pt',
        padding: '49.6pt 35.4pt 42.55pt 49.65pt',
        maxWidth: '21cm',
        margin: '0 auto',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <style>
        {`
          .print-only {
            display: none;
          }
          
          .page-break {
            margin: 30pt 0;
            border-bottom: 2px dashed #ccc;
            padding-bottom: 20pt;
          }
          
          .print-image-container {
            display: block;
          }
          
          .print-image {
            display: block;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          @media print {
            @page {
              margin: 0;
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
              padding: '49.6pt 35.4pt 42.55pt 49.65pt'!important;
              max-width: 100% !important;
              width: 100% !important;
            }
            .page-number {
              display:  !important;
            }
            .page-break {
              page-break-after: always !important;
              break-after: page !important;
              display: block !important;
              height: important;
              border: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-image-container {
              display: block !important;
              visibility: visible !important;
            }
            .print-image {
              display: block !important;
              visibility: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              opacity: 1 !important;
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

      {/* Watermark Logo - Page 1 */}
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
          alt="Watermark Page 1"
          style={{ width: '800px', height: 'auto' }}
        />
      </div>

      {/* Header with logo */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '12pt' }}>
        <img 
          src="/Components/img/logokota.png" 
          alt="Logo" 
          style={{ 
            position: 'absolute', 
            left: '36px', 
            top: '3px', 
            width: '84px', 
            height: '84px' 
          }} 
        />
        <p style={{ margin: '-8pt', fontSize: '16pt', fontWeight: 'bold' }}>PEMERINTAH KOTA PALU</p>
        <p style={{ margin: 0, fontSize: '20pt', fontWeight: 'bold' }}>KECAMATAN {tanah?.kecamatan?.toUpperCase()}</p>
        <p style={{ margin: '-2pt', fontSize: '12pt', fontWeight: 'bold' }}>{wilayah?.alamat_kantor_kecamatan || '.....................'} Kode Pos 94148</p>
        <div style={{ borderBottom: '3px solid black', width: '374px', margin: '6pt auto 0' }}></div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '12pt', marginTop: '24pt' }}>
        <p style={{ margin: 0, fontSize: '16pt', fontWeight: 'bold', textDecoration: 'underline' }}>SURAT PENYERAHAN</p>
        <p style={{ margin: '0pt 0', textAlign:'center' }}>
          <b>Nomor : {tanah?.nomor_penyerahan || '........................................................'}</b>
        </p>
      </div>

      {/* Opening paragraph */}
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '5pt' }}>
        Pada hari ini Palu, ......................................202... telah datang menghadap saya {tanah.nama_camat || '[nama camat]'} Camat / Kepala Wilayah Kecamatan {tanah?.kecamatan}Berdasarkan Keputusan Gubernur Kepala Daerah Tingkat I Sulawesi Tengah 27 Januari Nomor : 592.2 /33/ 1993 tentang Petunjuk dan isi penyerahan hak penguasaan tanah yang belum terdaftar.
      </p>
      {/* PIHAK PERTAMA */}
      <table style={{ width: '90%', borderCollapse: 'collapse', marginBottom: '5pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '25pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>I</p>
            </td>
            <td style={{ width: '15pt', padding: '2pt 0', verticalAlign: 'top' }}></td>
            <td style={{ width: '110pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>N a m a</p>
            </td>
            <td style={{ width: '15pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.nama_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? 'U m u r'
                  : 'Tempat Tanggal Lahir'}
              </p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>
                {tanah?.tempat_tgl_lahir_pemilik && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_pemilik)
                  ? `${tanah.tempat_tgl_lahir_pemilik} Tahun`
                  : tanah?.tempat_tgl_lahir_pemilik}
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Nik</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.nik_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Warga Negara</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Indonesia</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Pekerjaan</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.pekerjaan_pemilik}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Tempat Tinggal</p>
            </td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.alamat_pemilik}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ textAlign: 'justify', lineHeight: '120%', marginBottom: '8pt' }}>
        Dalam hal ini bertindak untuk diri sendiri, selanjutnya disebut <b>PIHAK PERTAMA</b> yang menyerahkan.
      </p>

      {/* PIHAK KEDUA */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '25pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>II</p>
            </td>
            <td style={{ width: '15pt', padding: '2pt 0', verticalAlign: 'top' }}></td>
            <td style={{ width: '110pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>N a m a</p>
            </td>
            <td style={{ width: '15pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.nama_penerima}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>
                {tanah?.tempat_tgl_lahir_penerima && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_penerima)
                  ? 'U m u r'
                  : 'Tempat Tanggal Lahir'}
              </p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>
                {tanah?.tempat_tgl_lahir_penerima && /^[0-9]{2}$/.test(tanah.tempat_tgl_lahir_penerima)
                  ? `${tanah.tempat_tgl_lahir_penerima} Tahun`
                  : tanah?.tempat_tgl_lahir_penerima}
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Nik</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.nik_penerima}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Warga Negara</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Indonesia</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Pekerjaan</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.pekerjaan_penerima}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Tempat Tinggal</p>
            </td>
            <td style={{ padding: '2pt 0' }}></td>
            <td style={{ padding: '2pt 0' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.alamat_penerima}</p>
            </td>
          </tr>
        </tbody>
      </table>

      

      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '8pt' }}>
        Dalam hal ini {tanah?.atas_nama ? (
          <>bertindak atas nama <b>{tanah.atas_nama}</b> sebagai kuasa penerima</>
        ) : (
          'bertindak untuk diri sendiri'
        )}, selanjutnya disebut <b>PIHAK KEDUA</b> {tanah?.kuasa_penerima || ''} yang menerima penyerahan dengan disaksikan oleh :
      </p>
      <table style={{ marginLeft: '36pt', marginBottom: '8pt', width: 'auto', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '2pt 8pt 2pt 0', textAlign: 'left' }}>- {tanah?.nama_lurah || '.....................'}</td>
            <td style={{ padding: '2pt 8pt', textAlign: 'left' }}>:</td>
            <td style={{ padding: '2pt 0', textAlign: 'left' }}>Lurah {tanah?.kelurahan}</td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 8pt 2pt 0', textAlign: 'left' }}>- {tanah?.nama_kasi_pemerintahan || '.....................'}</td>
            <td style={{ padding: '2pt 8pt', textAlign: 'left' }}>:</td>
            <td style={{ padding: '2pt 0', textAlign: 'left' }}>Kasi Pemerintahan</td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 8pt 2pt 0', textAlign: 'left' }}>- {tanah?.nama_administrasi_kecamatan || '.....................'}</td>
            <td style={{ padding: '2pt 8pt', textAlign: 'left' }}>:</td>
            <td style={{ padding: '2pt 0', textAlign: 'left' }}>Pengadministrasi Pertanahan Kecamatan {tanah?.kecamatan}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '8pt' }}>
        Bahwa PIHAK PERTAMA menyerahkan kepada PIHAK KEDUA dan PIHAK KEDUA menyatakan menerima penyerahan tersebut dari PIHAK PERTAMA yaitu sebidang tanah / dari hak 
        penguasaan atas tanah di atas tanah Negara yang bekas tanah Swapraja yang terletak di :
      </p>

      {/* Page Number 1 */}
      <p className="page-number" style={{ textAlign: 'right', marginTop: '20pt', marginBottom: '10pt', fontSize: '10pt' }}>Hal - 1 -</p>

      {/* Page Break 1 */}
      <div className="page-break" ></div>

      {/* Location details */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12pt', marginTop: '48pt' }}>
        <tbody>
          <tr>
            <td style={{ width: '180pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Propinsi Daerah Tingkat I</p>
            </td>
            <td style={{ width: '15pt', padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Sulawesi Tengah</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>K o t a</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Palu</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Kecamatan</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.kecamatan}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>Kelurahan</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.kelurahan}</p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>J a l a n</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>:</p>
            </td>
            <td style={{ padding: '2pt 0', verticalAlign: 'top' }}>
              <p style={{ lineHeight: '150%', margin: 0 }}>{tanah?.lokasi}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt', marginTop: '12pt' }}>
        Adapun luas bidang tanah yang dimaksud dalam Surat Penyerahan ini lebih kurang <u>+</u> <b>{(tanah?.luas_meter || 0) % 1 === 0 ? Math.floor(tanah?.luas_meter || 0) : (tanah?.luas_meter || 0).toString().replace('.', ',')} M<sup>2</sup></b> <b>({tanah?.luas_terbilang}{tanah?.luas_terbilang && !tanah.luas_terbilang.toLowerCase().includes('meter persegi') ? ' Meter Persegi' : ''})</b>, 
        sesuai gambar kasar yang dibuat pada pihak (terlampir)
      </p>

      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        Selanjutnya penyerahan hak Penguasaan / garapan atas tanah yang dimaksud meliputi pula hak atas tanah bangunan dan tanaman yang ada diatasnya yaitu:
      </p>

      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        PIHAK PERTAMA dan PIHAK KEDUA menyatakan bahwa penyerahan ini diletakkan dengan /tanpa pembayaran ganti rugi berupa uang oleh PIHAK KEDUA kepada PIHAK PERTAMA 
        secara <b>{tanah?.transaksi === 'Hibah' ? 'Hibah/Pemberian' : (tanah?.transaksi || '[pembelian/hibah]')}</b> {tanah?.transaksi === 'Jual Beli' && (
          <>
            yang nilainya telah disepakati bersama oleh kedua belah pihak sebesar <b>{tanah?.harga ? formatCurrency(tanah.harga) : '[harga transaksi]'}</b>
            {tanah?.harga_terbilang && <> ({tanah.harga_terbilang})</>}
          </>
        )}
      </p>
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        Penyerahan yang dimaksud dalam surat penyerahan ini dilakukan dengan syarat-syarat sebagai berikut :
      </p>

      {/* Pasal-pasal */}
      <div style={{ textAlign: 'center', lineHeight: '200%', marginBottom: '8pt' }}>
        <b>Pasal 1</b>
      </div>
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        Mulai hari ini obyek penyerahan yang diuraikan dalam surat penyerahan ini menjadi hak PIHAK KEDUA dan segala yang didapat dari, dan segala kerugian/beban atas obyek penyerahan tersebut menjadi hak/ tanggungan PIHAK KEDUA.
      </p>

      <div style={{ textAlign: 'center', lineHeight: '200%', marginBottom: '8pt' }}>
        <b>Pasal 2</b>
      </div>
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        PIHAK PERTAMA menjamin, bahwa hanya pihaknya yang berhak dan berwewenang melakukan penyerahan/pelepasan hak atas tanah tersebut dan tanah tersebut belum pernah diserahkan secara apapun kepada pihak lain serta bebas dari suatu sitaan, tidak terikat sebagai jaminan utang dan tidak tersangkut dalam suatu sengketa dan beban-beban lainnya.
      </p>

      <div style={{ textAlign: 'center', lineHeight: '200%', marginBottom: '8pt' }}>
        <b>Pasal 3</b>
      </div>
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '100pt' }}>
        PIHAK PERTAMA menjamin PIHAK KEDUA baik sekarang maupun kemudian hari, bahwa PIHAK KEDUA tidak akan mendapat tuntutan atau gugatan mengenai tanah tersebut, dengan demikian semua tuntutan dan gugatan sepenuhnya tanggung jawab PIHAK PERTAMA
      </p>
         {/* Page Number 2 */}
      <p className="page-number" style={{ textAlign: 'right', marginTop: '20pt', marginBottom: '10pt', fontSize: '10pt' }}>Hal - 2 -</p>

      {/* Page Break 2 */}
      <div className="page-break"></div>

      <div style={{ textAlign: 'center', lineHeight: '200%', marginBottom: '8pt', marginTop: '48pt' }}>
        <b>Pasal 4</b>
      </div>
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        Bahwa surat-surat yang berhubungan dengan penguasaan tanah tersebut diserahkan kepada PIHAK KEDUA, dengan demikian surat surat tersebut tidak berlaku lagi bagi kepentingan PIHAK PERTAMA
      </p>

      <div style={{ textAlign: 'center', marginBottom: '8pt' }}>
        <b>Pasal 5</b>
      </div>
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        Apabila terdapat perbedaan luas tanah yang diserahkan dengan hasil pengukuran resmi dikantor pertanahan setempat, maka kedua belah pihak mengakui/menerima hasil pengukuran luas Instansi tersebut
      </p>

      <div style={{ textAlign: 'center', marginBottom: '8pt' }}>
        <b>Pasal 6</b>
      </div>
      <p style={{ textAlign: 'justify', marginBottom: '12pt' }}>
        Segala biaya uang / kerugian bersangkutan dengan pembuatan surat penyerahan ini dibayar oleh : PIHAK KEDUA dan tidak menjadi tuntutan oleh PIHAK KEDUA setelah dilakukan registrasi surat ini.
      </p>

      <div style={{ textAlign: 'center', marginBottom: '8pt' }}>
        <b>Pasal 7</b>
      </div>
      <p style={{ textAlign: 'justify', lineHeight: '150%', marginBottom: '12pt' }}>
        Demikian surat penyerahan ini untuk menjadi bukti bagi para PIHAK dibuat dihadapan saksi yang namanya disebutkan dimuka dan setelah dibacakan serta dijelaskan oleh saya maka Surat Penyerahan ini ditanda tangani dan dibubuhkan cap ibu jari oleh PIHAK PERTAMA, PIHAK KEDUA,saksi-saksi  
        secara {tanah?.transaksi} {tanah?.transaksi === 'Jual Beli' && (
          <>
            yang nilainya telah disepakati bersama oleh kedua belah pihak sebesar <b>{tanah?.harga ? formatCurrency(tanah.harga) : '[harga transaksi]'}</b>
            {tanah?.harga_terbilang && <> ({tanah.harga_terbilang})</>}
          </>
        )}
      </p>

     

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12pt' }}>
          <tbody>
                        <tr>
              <td style={{ width: '187.05pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b>PIHAK KEDUA,</b></p>
                <p style={{ margin: '60pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_penerima}</u></b></p>
              </td>
              <td style={{ width: '127.6pt', padding: '0', verticalAlign: 'top' }}>&nbsp;</td>
              <td style={{ width: '229.55pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}>Palu, ....................................202...</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b>PIHAK PERTAMA,</b></p>
                <p style={{ margin: '60pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_pemilik}</u></b></p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}><b>SAKSI III</b></p>
                <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_administrasi_kecamatan || '[nama staf]'}</u></b></p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}><b>SAKSI II,</b></p>
                <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_kasi_pemerintahan || '[nama kasi]'}</u></b></p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}><b>SAKSI I,</b></p>
                <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_lurah || '[nama lurah]'}</u></b></p>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ textAlign: 'center', marginTop: '24pt', marginBottom: '10pt' }}>
          <b>CAMAT {tanah?.kecamatan?.toUpperCase()}</b>
        </p>
        <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
        <p style={{ textAlign: 'center', margin: 0 }}>
          <b><u>{tanah?.nama_camat || '...................................................'}</u></b>
        </p>
        <p style={{ textAlign: 'center', margin: 0 }}>
          NIP . {tanah?.nip_camat || '......................................'}
        </p>

    {/* Page Number 3 */}
      <p className="page-number" style={{ textAlign: 'right', marginTop: '20pt', marginBottom: '10pt', fontSize: '10pt' }}>Hal - 3 -</p>

      {/* Page Break 3 */}
      <div className="page-break"></div>

      <div style={{ paddingTop: '48pt' }}>
        <p style={{ lineHeight: '115%', marginBottom: '8pt' }}>
          Tanah Hak
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '5pt' }}>
          <tbody>
            <tr>
              <td style={{ width: '180pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>Yang memindahkan Hak</p>
              </td>
              <td style={{ width: '15pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>:</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>PIHAK PERTAMA</p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>N a m a</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>:</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}><b>{tanah?.nama_pemilik}</b></p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>A l a m a t</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>:</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>{tanah?.alamat_pemilik}</p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '4pt 0 0 0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>Yang menerima Hak</p>
              </td>
              <td style={{ padding: '4pt 0 0 0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>:</p>
              </td>
              <td style={{ padding: '4pt 0 0 0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>PIHAK KEDUA</p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>N a m a</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>:</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}><b>{tanah?.nama_penerima}</b></p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>A l a m a t</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>:</p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ lineHeight: '120%', margin: 0 }}>{tanah?.alamat_penerima}</p>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ lineHeight: '115%' }}>Luas tanah yang dipindahkan /diserahkan Kurang Lebih <b>  {tanah.luas_perkalian} = ± {(tanah?.luas_meter || 0) % 1 === 0 ? Math.floor(tanah?.luas_meter || 0) : (tanah?.luas_meter || 0).toString().replace('.', ',')} M<sup>2</sup></b></p>
        <p style={{ lineHeight: '115%' }}><b>({tanah?.luas_terbilang}{tanah?.luas_terbilang && !tanah.luas_terbilang.toLowerCase().includes('meter persegi') ? ' Meter Persegi' : ''})</b>,</p>
        <p style={{ lineHeight: '115%', marginBottom: '12pt' }}>Letak tanah : {tanah?.lokasi}</p>

        <p style={{ lineHeight: '150%' }}>Propinsi Daerah Tingkat I : Sulawesi Tengah</p>
        <p style={{ lineHeight: '150%' }}>Kota : Palu</p>
        <p style={{ lineHeight: '150%' }}>Kecamatan : {tanah?.kecamatan}</p>
        <p style={{ lineHeight: '150%' }}>Kelurahan : {tanah?.kelurahan}</p>
        <p style={{ lineHeight: '150%', marginBottom: '12pt' }}>J a l a n : {tanah?.lokasi}</p>

        <p style={{ marginBottom: '8pt' }}>Dengan batas-batas sebagai berikut :</p>

        {/* Batas dengan QR Code */}
        <div style={{ display: 'flex', marginLeft: '19.6pt', marginBottom: '12pt' }}>
          <div style={{ flex: '0 0 127.55pt' }}>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>Sebelah Utara dengan</p>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>Sebelah Timur dengan</p>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>Sebelah Selatan dengan</p>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>Sebelah Barat dengan</p>
          </div>
          <div style={{ flex: '1', paddingLeft: '5pt' }}>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>: {tanah?.batas_utara}</p>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>: {tanah?.batas_timur}</p>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>: {tanah?.batas_selatan}</p>
            <p style={{ textAlign: 'justify', lineHeight: '150%', margin: 0 }}>: {tanah?.batas_barat}</p>
          </div>
          {/* Mata Angin dan QR Code */}
          {tanah?.latitude && tanah?.longitude && (
            <div className="print-image-container" style={{ flex: '0 0 110px', textAlign: 'center', marginLeft: '20pt', marginTop: '-10cm' }}>
              <img 
                className="print-image"
                src="/Components/img/mata_angin.png"
                alt="Mata Angin"
                style={{ width: '100px', height: 'auto', marginBottom: '10px', display: 'block', maxWidth: '100%' }}
              />
              <p style={{ margin: '0 0 4px 0', fontSize: '8pt', fontWeight: 'bold' }}>QR Code Maps</p>
              <img 
                className="print-image"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`)}`}
                alt="QR Code Koordinat"
                style={{ width: '100px', height: '100px', border: '1px solid #000', display: 'block', maxWidth: '100%' }}
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '7pt', lineHeight: '1.2' }}>
                Lat: {tanah.latitude}<br/>
                Long: {tanah.longitude}
              </p>
            </div>
          )}
        </div>

        
        {/* Final signatures - same as above */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12pt' }}>
          <tbody>
            
            <tr>
              <td style={{ width: '187.05pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b>PIHAK KEDUA,</b></p>
                <p style={{ margin: '60pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_penerima}</u></b></p>
              </td>
              <td style={{ width: '127.6pt', padding: '0', verticalAlign: 'top' }}>&nbsp;</td>
              <td style={{ width: '229.55pt', padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}>Palu, ....................................202...</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b>PIHAK PERTAMA,</b></p>
                <p style={{ margin: '60pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margintop:'20pt' }}><b><u>{tanah?.nama_pemilik}</u></b></p>
              </td>
            </tr>
            <tr >
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}><b>SAKSI III</b></p>
                <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_administrasi_kecamatan || '[nama staf]'}</u></b></p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}><b>SAKSI II,</b></p>
                <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_kasi_pemerintahan || '[nama kasi]'}</u></b></p>
              </td>
              <td style={{ padding: '0', verticalAlign: 'top' }}>
                <p style={{ textAlign: 'center', margin: 0 }}><b>SAKSI I,</b></p>
                <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
                <p style={{ textAlign: 'center', margin: 0 }}><b><u>{tanah?.nama_lurah || '[nama lurah]'}</u></b></p>
              </td>
            </tr>
          </tbody>
        </table>

       <p style={{ textAlign: 'center', marginTop: '24pt', marginBottom: '10pt' }}>
          <b>CAMAT {tanah?.kecamatan?.toUpperCase()}</b>
        </p>
        <p style={{ margin: '30pt 0 0 0' }}>&nbsp;</p>
        <p style={{ textAlign: 'center', margin: 0 }}>
          <b><u>{tanah?.nama_camat || '...................................................'}</u></b>
        </p>
        <p style={{ textAlign: 'center', margin: 0 }}>
          NIP . {tanah?.nip_camat || '......................................'}
        </p>
       
      </div>
      {/* Page Number  */}
      <p className="page-number" style={{ textAlign: 'right', marginTop: '0pt', marginBottom: '0pt', fontSize: '10pt' }}>Hal - 4 -</p>
    </div>
    
  );
}