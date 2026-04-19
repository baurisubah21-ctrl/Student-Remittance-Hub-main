import { motion } from 'framer-motion';
import { ArrowRight, Zap, Globe, ShieldCheck, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="pt-24 pb-12 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 mt-10 md:mt-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel w-max text-sm font-medium text-[--color-primary]">
            <Zap size={16} /> Instant Stellar Network Settlements
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Pay University Fees <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[--color-primary] to-purple-600">
              Without Borders.
            </span>
          </h1>
          <p className="text-lg text-[--color-text-muted] max-w-xl">
            Send money across borders using stablecoins and pay your tuition fees directly instantly, avoiding high bank charges and long delays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to="/signup" className="btn-primary px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2">
              Start Sending <ArrowRight size={20} />
            </Link>
            <Link to="/universities" className="px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 border-2 border-[--color-border] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <Landmark size={20} /> Browse Universities
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 w-full max-w-md relative"
        >
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[--color-primary] rounded-full blur-[100px] opacity-30"></div>
          
          <div className="glass-panel rounded-3xl p-8 relative z-10 w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="font-semibold text-lg text-[--color-text-muted]">Exchange Rate</div>
              <div className="text-sm px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">Real-time</div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 border border-[--color-border]">
                <div className="text-sm text-[--color-text-muted] mb-1">You send</div>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-bold">5,000.00</div>
                  <div className="flex items-center gap-2 font-medium text-lg">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">🇮🇳</span> INR
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center -my-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[--color-primary] text-white flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
                  <ArrowRight size={20} className="rotate-90" />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 border border-[--color-border]">
                <div className="text-sm text-[--color-text-muted] mb-1">University receives</div>
                <div className="flex justify-between items-end">
                  <div className="text-3xl font-bold">59.85</div>
                  <div className="flex items-center gap-2 font-medium text-lg">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">$</span> USDC
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between text-sm text-[--color-text-muted]">
              <span>Fee</span>
              <span className="font-medium text-[--color-text]">0.01 USDC</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-[--color-text-muted]">
              <span>Settlement</span>
              <span className="font-medium text-green-500">~ 3 seconds</span>
            </div>
            
            <button className="w-full btn-primary py-4 rounded-xl mt-8 font-bold text-lg">
              Send Now
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-32 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why choose EduPay?</h2>
          <p className="text-[--color-text-muted] max-w-2xl mx-auto">Traditional banks take days and charge up to 5% in hidden fees. We use Stellar blockchain to make it instant and near-free.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap size={32} className="text-[#0052FF]" />, title: "Instant Settlement", desc: "Transactions settle in 3-5 seconds on the Stellar network." },
            { icon: <ShieldCheck size={32} className="text-[#0052FF]" />, title: "Secure & Compliant", desc: "Verifiable on-chain transactions ensuring the university receives the exact amount." },
            { icon: <Globe size={32} className="text-[#0052FF]" />, title: "Global Stablecoins", desc: "Send in your local currency, auto-converted to USDC for stability." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 rounded-2xl flex flex-col items-start gap-4"
            >
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-[--color-text-muted] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
