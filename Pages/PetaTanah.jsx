import React from 'react';
import TanahMap from '@/Components/maps/TanahMap';
import { useLocation } from 'react-router-dom';
import { useTanahList, useCurrentUser } from '@/lib/utilsUser';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';

import { ArrowLeft } from 'lucide-react';

export default function PetaTanah() {
  const location = useLocation();
  const user = useCurrentUser();
  const { data: tanahList = [] } = useTanahList(user);
  // Ambil id dari query string
  const params = new URLSearchParams(location.search);
  const selectedId = params.get('id');
  let center = undefined;
  let zoom = 18;
  if (selectedId && tanahList.length > 0) {
    const selected = tanahList.find(t => String(t.id) === String(selectedId));
    if (selected && selected.latitude && selected.longitude) {
      center = [Number(selected.latitude), Number(selected.longitude)];
    }
  }

  
  return (


    <div className="space-y-6 relative">
      <div className="flex items-center gap-4">
       
        <Link to={createPageUrl('DataTanah')}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4 text-white" />
          </Button>
        </Link>
        <span className="text-md font-semibold text-white">Ke Data Tanah</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="w-4 h-4 border-2 border-white rounded-full bg-blue-500 inline-block"></span>
          <span className="text-xs text-white">Proses</span>
          <span className="w-4 h-4 border-2 border-white rounded-full bg-yellow-500 inline-block"></span>
          <span className="text-xs text-white">Selesai</span>
          <span className="w-4 h-4 border-2 border-white rounded-full bg-red-500 inline-block"></span>
          <span className="text-xs text-white">Ditolak</span>
          {/* Tambahkan status lain sesuai kebutuhan */}
        </div>
      </div>

      {/* ...UI dan komponen lain tetap... */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        
          <Suspense fallback={<div>Memuat peta...</div>}>
            <TanahMap center={center} zoom={center ? zoom : 10} />
          </Suspense>
        
      </motion.div>
      {/* ...legend dan lain-lain tetap... */}
    </div>
  );
}