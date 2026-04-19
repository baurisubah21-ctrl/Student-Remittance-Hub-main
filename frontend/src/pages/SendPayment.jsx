import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Landmark, Send, Info, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const SendPayment = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [university, setUniversity] = useState('');
  
  return (
    <div className="pt-24 pb-12 w-full max-w-2xl mx-auto">
      <Link to="/dashboard" className="flex items-center gap-2 text-[--color-text-muted] hover:text-[--color-primary] transition-colors mb-6 font-medium w-max">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-[--color-primary]"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">Send Tuition Payment</h1>
        <p className="text-[--color-text-muted] mb-8">Fast, secure and low-cost cross-border payments.</p>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Institution</label>
                <div className="relative">
                  <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    className="w-full pl-12 pr-10 py-4 rounded-xl glass-panel border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-[--color-primary] appearance-none cursor-pointer"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  >
                    <option value="" disabled>Choose university...</option>
                    <option value="stanford">Stanford University</option>
                    <option value="mit">MIT</option>
                    <option value="harvard">Harvard University</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Student ID Reference</label>
                <input 
                  type="text" 
                  placeholder="e.g. STU-2026-890" 
                  className="w-full px-4 py-4 rounded-xl bg-transparent border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!university}
                className="w-full btn-primary py-4 rounded-xl font-bold text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-[--color-border]">
                <label className="block text-sm font-medium mb-4 text-[--color-text-muted]">Amount to Pay (Local Currency)</label>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-5xl font-bold bg-transparent focus:outline-none"
                  />
                  <div className="flex bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-[--color-border] shadow-sm font-medium">
                    INR
                  </div>
                </div>
              </div>

              <div className="pl-6 border-l-2 border-gray-200 dark:border-slate-700 space-y-4 py-2 text-sm text-[--color-text-muted]">
                <div className="flex justify-between">
                  <span>Current Exchange Rate</span>
                  <span className="font-medium text-[--color-text]">1 USDC = 83.50 INR</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Fee</span>
                  <span className="font-medium text-[--color-text]">0.00001 XLM (negligible)</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                 <label className="block text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">University Receives</label>
                 <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {(Number(amount) / 83.5).toFixed(2)}
                    </span>
                    <span className="font-bold bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-md">USDC</span>
                 </div>
              </div>

              <button 
                onClick={() => setStep(3)}
                disabled={!amount || Number(amount) <= 0}
                className="w-full btn-primary py-4 rounded-xl font-bold text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Payment
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
                <Send size={32} className="text-[#0052FF]" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Confirm Payment</h2>
              <p className="text-[--color-text-muted]">Please review details before signing with your wallet.</p>
            </div>

            <div className="glass-panel border border-[--color-border] rounded-2xl p-6 space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-[--color-border] last:border-0 relative">
                <span className="text-[--color-text-muted]">To</span>
                <span className="font-semibold text-right">Stanford University <br/><span className="text-xs font-mono text-gray-400">GABC...XYZ1</span></span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[--color-border] last:border-0 relative">
                <span className="text-[--color-text-muted]">Amount</span>
                <span className="font-semibold">{(Number(amount) / 83.5).toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[--color-border] last:border-0 relative">
                <span className="text-[--color-text-muted]">Total Deducted</span>
                <span className="font-semibold">{Number(amount).toLocaleString()} INR</span>
              </div>
            </div>

            <button className="w-full bg-[#000000] dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <img src="https://freighter.app/favicons/favicon-32x32.png" alt="Freighter" className="w-5 h-5 rounded-full" />
              Sign with Freighter
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SendPayment;
