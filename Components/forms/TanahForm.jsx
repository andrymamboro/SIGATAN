





// Trigger NIK validation onBlur (after touched)
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, FileText, UserPlus, Save, Loader2, Map, Eye, Search, User2Icon, CreditCard, CalendarCheck, TagIcon, Home, HomeIcon, ArrowBigUp, ArrowBigRight, ArrowBigDown, ArrowBigLeft } from 'lucide-react';
import MapPicker from '@/components/maps/MapPicker';
import { numberToWordsIDR, numberToWordsArea } from '@/components/utils/NumberToWords';
import { getPejabatByWilayah } from '@/api/pejabat';

// Define InputField outside component to prevent re-creation on each render
const InputField = ({ label, name, type = 'text', required = false, placeholder = '', value, onChange, disabled, icon: Icon }) => {
  // Jika disabled dan value ada, tampilkan value sebagai caption (placeholder tidak muncul di input disabled)
  const showPlaceholder = disabled && !value ? placeholder : undefined;
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-blue-700 font-bold flex items-center gap-1">
        {Icon && <Icon className="w-4 h-4 text-emerald-500 mr-1" />} {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={showPlaceholder}
        required={required}
        disabled={disabled}
      />
      {disabled && !value && placeholder && (
        <div className="text-xs text-slate-400 italic mt-1">{placeholder}</div>
      )}
    </div>
  );
};

export default function TanahForm({ tanah, onSubmit, isLoading, wilayahList = [], allTanahData = [], user }) {
      // Ensure touched.nik_pemilik is set if value exists on mount (for edit mode)
      useEffect(() => {
        if (formData.nik_pemilik && !touched.nik_pemilik) {
          setTouched(prev => ({ ...prev, nik_pemilik: true }));
        }
      }, []);
    // Handler to set touched state for fields
    const handleBlur = (name) => {
      setTouched(prev => ({ ...prev, [name]: true }));
    };
  // ...state declarations...
  const [defaultPejabat, setDefaultPejabat] = useState({});
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [currentTab, setCurrentTab] = useState('pemilik');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showAsalUsulDialog, setShowAsalUsulDialog] = useState(false);
  const [asalUsulSearch, setAsalUsulSearch] = useState('');
  const [asalUsulPage, setAsalUsulPage] = useState(1);
  const itemsPerPage = 10;
  // Initialize form data with default values
  const getInitialFormData = () => ({
    nama_pemilik: '',
    nik_pemilik: '',
    tempat_tgl_lahir_pemilik: '',
    pekerjaan_pemilik: '',
    alamat_pemilik: '',
    luas_perkalian: '',
    luas_terbilang: '',
    luas_meter: '',
    batas_utara: '',
    batas_timur: '',
    batas_selatan: '',
    batas_barat: '',
    lokasi: '',
    latitude: '',
    longitude: '',
    location_type: 'marker',
    polygon_coords: null,
    asal_usul: '',
    nomor_skpt: '',
    tanggal_skpt: '',
    nama_penerima: '',
    nik_penerima: '',
    tempat_tgl_lahir_penerima: '',
    pekerjaan_penerima: '',
    alamat_penerima: '',
    atas_nama: '',
    transaksi: '',
    harga: '',
    harga_terbilang: '',
    nomor_penyerahan: '',
    tanggal_penyerahan: '',
    kecamatan: '',
    kelurahan: '',
    status: 'Proses',
    // Pejabat fields
    nama_camat: '',
    nip_camat: '',
    jabatan_camat: '',
    nama_lurah: '',
    nip_lurah: '',
    nama_kasi_pemerintahan: '',
    nip_kasi_pemerintahan: '',
    jabatan_kasi_pemerintahan: '',
    nama_administrasi_kecamatan: '',
    nip_administrasi_kecamatan: '',
    jabatan_administrasi_kecamatan: '',
    ...(tanah || {})
  });
  
  const [formData, setFormData] = useState(getInitialFormData());

  const [kelurahanOptions, setKelurahanOptions] = useState([]);

  useEffect(() => {
    if (tanah) {
      const loadedData = { ...formData, ...tanah };
      // Parse polygon_coords if it's a string
      if (loadedData.polygon_coords && typeof loadedData.polygon_coords === 'string') {
        try {
          loadedData.polygon_coords = JSON.parse(loadedData.polygon_coords);
        } catch (e) {
          console.error('Failed to parse polygon_coords:', e);
          loadedData.polygon_coords = null;
        }
      }
      setFormData(loadedData);
    }
  }, [tanah]);

  useEffect(() => {
    let kecamatan = formData.kecamatan;
    if (user?.role === 'admin_kecamatan') {
      kecamatan = user.kecamatan;
    }
    if (kecamatan) {
      const filtered = wilayahList
        .filter(w => w.kecamatan === kecamatan)
        .map(w => w.kelurahan);
      setKelurahanOptions([...new Set(filtered)]);
    }
    // Jika kecamatan & kelurahan sudah terisi, ambil data pejabat dari API
    if (formData.kecamatan && formData.kelurahan) {
      getPejabatByWilayah(formData.kecamatan, formData.kelurahan).then(pejabat => {
        setDefaultPejabat(pejabat || {});
        // Hanya update jika ada perubahan
        const changed = Object.entries(pejabat).some(([k, v]) => v && v !== formData[k]);
        if (changed) {
          setFormData(prev => ({ ...prev, ...pejabat }));
        }
      });
    } else {
      setDefaultPejabat({});
    }
  }, [formData.kecamatan, formData.kelurahan, wilayahList, user]);

  let kecamatanOptions = [...new Set(wilayahList.map(w => w.kecamatan))];
  if (user?.role === 'admin_kecamatan') {
    kecamatanOptions = user.kecamatan ? [user.kecamatan] : [];
    // Set formData.kecamatan otomatis jika belum terisi
    if (!formData.kecamatan && user.kecamatan) {
      setTimeout(() => {
        handleChange('kecamatan', user.kecamatan);
      }, 0);
    }
  }

  const handleChange = (name, value) => {
    setFormData(prev => {
      let next = {
        ...prev,
        [name]: value,
        ...(name === 'luas_meter' && value ? { luas_terbilang: numberToWordsArea(value) } : {}),
        ...(name === 'harga' && value ? { harga_terbilang: numberToWordsIDR(value) } : {})
      };
      return next;
    });
    // Jika kecamatan/kelurahan berubah, ambil data pejabat terbaru
    if ((name === 'kecamatan' || name === 'kelurahan')) {
      const kecamatan = name === 'kecamatan' ? value : formData.kecamatan;
      const kelurahan = name === 'kelurahan' ? value : formData.kelurahan;
      if (kecamatan && kelurahan) {
        getPejabatByWilayah(kecamatan, kelurahan).then(pejabat => {
          setDefaultPejabat(pejabat || {});
          setFormData(prev => ({ ...prev, ...pejabat }));
        });
      } else {
        setDefaultPejabat({});
      }
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      tempat_tgl_lahir_pemilik: formData.tempat_tgl_lahir_pemilik || '',
      tempat_tgl_lahir_penerima: formData.tempat_tgl_lahir_penerima || '',
      luas_meter: formData.luas_meter ? Number(formData.luas_meter) : null,
      harga: formData.harga ? Number(formData.harga) : null,
      latitude: formData.latitude ? Number(formData.latitude) : null,
      longitude: formData.longitude ? Number(formData.longitude) : null,
      polygon_coords: formData.polygon_coords || null,
      location_type: formData.location_type || 'marker',
      // Pastikan tanggal valid/null
      tanggal_skpt: formData.tanggal_skpt ? formData.tanggal_skpt : null,
      tanggal_penyerahan: formData.tanggal_penyerahan ? formData.tanggal_penyerahan : null,
    };
    try {
      onSubmit(processedData);
    } catch (err) {
      alert('Gagal menyimpan data: ' + (err?.message || err));
    }
  };

  const validateTab = (tab) => {
    const newErrors = {};
    // Validasi NIP: harus 16 digit jika diisi
    const nipFields = [
      'nip_camat',
      'nip_lurah',
      'nip_kasi_pemerintahan',
      'nip_administrasi_kecamatan'
    ];
    nipFields.forEach(field => {
      const val = formData[field];
      if (val && (!/^\d{18}$/.test(val))) {
        newErrors[field] = 'NIP harus 18 digit angka';
      }
    });
    if (tab === 'pemilik') {
      if (!formData.nama_pemilik) {
        newErrors.nama_pemilik = 'Nama Pemilik harus diisi';
      }
      if (!formData.nik_pemilik) {
        newErrors.nik_pemilik = 'NIK harus diisi';
      } else if (!/^\d{16}$/.test(formData.nik_pemilik)) {
        newErrors.nik_pemilik = 'NIK harus 16 digit angka';
      }
    } else if (tab === 'tanah') {
      if (!formData.kecamatan) {
        newErrors.kecamatan = 'Kecamatan harus dipilih';
      }
      if (!formData.kelurahan) {
        newErrors.kelurahan = 'Kelurahan harus dipilih';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextTab = () => {
    if (!validateTab(currentTab)) {
      return;
    }
    
    setErrors({});
    const tabs = ['pemilik', 'tanah', 'penerima', 'dokumen'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator as Tab Trigger */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="w-full flex flex-col items-center mb-2">
          <div className="flex w-full max-w-2xl justify-between items-center gap-2">
            {[
              { label: 'Pemilik', value: 'pemilik', icon: User },
              { label: 'Tanah', value: 'tanah', icon: Map },
              { label: 'Koordinat', value: 'koordinat', icon: MapPin },
              { label: 'Penerima', value: 'penerima', icon: UserPlus },
              { label: 'Dokumen', value: 'dokumen', icon: FileText },
            ].map((tab, idx, arr) => (
              <React.Fragment key={tab.value}>
                <button
                  type="button"
                  onClick={() => setCurrentTab(tab.value)}
                  className={`flex flex-col items-center flex-1 focus:outline-none group`}
                  aria-current={currentTab === tab.value ? 'step' : undefined}
                >
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 transition-all duration-200 mb-1 ${currentTab === tab.value ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white border-blue-900 scale-110 shadow-lg' : 'bg-white text-slate-900 border-slate-400 group-hover:bg-slate-100'}`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1 ${currentTab === tab.value ? 'text-slate-900' : 'text-slate-500'}`}>{tab.icon && <tab.icon className="w-4 h-4" />} {tab.label}</span>
                </button>
                {idx < arr.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 rounded bg-gradient-to-r ${idx < arr.findIndex(t => t.value === currentTab) ? 'from-slate-900 via-slate-800 to-blue-900' : 'from-slate-200 to-slate-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <TabsContent value="pemilik">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Data Pemilik
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputField label="Nama Pemilik" name="nama_pemilik" required placeholder="Masukkan nama lengkap" value={formData.nama_pemilik} onChange={(e) => handleChange('nama_pemilik', e.target.value)} icon={User2Icon} />
                {errors.nama_pemilik && <p className="text-red-500 text-sm mt-1">{errors.nama_pemilik}</p>} 
              </div>
              <div>
                <InputField label="NIK" name="nik_pemilik" required placeholder="16 digit NIK" value={formData.nik_pemilik} onChange={(e) => handleChange('nik_pemilik', e.target.value)} onBlur={() => handleBlur('nik_pemilik')} icon={CreditCard}/>
                {errors.nik_pemilik && (touched.nik_pemilik || tanah) && <p className="text-red-500 text-sm mt-1">{errors.nik_pemilik}</p>}
              </div>
                            {/* Contoh untuk NIP pejabat, tambahkan onBlur dan error tampil jika touched */}
                            {/*
                            <InputField label="NIP Camat" name="nip_camat" value={formData.nip_camat} onChange={e => handleChange('nip_camat', e.target.value)} onBlur={() => handleBlur('nip_camat')} />
                            {errors.nip_camat && touched.nip_camat && <p className="text-red-500 text-sm mt-1">{errors.nip_camat}</p>}
                            */}
              <InputField label="Tempat, Tanggal Lahir atau Umur" name="tempat_tgl_lahir_pemilik" placeholder="Contoh: Palu, 20 Desember 1980" value={formData.tempat_tgl_lahir_pemilik} onChange={(e) => handleChange('tempat_tgl_lahir_pemilik', e.target.value)} icon={CalendarCheck} />
              <InputField label="Pekerjaan" name="pekerjaan_pemilik" placeholder="Jenis pekerjaan" value={formData.pekerjaan_pemilik} onChange={(e) => handleChange('pekerjaan_pemilik', e.target.value)} icon={TagIcon}/>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-blue-700 font-bold flex items-center gap-2"><HomeIcon className='h-4 w-4 text-green-700'/>Alamat</Label>
                <Textarea
                  value={formData.alamat_pemilik || ''}
                  onChange={(e) => handleChange('alamat_pemilik', e.target.value)}
                  placeholder="Alamat lengkap"
                  className="border-slate-200"
                /> 
              </div>
              <div className="md:col-span-2 flex justify-between pt-6 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  <span className="font-medium">Step 1 of 4:</span> Data Pemilik
                </div>
                <Button 
                  type="button"
                  onClick={handleNextTab}
                  className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                >
                  Selanjutnya
                  <MapPin className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tanah">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Data Tanah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-blue-700 font-bold flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500 mr-1"/>Kecamatan <span className="text-red-500">*</span></Label>
                  <Select value={formData.kecamatan} onValueChange={(v) => handleChange('kecamatan', v)} disabled={user?.role === 'admin_kecamatan'}>
                    <SelectTrigger className={errors.kecamatan ? 'border-red-500' : 'border-blue-500'}>
                      <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {kecamatanOptions
                        .filter(k => user?.role === 'admin_kecamatan' ? k === user?.kecamatan : true)
                        .map(k => (
                          <SelectItem key={k} value={k}>{k}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-blue-700 font-bold flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500 mr-1"/>Kelurahan <span className="text-red-500">*</span></Label>
                  <Select value={formData.kelurahan} onValueChange={(v) => handleChange('kelurahan', v)}>
                    <SelectTrigger className={errors.kelurahan ? 'border-red-500' : 'border-blue-500'}>
                      <SelectValue placeholder="Pilih Kelurahan" />
                    </SelectTrigger>
                    <SelectContent>
                      {kelurahanOptions.map(k => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.kelurahan && <p className="text-red-500 text-sm mt-1">{errors.kelurahan}</p>}
                </div>
                <div className="space-y-2">
                <Label className="text-blue-700 font-bold flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500 mr-1"/>Lokasi <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.lokasi || ''}
                  onChange={(e) => handleChange('lokasi', e.target.value)}
                  placeholder="Deskripsi lokasi tanah"
                  className="border-blue-500 border-2"
                  required
                />
              </div>
              </div>             

              

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InputField className ="w-16" label="Luas (P x L)" name="luas_perkalian" placeholder="10 x 15" value={formData.luas_perkalian} onChange={(e) => handleChange('luas_perkalian', e.target.value)} icon={Map} />
                <InputField className ="w-16" label="Luas (m²)" name="luas_meter" type="number" step="1" placeholder="150" value={formData.luas_meter} onChange={(e) => handleChange('luas_meter', e.target.value)} icon={Map} />
                <div className="space-y-0 col-span-2">
                  <Label htmlFor="luas_terbilang" className="text-blue-700 font-bold flex items-center gap-1"><FileText className="w-4 h-4 text-emerald-500 mr-1"/>Luas Terbilang</Label>
                  <Input
                    className="col-span-2"
                    id="luas_terbilang"
                    type="text"
                    value={formData.luas_terbilang || ''}
                    onChange={(e) => handleChange('luas_terbilang', e.target.value)}
                    placeholder="Otomatis terisi"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Batas Utara" name="batas_utara" placeholder="Berbatasan dengan..." value={formData.batas_utara} onChange={(e) => handleChange('batas_utara', e.target.value)} icon={ArrowBigUp} />
                <InputField label="Batas Timur" name="batas_timur" placeholder="Berbatasan dengan..." value={formData.batas_timur} onChange={(e) => handleChange('batas_timur', e.target.value)} icon={ArrowBigRight} />
                <InputField label="Batas Selatan" name="batas_selatan" placeholder="Berbatasan dengan..." value={formData.batas_selatan} onChange={(e) => handleChange('batas_selatan', e.target.value)} icon={ArrowBigDown} />
                <InputField label="Batas Barat" name="batas_barat" placeholder="Berbatasan dengan..." value={formData.batas_barat} onChange={(e) => handleChange('batas_barat', e.target.value)} icon={ArrowBigLeft} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-blue-700 font-bold">Asal Usul Tanah</Label>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-50 text-blue-600 border-blue-300"
                    onClick={() => setShowAsalUsulDialog(true)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Lihat Contoh
                  </Badge>
                </div>
                <Textarea
                  value={formData.asal_usul || ''}
                  onChange={(e) => handleChange('asal_usul', e.target.value)}
                  placeholder="Warisan, Pembelian, dll"
                  className="border-blue-500 border-2"
                  rows={5}
                />
              </div>
              
              <div className="flex justify-between pt-6 border-t border-slate-200">
                <Button 
                  type="button"
                  onClick={() => setCurrentTab('pemilik')}
                  className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                >
                  <User className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500"><span className="font-medium">Step 2 of 4:</span> Data Tanah</span>
                  <Button 
                    type="button"
                    onClick={handleNextTab}
                    className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                  >
                    Selanjutnya
                    <MapPin className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="penerima">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Data Penerima / Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <InputField label="Nama Penerima" name="nama_penerima" placeholder="Nama lengkap" value={formData.nama_penerima} onChange={(e) => handleChange('nama_penerima', e.target.value)} icon={User2Icon} />
                             <InputField label="NIK Penerima" name="nik_penerima" placeholder="16 digit NIK" value={formData.nik_penerima} onChange={(e) => handleChange('nik_penerima', e.target.value)} icon={CreditCard} />
                             <InputField label="Tempat, Tanggal Lahir atau Umur" name="tempat_tgl_lahir_penerima" placeholder="Contoh: Palu, 20 Desember 1980" value={formData.tempat_tgl_lahir_penerima} onChange={(e) => handleChange('tempat_tgl_lahir_penerima', e.target.value)} icon={CalendarCheck} />
                           <InputField label="Pekerjaan" name="pekerjaan_penerima" placeholder="Jenis pekerjaan" value={formData.pekerjaan_penerima} onChange={(e) => handleChange('pekerjaan_penerima', e.target.value)} icon={TagIcon} />
              </div>
              
              <div className="space-y-2">
                <Label className="text-blue-700 font-bold flex items-center gap-2"><HomeIcon className='h-4 w-4 text-green-700'/>Alamat</Label>
                             
                <Textarea
                  value={formData.alamat_penerima || ''}
                  onChange={(e) => handleChange('alamat_penerima', e.target.value)}
                  placeholder="Alamat lengkap"
                  className="border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Atas Nama" name="atas_nama" placeholder="Atas nama" value={formData.atas_nama} onChange={(e) => handleChange('atas_nama', e.target.value)} />
                <div className="">
                  <Label className="text-blue-700 font-bold">Jenis Transaksi</Label>
                  <Select  value={formData.transaksi} onValueChange={(v) => handleChange('transaksi', v)}>
                    <SelectTrigger className="border-b-blue-500 border-b-2">
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jual Beli">Jual Beli</SelectItem>
                      <SelectItem value="Hibah/Pemberian">Hibah/Pemberian</SelectItem>
                      {/* <SelectItem value="Waris">Waris</SelectItem>
                      <SelectItem value="Tukar Menukar">Tukar Menukar</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.transaksi === 'Jual Beli' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Harga (Rp)" name="harga" type="number" placeholder="0" value={formData.harga} onChange={(e) => handleChange('harga', e.target.value)} />
                  <div className="space-y-2">
                    <Label htmlFor="harga_terbilang" className="text-slate-700 font-medium">
                      Harga Terbilang
                    </Label>
                    <Input
                      id="harga_terbilang"
                      type="text"
                      value={formData.harga_terbilang || ''}
                      onChange={(e) => handleChange('harga_terbilang', e.target.value)}
                      placeholder="Otomatis terisi"
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 bg-slate-50"
                      readOnly
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-slate-200">
                <Button 
                  type="button"
                  onClick={() => setCurrentTab('tanah')}
                  className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500"><span className="font-medium">Step 3 of 4:</span> Data Penerima</span>
                  <Button 
                    type="button"
                    onClick={handleNextTab}
                    className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                  >
                    Selanjutnya
                    <FileText className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="koordinat">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                {/* Ganti icon dan judul sesuai kebutuhan */}
                <FileText className="w-5 h-5" />
                Koordinat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Konten tab custom di sini */}
              <div className="text-slate-700">
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-green-700 font-bold">Koordinat Lokasi</Label>
                  <Button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="bg-gradient-to-b from-green-700 via-green-800 to-emerald-900 text-white hover:brightness-110"
                    size="sm"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Pilih dari Peta
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Latitude" name="latitude" type="number" step="0.0000001" placeholder="-6.xxxxx" value={formData.latitude} onChange={(e) => handleChange('latitude', e.target.value)} />
                  <InputField label="Longitude" name="longitude" type="number" step="0.0000001" placeholder="106.xxxxx" value={formData.longitude} onChange={(e) => handleChange('longitude', e.target.value)} />
                </div>
                {/* Toggle for Polygon/Polyline */}
                {(formData.location_type === 'polygon' || formData.location_type === 'polyline') && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm text-slate-600">
                        Koordinat {formData.location_type === 'polygon' ? 'Polygon' : 'Polyline'} {formData.polygon_coords ? `(${formData.polygon_coords.length} titik)` : ''}
                      </Label>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const newCoords = formData.polygon_coords ? [...formData.polygon_coords] : [];
                          newCoords.push([
                            Number(formData.latitude) || 0,
                            Number(formData.longitude) || 0
                          ]);
                          handleChange('polygon_coords', newCoords);
                        }}
                      >
                        + Tambah Titik
                      </Button>
                    </div>
                    {formData.polygon_coords && formData.polygon_coords.length > 0 ? (
                      <div className="max-h-48 overflow-y-auto flex flex-col gap-1">
                        {formData.polygon_coords.map((coord, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                            <span className="text-xs font-semibold text-slate-500 w-6">{idx + 1}.</span>
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                step="0.000001"
                                value={coord[0]}
                                onChange={e => {
                                  const newCoords = [...formData.polygon_coords];
                                  newCoords[idx][0] = parseFloat(e.target.value) || 0;
                                  handleChange('polygon_coords', newCoords);
                                }}
                                className="h-8 text-xs"
                                placeholder="Latitude"
                              />
                              <Input
                                type="number"
                                step="0.000001"
                                value={coord[1]}
                                onChange={e => {
                                  const newCoords = [...formData.polygon_coords];
                                  newCoords[idx][1] = parseFloat(e.target.value) || 0;
                                  handleChange('polygon_coords', newCoords);
                                }}
                                className="h-8 text-xs"
                                placeholder="Longitude"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              type="button"
                              onClick={() => {
                                const newCoords = formData.polygon_coords.filter((_, i) => i !== idx);
                                handleChange('polygon_coords', newCoords.length > 0 ? newCoords : null);
                              }}
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-slate-400">
                        Belum ada titik {formData.location_type === 'polygon' ? 'polygon' : 'polyline'}. Gambar di peta atau tambah manual.
                      </div>
                    )}
                  </div>
                )}
                </div>
                {formData.latitude && formData.longitude && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {formData.location_type === 'polygon' ? 'Polygon (Pusat): ' : 'Koordinat: '}
                      {formData.latitude}, {formData.longitude}
                      {' '}
                      <a 
                        href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-2"
                      >
                        Lihat di Google Maps →
                      </a>
                    </p>
                    {formData.location_type === 'polygon' && formData.polygon_coords && (
                      <p className="text-xs text-blue-700 mt-1">
                        ✓ Polygon dengan {formData.polygon_coords.length} titik koordinat
                      </p>
                    )}
                  </div>
                )}
                {/* Tombol Selanjutnya */}
                <div className="flex justify-between pt-6 border-t border-slate-200 mt-8">
                  <Button
                    type="button"
                    className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                    onClick={() => setActiveTab && setActiveTab('tanah')}
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Kembali
                  </Button>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500"><span className="font-medium">Step 3 of 4:</span> Data Koordinat</span>
                    <Button
                      type="button"
                      className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                      onClick={() => setActiveTab && setActiveTab('dokumen')}
                    >
                      Selanjutnya
                      <UserPlus className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="dokumen">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Data Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nomor SKPT" name="nomor_skpt" placeholder="Nomor surat" value={formData.nomor_skpt} onChange={(e) => handleChange('nomor_skpt', e.target.value)} />
                <InputField label="Tanggal SKPT" name="tanggal_skpt" type="date" value={formData.tanggal_skpt} onChange={(e) => handleChange('tanggal_skpt', e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nomor Penyerahan" name="nomor_penyerahan" placeholder="Nomor surat" value={formData.nomor_penyerahan} onChange={(e) => handleChange('nomor_penyerahan', e.target.value)} />
                <InputField label="Tanggal Penyerahan" name="tanggal_penyerahan" type="date" value={formData.tanggal_penyerahan} onChange={(e) => handleChange('tanggal_penyerahan', e.target.value)} />
              </div>

              {/* Pejabat Fields: 1 baris, 12 kolom */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <InputField label="Nama Camat" name="nama_camat" value={formData.nama_camat} onChange={e => handleChange('nama_camat', e.target.value)} disabled placeholder={defaultPejabat.nama_camat || ''} />
                </div>
                <div>
                  <InputField label="Nama Lurah" name="nama_lurah" value={formData.nama_lurah} onChange={e => handleChange('nama_lurah', e.target.value)} disabled placeholder={defaultPejabat.nama_lurah || ''} />
                </div>
                <div>
                  <InputField label="Nama Kasi Pemerintahan" name="nama_kasi_pemerintahan" value={formData.nama_kasi_pemerintahan} onChange={e => handleChange('nama_kasi_pemerintahan', e.target.value)} disabled placeholder={defaultPejabat.nama_kasi_pemerintahan || ''} />
                </div>
                <div>
                  <InputField label="Nama Administrasi Kecamatan" name="nama_administrasi_kecamatan" value={formData.nama_administrasi_kecamatan} onChange={e => handleChange('nama_administrasi_kecamatan', e.target.value)} disabled placeholder={defaultPejabat.nama_administrasi_kecamatan || ''} />
                </div>
                {/* Hidden fields */}
                <input type="hidden" name="nip_camat" value={formData.nip_camat || ''} />
                <input type="hidden" name="jabatan_camat" value={formData.jabatan_camat || ''} />
                <input type="hidden" name="nip_lurah" value={formData.nip_lurah || ''} />
                <input type="hidden" name="jabatan_lurah" value={formData.jabatan_lurah || ''} />
                <input type="hidden" name="nip_kasi_pemerintahan" value={formData.nip_kasi_pemerintahan || ''} />
                <input type="hidden" name="jabatan_kasi_pemerintahan" value={formData.jabatan_kasi_pemerintahan || ''} />
                <input type="hidden" name="nip_administrasi_kecamatan" value={formData.nip_administrasi_kecamatan || ''} />
                <input type="hidden" name="jabatan_administrasi_kecamatan" value={formData.jabatan_administrasi_kecamatan || ''} />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                  <SelectTrigger className="border-blue-500 border-2">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Proses">Proses</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-200">
                <Button 
                  type="button"
                  onClick={() => setCurrentTab('penerima')}
                  className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500"><span className="font-medium">Step 4 of 4:</span> Data Dokumen</span>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900 text-white hover:brightness-110 px-8"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>

    {/* Map Picker Modal */}
    {showMapPicker && (
      <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowMapPicker(false)}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[98vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <MapPin className="w-5 h-5 text-blue-600" />
              Pilih Lokasi Tanah di Peta
            </h2>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(98vh - 80px)' }}>
            <MapPicker
              initialPosition={
                formData.latitude && formData.longitude
                  ? [Number(formData.latitude), Number(formData.longitude)]
                  : [-0.7861746, 119.8689641]
              }
              initialPolygon={formData.polygon_coords}
              initialMode={formData.location_type || 'marker'}
              existingTanahData={(allTanahData || []).filter(t => t?.id !== tanah?.id)}
              onSelectLocation={(coords) => {
                setFormData(prev => ({
                  ...prev,
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  location_type: coords.type || 'marker',
                  polygon_coords: coords.polygon || null
                }));
              }}
              onClose={() => setShowMapPicker(false)}
            />
          </div>
        </div>
      </div>
    )}

    {/* Asal Usul Dialog */}
    <Dialog open={showAsalUsulDialog} onOpenChange={setShowAsalUsulDialog}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contoh Asal Usul Tanah</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Cari asal usul..."
              value={asalUsulSearch}
              onChange={(e) => {
                setAsalUsulSearch(e.target.value);
                setAsalUsulPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* List */}
          <div className="space-y-2">
            {(() => {
              // Get unique asal usul
              const uniqueAsalUsul = [...new Set(
                allTanahData
                  .filter(t => t.asal_usul && t.asal_usul.trim() !== '')
                  .map(t => t.asal_usul.trim())
              )];

              // Filter by search
              const filtered = uniqueAsalUsul.filter(au => 
                au.toLowerCase().includes(asalUsulSearch.toLowerCase())
              );

              // Pagination
              const totalPages = Math.ceil(filtered.length / itemsPerPage);
              const startIndex = (asalUsulPage - 1) * itemsPerPage;
              const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

              if (paginatedItems.length === 0) {
                return (
                  <div className="text-center py-8 text-slate-500">
                    Tidak ada data asal usul
                  </div>
                );
              }

              return (
                <>
                  {paginatedItems.map((asalUsul, index) => (
                    <div
                      key={index}
                      className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => {
                        handleChange('asal_usul', asalUsul);
                        setShowAsalUsulDialog(false);
                      }}
                    >
                      <p className="text-sm text-slate-700">{asalUsul}</p>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAsalUsulPage(prev => Math.max(1, prev - 1))}
                        disabled={asalUsulPage === 1}
                      >
                        Sebelumnya
                      </Button>
                      <span className="text-sm text-slate-600">
                        Halaman {asalUsulPage} dari {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAsalUsulPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={asalUsulPage === totalPages}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}