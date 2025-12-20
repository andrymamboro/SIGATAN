import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/db';
import { Map, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUser } from '../api/authUser';

// UI Components
const Card = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`} {...props}>
    {children}
  </div>
));
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props}>
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`} {...props}>
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-muted-foreground ${className || ''}`} {...props}>
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
));
CardContent.displayName = "CardContent";

const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    {...props}
  />
));
Input.displayName = "Input";

const Button = forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className || ''}`}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = "Button";

const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
    {...props}
  />
));
Label.displayName = "Label";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login ke Supabase Auth dan cek user gabungan
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Username dan password harus diisi');
      return;
    }
    setLoading(true);
    try {
      // Cek apakah input username berupa email atau username
      let email = username;
      if (!username.includes('@')) {
        // Cari email dari tabel users jika input bukan email
        const { data: userDb, error: userDbError } = await supabase
          .from('users')
          .select('email')
          .or(`username.eq.${username},no_hp.eq.${username}`)
          .single();
        if (userDbError || !userDb) {
          toast.error('Username/email tidak ditemukan');
          setLoading(false);
          return;
        }
        email = userDb.email;
      }
      // Login ke Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (authError) {
        toast.error('Login gagal: ' + authError.message);
        setLoading(false);
        return;
      }
      // Ambil user gabungan
      const userGabungan = await getCurrentUser();
      if (!userGabungan) {
        toast.error('User tidak ditemukan di database');
        setLoading(false);
        return;
      }
      localStorage.setItem('user', JSON.stringify(userGabungan));
      toast.success('Login berhasil!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center" >
            <img 
              src="/Components/img/logo app.png" 
              alt="Logo SIGATAN" 
              className="w-40 h-40 object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg" style={{ marginTop: '-10px' }}>
            SIGATAN
          </h1>
          <p className="text-blue-100 text-lg">
            Sistem Informasi Geospasial Pertanahan
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-6 pt-8">
            <CardTitle className="text-2xl text-center text-slate-800 font-bold">Selamat Datang</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Silakan masuk dengan akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 font-semibold">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-blue-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-blue-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              <p className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Login aman dan terenkripsi
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          <p>&copy; 2025 andrimamboro web development. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
