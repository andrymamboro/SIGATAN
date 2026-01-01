import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Components/ui/card';



const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    {...props}
  />
));
Input.displayName = "Input";

const Button = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className || ''}`}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = "Button";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
    {...props}
  />
));
Label.displayName = "Label";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/db';
import { Map, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUser } from '../api/authUser';



export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      <Card className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center relative z-10 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 shadow-2xl border-0 backdrop-blur-sm p-0 md:p-8">
        {/* Left: Logo and Title */}
        <div className="flex flex-col items-center justify-center md:w-1/2 w-full mb-8 md:mb-0 md:pr-8 text-white text-center">
          <img 
            src={`${import.meta.env.BASE_URL}img/logo_app.png`}
            alt="Logo SIGATAN" 
            className="w-56 h-56 object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] mx-auto"
          />
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] mt-4 md:mt-6">SIGATAN</h1>
          <p className="text-purple-100 text-lg md:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">Sistem Informasi Geospasial Pertanahan</p>
        </div>

        {/* Right: Login Card */}
        <div className="w-full md:w-1/2 max-w-md text-white border-l md:border-l-1 md:pl-8">
          <Card className="border-0 shadow-none bg-transparent p-0">
            <CardHeader className="space-y-1 pb-6 pt-8">
              <CardTitle className="text-2xl text-center font-bold text-white">Selamat Datang</CardTitle>
              <CardDescription className="text-center text-white">
                Silakan masuk dengan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-semibold text-white">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-blue-500" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-semibold text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-blue-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-white"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3.5 h-5 w-5 text-blue-500 focus:outline-none"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.907-4.568M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.96 9.96 0 01-4.338 5.223M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className=" mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      <span className="text-white">Masuk</span>
                    )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="flex items-center justify-center gap-2 text-white">
                  <Lock className="w-4 h-4 text-white" />
                  Login aman dan terenkripsi
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm">
            <p>&copy; 2025 andrimamboro web development. All rights reserved.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
