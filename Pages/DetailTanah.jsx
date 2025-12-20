import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/api/db';
import { getCurrentUser } from '@/api/authUser';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  FileText, 
  UserPlus,
  Printer,
  QrCode,
  Map,
  Home,
  Banknote,
  BanknoteIcon,
  CreditCardIcon,
 
  Contact2Icon,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowBigRightDash,
  ArrowBigRight,
  ArrowBigDown,
  ArrowBigUp,
  ArrowBigLeft,
  CalendarCheck2,
  UserPlus2Icon,
  User2,
  LucideUserRoundPlus,
  ArrowLeftRight,
  TagsIcon,
  Calendar,
  PenIcon,
  Signpost,
  ListFilterIcon,
  ListOrderedIcon,
  CheckCircle2,
  BookIcon,
  AwardIcon,
  CheckIcon,
  CheckSquare2
 

} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import TanahMap from '@/components/maps/TanahMap';

export default function DetailTanah() {
  const urlParams = new URLSearchParams(window.location.search);
  const tanahId = urlParams.get('id');

  const { data: tanah, isLoading } = useQuery({
    queryKey: ['tanah-detail', tanahId],
    queryFn: async () => {
      if (!tanahId) return null;
      const { data, error } = await supabase.from('tanah').select('*').eq('id', tanahId).single();
      if (error) throw new Error(error.message);
      // Parse polygon_coords if string
      if (data && data.polygon_coords && typeof data.polygon_coords === 'string') {
        try {
          data.polygon_coords = JSON.parse(data.polygon_coords);
        } catch (e) {
          console.error('Failed to parse polygon_coords:', e);
          data.polygon_coords = null;
        }
      }
      return data;
    },
    enabled: !!tanahId,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '-';
      return format(dateObj, 'dd MMMM yyyy', { locale: id });
    } catch (error) {
      return '-';    }
  };

  const qrValue = tanah?.latitude && tanah?.longitude 
    ? `https://www.google.com/maps?q=${tanah.latitude},${tanah.longitude}`
    : '';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tanah) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-800">Data tidak ditemukan</h2>
        <Link to={createPageUrl('DataTanah')}>
          <Button className="mt-4">Kembali ke Data Tanah</Button>
        </Link>
      </div>
    );
  }


  // InfoRow default
  const InfoRow = ({ label, value, icon: Icon, className }) => (
    <div className={`p-2 flex items-center py-2 border border-b-4 border-slate-300 rounded-md bg-white mb-2 shadow-sm ${className || ''}`}>
      {Icon && <Icon className="w-4 h-4 text-blue-500 mr-2" />}
      <span className="w-1/3 text-slate-800 text-sm flex items-center font-semibold">{label}</span>
      <span className="w-2/3 text-slate-800 font-medium">{value || '-'}</span>
    </div>
  );

  // InfoRow khusus status
  const InfoRowStatus = ({ label, value, icon: Icon }) => {
    let bg = 'bg-blue-100 text-blue-800';
    if (value === 'Selesai') bg = 'bg-emerald-100 text-emerald-800';
    else if (value === 'Ditolak') bg = 'bg-red-100 text-red-800';
    return (
      <div className={`p-2 flex items-center py-2 border border-b-4 border-slate-300 rounded-md mb-2 shadow-sm ${bg}`}>
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        <span className="w-1/3 text-sm flex items-center font-semibold">{label}</span>
        <span className="w-2/3 font-medium">{value || '-'}</span>
      </div>
    );
  };

  const InfoRow2 = ({ label, value, icon: Icon }) => (
    <div className="flex items-start text-align-start"> 
      {Icon && <Icon className="w-4 h-4 text-emerald-500 mr-2" />}
      <span className="w-1/3 text-slate-500 text-xs ">{label}</span>
      <span className="w-2/3 text-slate-500 text-xs ">{value || '-'}</span>
    </div>
  );

  return (

    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('DataTanah')}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Detail Data Tanah</h1>
          
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm border transition-all duration-200
              ${tanah.status === 'Selesai' ? 'bg-yellow-500 text-yellow-900 border-yellow' :
                tanah.status === 'Ditolak' ? 'bg-red-100 text-red-700 border-red-200' :
                tanah.status === 'Proses' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-slate-100 text-slate-500 border-slate-200'}
            `}
          >
            {/* Optionally add status icons here if needed */}
            {tanah.status || 'Proses'}
          </Badge>
          <Link to={createPageUrl('Laporan') + `?id=${tanah.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Printer className="w-4 h-4 mr-2" />
              Cetak Surat
            </Button>
          </Link>
          <Link to={createPageUrl('FormTanah') + `?id=${tanah.id}`}> 
            <Button className="bg-orange-500 hover:bg-orange-600" variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" /></svg>
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Bar as Tabs Trigger */}
      <Tabs defaultValue="pemilik" className="w-full mb-4">
        <TabsList className="w-full flex flex-col items-center mb-6 bg-transparent p-0 border-none shadow-none">
          <div className="flex w-full max-w-2xl justify-between items-center gap-2">
            {[
              { label: 'Pemilik', value: 'pemilik', icon: User },
              { label: 'Tanah', value: 'tanah', icon: MapPin },
              { label: 'Dokumen', value: 'dokumen', icon: FileText },
            ].map((tab, idx, arr) => (
              <React.Fragment key={tab.value}>
                <TabsTrigger
                  value={tab.value}
                  className={`flex flex-col items-center flex-1 focus:outline-none group bg-transparent border-none shadow-none p-0 hover:bg-slate-100 transition-all`}
                >
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 transition-all duration-200 mb-1
                      bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white border-blue-900 scale-110 shadow-lg`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1`}>{tab.icon && <tab.icon className="w-4 h-4" />} {tab.label}</span>
                </TabsTrigger>
                {idx < arr.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 rounded bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </TabsList >

        <TabsContent value="pemilik">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Data Pemilik & Tanah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-md p-2 mb-4">Pemilik</p>
                <InfoRow label="Nama Lengkap" value={tanah.nama_pemilik} icon={User} />
                <InfoRow label="NIK" value={tanah.nik_pemilik} icon={CreditCardIcon} />
                <InfoRow label="Umur" value={tanah.umur_pemilik ? `${tanah.umur_pemilik} Tahun` : '-'} icon={CalendarCheck2} />
                <InfoRow label="Pekerjaan" value={tanah.pekerjaan_pemilik} icon={TagsIcon} />
                <InfoRow label="Alamat" value={tanah.alamat_pemilik} icon={Home} />
              </div>
              <div>
                <p className="text-lg font-semibold bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-md p-2 mb-4">Penerima</p>
                <InfoRow label="Nama Penerima" value={tanah.nama_penerima} icon={User} />
                <InfoRow label="Atas Nama" value={tanah.atas_nama ? `${tanah.atas_nama}` : '-'} icon={UserPlus2Icon} />
                <InfoRow label="NIK" value={tanah.nik_penerima} icon={CreditCardIcon} />
                <InfoRow label="Umur" value={tanah.umur_penerima ? `${tanah.umur_penerima} Tahun` : '-'} icon={CalendarCheck2} />
                <InfoRow label="Pekerjaan" value={tanah.pekerjaan_penerima} icon={TagsIcon} />
                <InfoRow label="Alamat" value={tanah.alamat_penerima} icon={Home} />
              </div>
              <div>
                <p className="text-lg font-semibold bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-md p-2 mb-4">Data Tanah</p>
                <InfoRow label="Lokasi" value={tanah.lokasi} icon={MapPin} />
                <InfoRow label="Kecamatan" value={tanah.kecamatan} icon={MapPin} />
                <InfoRow label="Kelurahan" value={tanah.kelurahan} icon={MapPin} />
                <InfoRow label="Luas (P x L)" value={tanah.luas_perkalian} icon={Map} />
                <InfoRow label="Luas (m²)" value={tanah.luas_meter ? `${tanah.luas_meter} m²` : '-'} icon={Map} />
                <InfoRow label="Luas Terbilang" value={tanah.luas_terbilang} icon={FileText} />
              </div>
              <div>
                <p className="text-lg font-semibold bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-md p-2 mb-4">Batas Batas</p>
                <InfoRow label="Batas Utara" value={tanah.batas_utara || '-'} icon={ArrowBigUp} />
                <InfoRow label="Batas Timur" value={tanah.batas_timur || '-'} icon={ArrowBigRight} />
                <InfoRow label="Batas Selatan" value={tanah.batas_selatan || '-'} icon={ArrowBigDown} />
                <InfoRow label="Batas Barat" value={tanah.batas_barat || '-'} icon={ArrowBigLeft} />
                <p className="text-lg font-semibold bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-md p-2 mb-4">Transaksi</p>
                <InfoRow label="Jenis Transaksi" value={tanah.transaksi} icon={ArrowLeftRight} />
                <InfoRow label="Harga" value={tanah.harga ? formatCurrency(tanah.harga) : '-'} icon={Banknote} />
                <InfoRow label="Harga Terbilang" value={tanah.harga_terbilang} icon={FileText} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tanah">
          <div className="grid gap-6">
            {/* Card Data Tanah */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Lokasi Pada Peta
                </CardTitle>
              </CardHeader>
              {tanah.latitude && tanah.longitude && (
              <CardContent className="p-0">
                <TanahMap 
                    tanahList={[tanah]} 
                    center={[tanah.latitude, tanah.longitude]}
                    zoom={16}
                  />
                </CardContent> 
                                       
              )}          
             </Card>
            {qrValue && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    QR Code Koordinat
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-6">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`}
                    alt="QR Code Koordinat"
                    className="mb-4"
                  />
                  <p className="text-sm text-slate-500">
                    Lat: {tanah.latitude}, Long: {tanah.longitude}
                  </p>
                  <a 
                    href={qrValue} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-2"
                  >
                    Buka di Google Maps
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>     

        <TabsContent value="dokumen">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Data Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-8 text-bold">
              <div>
              <InfoRow label="Nomor SKPT" value={tanah.nomor_skpt}  icon={ListOrderedIcon}/>
              <InfoRow label="Tanggal SKPT" value={formatDate(tanah.tanggal_skpt)} icon={Calendar} />
              <InfoRow label="Nomor Penyerahan" value={tanah.nomor_penyerahan} icon={ListOrderedIcon} />
              <InfoRow label="Tanggal Penyerahan" value={formatDate(tanah.tanggal_penyerahan)} icon={Calendar} />
              <InfoRowStatus label="Status" value={tanah.status} icon={CheckCircle2} />
              </div>
              <div>
              <InfoRow label="Camat" value={tanah.nama_camat} icon={CheckIcon} />
              <InfoRow label="Lurah" value={tanah.nama_lurah} icon={CheckIcon} />
              <InfoRow label="Kasi Pemerintahan" value={tanah.nama_kasi_pemerintahan} icon={CheckIcon} />
              <InfoRow label="Administrasi Kecamatan" value={tanah.nama_administrasi_kecamatan} icon={CheckIcon} />
           
            </div>
            </CardContent>
          <CardFooter className="bg-slate-50 rounded-b-lg gap-6 grid grid-cols-6 align-start"> 
            <InfoRow2 className="text-xs text-slate-500" label="Dibuat:" value={formatDate(tanah.created_date)} />
            <InfoRow2 className="text-xs text-slate-500" label="Update:" value={formatDate(tanah.updated_date)} />
            <InfoRow2 className="text-xs text-slate-500" label="by:" value={tanah.created_by} />
          </CardFooter>
          </Card>

        </TabsContent>
            
      </Tabs>
    </div>
  );
}