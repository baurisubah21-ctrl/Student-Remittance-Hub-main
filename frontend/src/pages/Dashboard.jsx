import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Search } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('history');

  const transactions = [
    { id: 'tx_123', univ: 'Stanford University', date: 'Oct 24, 2026', amount: '25,000.00 USDC', status: 'completed' },
    { id: 'tx_124', univ: 'MIT', date: 'Sep 12, 2026', amount: '12,500.00 USDC', status: 'completed' },
    { id: 'tx_125', univ: 'Harvard University', date: 'Aug 05, 2026', amount: '5,000.00 USDC', status: 'failed' },
  ];

  return (
    <div className="pt-24 pb-12 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Student</h1>
          <p className="text-[--color-text-muted]">Manage your university payments and track status.</p>
        </div>
        <Link to="/send" className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
          <ArrowUpRight size={20} /> New Payment
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#0052FF] to-purple-600 text-white border-0 shadow-lg shadow-blue-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-50"><Wallet size={64} /></div>
          <div className="relative z-10">
            <h3 className="text-white/80 font-medium mb-1">Stellar Wallet Balance</h3>
            <div className="text-4xl font-bold mb-4">450.50 <span className="text-xl">USDC</span></div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm font-mono tracking-wider">GBL7...9XOP</span>
              <button className="hover:text-blue-200 transition-colors">Copy</button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="text-[--color-text-muted] font-medium flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" /> Total Paid
          </div>
          <div className="text-3xl font-bold">37,500.00 <span className="text-lg text-[--color-text-muted]">USDC</span></div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="text-[--color-text-muted] font-medium flex items-center gap-2">
            <Clock size={18} className="text-orange-500" /> Pending Transfers
          </div>
          <div className="text-3xl font-bold">0 <span className="text-lg text-[--color-text-muted]">payments</span></div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="border-b border-[--color-border] p-4 flex gap-6">
          <button 
            className={`font-medium pb-2 ${activeTab === 'history' ? 'text-[--color-primary] border-b-2 border-[--color-primary]' : 'text-[--color-text-muted]'}`}
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </button>
          <button 
            className={`font-medium pb-2 ${activeTab === 'wallet' ? 'text-[--color-primary] border-b-2 border-[--color-primary]' : 'text-[--color-text-muted]'}`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet Connect
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="p-0">
            <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-slate-800 border-b border-[--color-border]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search transactions..." className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[--color-border] focus:outline-none focus:ring-2 focus:ring-[--color-primary] text-sm" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-800 text-[--color-text-muted] text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Institution</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]">
                  {transactions.map((tx, i) => (
                    <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{tx.univ}</td>
                      <td className="px-6 py-4 text-[--color-text-muted]">{tx.date}</td>
                      <td className="px-6 py-4 font-bold">{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[--color-primary] font-medium text-sm hover:underline">Receipt</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <Wallet size={48} className="text-[--color-primary] mb-4" />
            <h3 className="text-xl font-bold mb-2">Connect Freighter Wallet</h3>
            <p className="text-[--color-text-muted] mb-6 max-w-md">Connect your Stellar wallet to send payments directly from your own custody. We recommend Freighter for the best experience.</p>
            <button className="btn-primary px-8 py-3 rounded-xl font-bold">Connect Wallet</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
