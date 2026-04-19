import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, Wallet } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[--color-primary] to-purple-600">
          <Globe className="text-[--color-primary]" size={28} />
          <span>EduPay</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="font-medium hover:text-[--color-primary] transition-colors">How it works</Link>
          <Link to="/universities" className="font-medium hover:text-[--color-primary] transition-colors">Universities</Link>
          <Link to="/login" className="font-medium hover:text-[--color-primary] transition-colors">Sign In</Link>
          <Link to="/signup" className="btn-primary px-6 py-2 rounded-full font-medium flex items-center gap-2">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[--color-text]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full glass-panel shadow-lg py-4 flex flex-col items-center gap-4"
        >
          <Link to="/about" className="text-lg font-medium w-full text-center py-2" onClick={() => setIsOpen(false)}>How it works</Link>
          <Link to="/universities" className="text-lg font-medium w-full text-center py-2" onClick={() => setIsOpen(false)}>Universities</Link>
          <Link to="/login" className="text-lg font-medium w-full text-center py-2" onClick={() => setIsOpen(false)}>Sign In</Link>
          <Link to="/signup" className="btn-primary px-8 py-3 rounded-full font-medium w-max" onClick={() => setIsOpen(false)}>
            Get Started
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
