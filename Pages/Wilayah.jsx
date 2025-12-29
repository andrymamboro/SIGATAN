import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../api/db';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function Wilayah() {
  const [wilayah, setWilayah] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
    // ...existing code...
    const filteredWilayah = wilayah.filter(w =>
      w.kecamatan?.toLowerCase().includes(search.toLowerCase()) ||
      w.kelurahan?.toLowerCase().includes(search.toLowerCase()) ||
      (w.kode_wilayah || '').toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredWilayah.length / rowsPerPage) || 1;
    const pagedWilayah = filteredWilayah.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    kecamatan: '',
    kelurahan: '',
    kode_wilayah: '',
    alamat_kantor_kecamatan: '',
    alamat_kantor_kelurahan: ''
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
    // ...existing code...
    const handleDelete = async (id) => {
      if (!window.confirm('Yakin ingin menghapus data wilayah ini?')) return;
      const { error } = await supabase.from('wilayah').delete().eq('id', id);
      if (!error) {
        setWilayah(wilayah.filter(w => w.id !== id));
        setDeleteId(null);
      } else {
        alert('Gagal hapus: ' + error.message);
      }
    };
  // ...existing code...
  useEffect(() => {
    if (!showModal) {
      setForm({ kecamatan: '', kelurahan: '', kode_wilayah: '' });
      setEditData(null);
    } else if (editData) {
      setForm({
        kecamatan: editData.kecamatan || '',
        kelurahan: editData.kelurahan || '',
        kode_wilayah: editData.kode_wilayah || '',
        alamat_kantor_kecamatan: editData.alamat_kantor_kecamatan || '',
        alamat_kantor_kelurahan: editData.alamat_kantor_kelurahan || ''
      });
    }
  }, [showModal, editData]);
  // ...existing code...
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editData) {
      // Update
      const { error } = await supabase.from('wilayah').update(form).eq('id', editData.id);
      if (!error) {
        setWilayah(wilayah.map(w => w.id === editData.id ? { ...w, ...form } : w));
        setShowModal(false);
      } else {
        alert('Gagal update: ' + error.message);
      }
    } else {
      // Insert
      const { data, error } = await supabase.from('wilayah').insert([form]).select();
      if (!error && data && data[0]) {
        setWilayah([...wilayah, data[0]]);
        setShowModal(false);
      } else {
        alert('Gagal tambah: ' + (error?.message || ''));
      }
    }
    setSaving(false);
  };

  useEffect(() => {
    const fetchWilayah = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('wilayah').select('*').order('kecamatan', { ascending: true });
      if (error) setError(error.message);
      else setWilayah(data || []);
      setLoading(false);
    };
    fetchWilayah();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Data Wilayah</h1>
      {loading && <p>Memuat data wilayah...</p>}
      {error && <p className="text-red-500">Gagal memuat data: {error}</p>}
      {!loading && !error && (
        <>
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <Button onClick={() => setShowModal(true)} className="bg-blue-600">Tambah Wilayah</Button>
            <div className="flex-1 flex justify-end">
              <Input
                type="text"
                placeholder="Cari kecamatan, kelurahan, kode..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full md:w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-300 bg-white">
              <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white">
                <tr>
                  <th className="px-4 py-2 border">No</th>
                  <th className="px-4 py-2 border">Kecamatan</th>
                  <th className="px-4 py-2 border">Kelurahan</th>
                  <th className="px-4 py-2 border">Kode Wilayah</th>
                  <th className="px-4 py-2 border">Alamat Kantor Kecamatan</th>
                  <th className="px-4 py-2 border">Alamat Kantor Kelurahan</th>
                  <th className="px-4 py-2 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pagedWilayah.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-slate-400">Tidak ada data</td></tr>
                ) : pagedWilayah.map((w, i) => (
                  <tr key={w.id || i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 border text-center">{(page - 1) * rowsPerPage + i + 1}</td>
                    <td className="px-4 py-2 border">{w.kecamatan}</td>
                    <td className="px-4 py-2 border">{w.kelurahan}</td>
                    <td className="px-4 py-2 border">{w.kode_wilayah || '-'}</td>
                    <td className="px-4 py-2 border">{w.alamat_kantor_kecamatan || '-'}</td>
                    <td className="px-4 py-2 border">{w.alamat_kantor_kelurahan || '-'}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="icon" variant="ghost" onClick={() => { setEditData(w); setShowModal(true); }} aria-label="Edit">
                          <Pencil className="w-5 h-5 text-blue-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(w.id)} aria-label="Delete">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-white">Halaman {page} dari {totalPages}</span>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="bg-blue-500" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Sebelumnya">
                <ChevronLeft className="w-5 h-5 text-white" />
              </Button>
              <Button size="icon" variant="outline" className="bg-blue-500"  onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Berikutnya">
                <ChevronRight className="w-5 h-5 text-white " />
              </Button>
            </div>
          </div>

          {/* Modal Tambah/Edit */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-md bg-gray-100">
              <DialogHeader>
                <DialogTitle>{editData ? 'Edit Wilayah' : 'Tambah Wilayah'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Kecamatan</label>
                  <Input value={form.kecamatan} onChange={e => setForm({ ...form, kecamatan: e.target.value })} required autoFocus disabled={!(window?.user?.role !== 'super_admin')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kelurahan</label>
                  <Input value={form.kelurahan} onChange={e => setForm({ ...form, kelurahan: e.target.value })} required disabled={!(window?.user?.role !== 'super_admin')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kode Wilayah</label>
                  <Input value={form.kode_wilayah} onChange={e => setForm({ ...form, kode_wilayah: e.target.value })} required disabled={!(window?.user?.role !== 'super_admin')} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-900 font-weight-bold">Alamat Kantor Kecamatan {form.kecamatan}</label>
                  <Input value={form.alamat_kantor_kecamatan} onChange={e => setForm({ ...form, alamat_kantor_kecamatan: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-900 font-weight-bold">Alamat Kantor Kelurahan {form.kelurahan}</label>
                  <Input value={form.alamat_kantor_kelurahan} onChange={e => setForm({ ...form, alamat_kantor_kelurahan: e.target.value })} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                  <Button type="submit" className="bg-blue-600" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
