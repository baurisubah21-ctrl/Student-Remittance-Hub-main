import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  return (
    <div className="pt-32 pb-12 w-full max-w-md mx-auto flex flex-col items-center">
      <div className="w-full glass-panel p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-[--color-text-muted] text-center mb-8">Sign in to manage your tuition payments.</p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="email" placeholder="student@example.com" className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-[--color-primary]" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-[--color-primary]" required />
            </div>
            <div className="flex justify-end mt-2">
              <a href="#" className="text-sm font-medium text-[--color-primary] hover:underline">Forgot password?</a>
            </div>
          </div>

          <Link to="/dashboard" className="w-full btn-primary py-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center gap-2">
            Sign In <ArrowRight size={20} />
          </Link>
        </form>

        <div className="mt-8 text-center text-sm text-[--color-text-muted]">
          Don't have an account? <Link to="/signup" className="text-[--color-primary] font-bold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
