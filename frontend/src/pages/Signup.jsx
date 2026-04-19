import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Signup = () => {
  return (
    <div className="pt-24 pb-12 w-full max-w-md mx-auto flex flex-col items-center">
      <div className="w-full glass-panel p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-[--color-text-muted] text-center mb-8">Join thousands of international students.</p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-[--color-primary]" required />
            </div>
          </div>

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
          </div>

          <Link to="/dashboard" className="w-full btn-primary py-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center gap-2">
            Create Account <ArrowRight size={20} />
          </Link>
          
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-[--color-border]"></div>
            <span className="flex-shrink-0 mx-4 text-[--color-text-muted] text-sm">Or sign in with</span>
            <div className="flex-grow border-t border-[--color-border]"></div>
          </div>

          <button type="button" className="w-full bg-[#000000] dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <img src="https://freighter.app/favicons/favicon-32x32.png" alt="Freighter" className="w-5 h-5 rounded-full" />
              Connect Freighter
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[--color-text-muted]">
          Already have an account? <Link to="/login" className="text-[--color-primary] font-bold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
