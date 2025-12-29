import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, 
  FileText, 
  Printer,
  Download,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

import SuratPermohonan from '@/components/reports/SuratPermohonan';
import { supabase } from '@/api/db';
import { getCurrentUser } from '@/api/authUser';
import SuratSKPT from '@/components/reports/SuratSKPT';
import BeritaAcaraPeninjauan from '@/components/reports/BeritaAcaraPeninjauan';
import BeritaAcaraTandaBatas from '@/components/reports/BeritaAcaraTandaBatas';
import SuratPenyerahan from '@/components/reports/SuratPenyerahan';
import SuratPernyataan from '@/components/reports/SuratPernyataan';

const REPORT_TYPES = [
  { id: 'permohonan', name: 'Surat Permohonan', component: SuratPermohonan },
  { id: 'pernyataan', name: 'Surat Pernyataan', component: SuratPernyataan },
  { id: 'skpt', name: 'SKPT', component: SuratSKPT },
  { id: 'peninjauan', name: 'Berita Acara Peninjauan', component: BeritaAcaraPeninjauan },
  { id: 'tanda-batas', name: 'Berita Acara Tanda Batas', component: BeritaAcaraTandaBatas },
  { id: 'penyerahan', name: 'Surat Penyerahan', component: SuratPenyerahan },
];

export default function Laporan() {
  const [selectedTanah, setSelectedTanah] = useState(null);
  const [selectedReport, setSelectedReport] = useState('permohonan');
  const [user, setUser] = useState(null);
  const printRef = useRef();

  const urlParams = new URLSearchParams(window.location.search);
  const preselectedId = urlParams.get('tanah');

  useEffect(() => {
    // Ambil user gabungan dari helper
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const { data: tanahList = [] } = useQuery({
    queryKey: ['tanah-laporan', user?.kecamatan, user?.kelurahan],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase.from('tanah').select('*');
      if (user.role !== 'admin_kecamatan' && user.role !== 'admin_kelurahan' && user.role !== 'super_admin') {
        query = query.match({ kecamatan: user.kecamatan, kelurahan: user.kelurahan });
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!user,
  });

  

  const { data: wilayahList = [] } = useQuery({
    queryKey: ['wilayah-laporan'],
    queryFn: async () => {
  const { data, error } = await supabase.from('wilayah').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}
  });

  useEffect(() => {
    if (preselectedId && tanahList.length > 0) {
      const found = tanahList.find(t => {
        const valueStr = `${t.nama_pemilik} → ${t.nama_penerima} (${t.transaksi || 'Transaksi'})`;
        return valueStr === decodeURIComponent(preselectedId);
      });
      if (found) setSelectedTanah(found);
    }
  }, [preselectedId, tanahList]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      toast.info('Membuat PDF...');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      const reportName = REPORT_TYPES.find(r => r.id === selectedReport)?.name || 'Surat';
      const fileName = `${reportName}_${selectedTanah.nama_pemilik}_${new Date().getTime()}.pdf`;
      
      pdf.save(fileName);
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal membuat PDF');
    }
  };



    const filteredWilayah = selectedTanah 
    ? wilayahList.filter(w => 
        w.kecamatan === selectedTanah.kecamatan && 
        (!w.kelurahan || w.kelurahan === selectedTanah.kelurahan)
      )
    : [];

  const ReportComponent = REPORT_TYPES.find(r => r.id === selectedReport)?.component;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-white" />
          Laporan & Surat
        </h1>
        <p className="text-white mt-1">
          Cetak surat dan dokumen pertanahan
        </p>
      </div>

      {/* Selection */}
      <Card className="border-0 shadow-md bg-transparent">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label className="text-white font-medium">Pilih Data Tanah</Label>
              <Select 
                value={selectedTanah ? `${selectedTanah.nama_pemilik} → ${selectedTanah.nama_penerima} (${selectedTanah.transaksi || 'Transaksi'})` : ''} 
                onValueChange={(v) => {
                  const found = tanahList.find(t => `${t.nama_pemilik} → ${t.nama_penerima} (${t.transaksi || 'Transaksi'})` === v);
                  setSelectedTanah(found);
                }}
              >
                <SelectTrigger className="text-white bg-gray-700">
                  <SelectValue placeholder="Pilih data tanah..." className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700">
                  {tanahList.map(tanah => (
                    <SelectItem key={tanah.id} value={`${tanah.nama_pemilik} → ${tanah.nama_penerima} (${tanah.transaksi || 'Transaksi'})`} className="text-white">
                      {tanah.nama_pemilik} → {tanah.nama_penerima} ({tanah.transaksi || 'Transaksi'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">Jenis Surat</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport} >
                <SelectTrigger className="bg-gray-700 text-white">
                  <SelectValue placeholder="Pilih jenis surat..." className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700">
                  {REPORT_TYPES.map(report => (
                    <SelectItem key={report.id} value={report.id} className="text-white">
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              {selectedTanah && (
                <Button 
                  onClick={handlePrint}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Cetak
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTanah && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Report Types Tabs */}
          <Tabs value={selectedReport} onValueChange={setSelectedReport}>
            {REPORT_TYPES.map(report => (
              <TabsContent key={report.id} value={report.id}>
                <Card className="border-0 shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #4a484b 0%, #b6a3d5 100%)' }}>
                  <CardContent className="p-0 bg-slate-100" style={{ background: 'linear-gradient(135deg, #4a484b 0%, #b6a3d5 100%)' }}>
                    <div className="w-full overflow-auto" style={{ minHeight: '29.7cm' }}>
                      <div style={{ width: '21cm', minHeight: '29.7cm', margin: '0 auto', background: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                        <report.component 
                          tanah={selectedTanah}
                          wilayah={filteredWilayah && filteredWilayah.length > 0 ? filteredWilayah[0] : {}}
                          printRef={printRef}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      )}

      {!selectedTanah && (
        <Card className="border-0 shadow-md bg-grey">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">Pilih Data Tanah</h3>
            <p className="text-white mt-1">Silakan pilih data tanah untuk melihat dan mencetak surat</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}