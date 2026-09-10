import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/Toast';
import { getErrorMessage } from '../../services/api';
import { Lock } from 'lucide-react';
import { UserIcon3D } from '../../components/icons/Icons3D';
import curioLogo from '../../assets/curio-logo.png';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, tenantName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const storeName = tenantName || 'Curio';
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({ username, password });
      // Redirect based on role or original destination
      if (from) {
        navigate(from, { replace: true });
      } else if (response.role === 'staff' || response.role === 'store_owner') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <UserIcon3D className="w-16 h-16" />
          </div>
          <Link to="/" className="inline-flex justify-center group" aria-label="Curio Home">
            <img
              src={curioLogo}
              alt="Curio"
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <h2 className="text-xl font-semibold text-[#111111]">Sign in to your account</h2>
          <p className="text-xs text-[#6F6F6B]">
            Access your order history, store catalog, and management dashboard.
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 border border-[#E7E7E3] rounded-3xl shadow-xs space-y-6">
          {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              required
              placeholder="e.g. john_customer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              <Lock className="w-4 h-4 mr-1.5" />
              Sign In
            </Button>
          </form>

          <div className="pt-4 border-t border-[#E7E7E3] text-center text-xs text-[#6F6F6B]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-[#111111] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
