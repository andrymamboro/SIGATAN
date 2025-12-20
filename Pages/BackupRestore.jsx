import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BackupRestore() {
  const [backupFilename, setBackupFilename] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    // Cek user dari localStorage, hanya admin yang boleh akses
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600 font-bold text-xl">
          Akses hanya untuk admin
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Backup & Restore Database</h1>
         <div className="flex gap-2 items-center mb-4">
           <Button
             type="button"
             variant="outline"
             className="border-green-600 text-green-600 hover:bg-green-50"
             onClick={() => {
               window.open(`/api/backup-db-pg.php`, '_blank');
             }}
           >
             Backup SQL (Postgres)
           </Button>
         </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const fileInput = e.target.elements.restorefile;
          if (!fileInput.files[0]) return;
          const formData = new FormData();
          formData.append('sqlfile', fileInput.files[0]);
          const res = await fetch('/api/restore-db-pg.php', { method: 'POST', body: formData });
          if (res.ok) {
            toast.success('Restore sukses!');
          } else {
            toast.error('Restore gagal!');
          }
        }}
        className="flex gap-2 items-center"
      >
        <input
          type="file"
          name="restorefile"
          accept=".sql"
          className="border px-2 py-1 rounded text-sm"
          style={{ minWidth: 180 }}
        />
        <Button type="submit" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
          Restore SQL (Postgres)
        </Button>
      </form>
    </div>
  );
}
