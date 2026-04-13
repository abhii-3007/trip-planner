import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GraduationCap, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate('/admin');
    } catch (err: any) {
      setServerError(
        err.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <GraduationCap size={22} className="text-primary" />
            </div>
            <span className="font-heading font-bold text-white text-2xl">
              Trip<span className="text-accent">Edu</span>
            </span>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl mb-4 leading-tight">
            Welcome to the<br />Admin Portal
          </h2>
          <p className="text-white/65 text-base leading-relaxed">
            Manage trips, track registrations, and keep student records organized — all in one secure dashboard.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Manage & publish academic trips',
              'Track student registrations & payments',
              'Export student data as needed',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/80 text-sm">{feat}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/30 text-xs">
          © {new Date().getFullYear()} TripEdu · Greenfield University
        </p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="font-heading font-bold text-primary text-xl">
                Trip<span className="text-accent">Edu</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="font-heading font-bold text-primary text-2xl mb-1">Sign in</h1>
              <p className="text-gray-500 text-sm">Enter your admin credentials to continue.</p>
            </div>

            {serverError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 mb-5">
                <AlertCircle size={16} className="flex-shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <input
                  {...register('email')}
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  placeholder="admin@greenfield.edu"
                />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className="form-label">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="form-input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-3 mt-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Default credentials:{' '}
                <span className="text-gray-600 font-medium">admin@greenfield.edu / admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
