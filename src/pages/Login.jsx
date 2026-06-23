import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Tractor, ArrowRight, FlaskConical } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Login() {
  const [role, setRole] = useState('admin'); // 'admin' | 'researcher'
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col relative font-sans overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>
      
      {/* Accent Top Border */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 absolute top-0 z-10"></div>
      {/* Blue Side Borders (from screenshot) */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-indigo-500/80 z-10"></div>
      <div className="absolute inset-y-0 right-0 w-1.5 bg-indigo-500/80 z-10"></div>
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-indigo-500/80 z-10"></div>

      <div className="flex-1 flex items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-[420px] bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] pt-12 pb-6 px-10 relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#022c22] tracking-tight mb-2">MOOSense</h1>
            <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Precision Intelligence</p>
          </div>
          
          <div className="w-16 h-px bg-gray-200 mx-auto mb-8"></div>

          {/* Form Content */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-1">System Access</h2>
            <p className="text-sm text-gray-500 mb-6">Select your operational role to continue.</p>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={cn(
                  "flex flex-col items-center justify-center p-3 border transition-all duration-200",
                  role === 'admin' 
                    ? "border-[#064e3b] bg-green-50/30 text-[#064e3b] shadow-sm" 
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <ShieldCheck className="w-5 h-5 mb-2" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Admin</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('researcher')}
                className={cn(
                  "flex flex-col items-center justify-center p-3 border transition-all duration-200",
                  role === 'researcher' 
                    ? "border-[#064e3b] bg-green-50/30 text-[#064e3b] shadow-sm" 
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <Tractor className="w-5 h-5 mb-2" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Farmer</span>
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Operator ID / Email
                </label>
                <input 
                  type="text" 
                  placeholder="Enter credentials"
                  className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Access Key
                </label>
                <input 
                  type="password" 
                  placeholder="Enter password"
                  className="w-full border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded-sm border-gray-300 text-[#064e3b] focus:ring-[#064e3b]" />
                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Maintain session</span>
                </label>
                
                <a href="#" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-wider transition-colors">
                  Reset Key
                </a>
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-[#022c22] hover:bg-[#064e3b] text-white font-medium py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-200"
              >
                Authenticate
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="w-full h-px bg-gray-100 my-6"></div>

          {/* Card Footer */}
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <FlaskConical className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-[10px] font-bold tracking-widest uppercase">IIT ROPAR</span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="bg-[#ebebeb] border-t border-gray-200 py-6 px-8 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold text-gray-400 tracking-tight">MOOSense</div>
          <div className="text-[10px] font-medium text-gray-500 max-w-sm text-center sm:text-right uppercase tracking-wider leading-relaxed">
            © 2024 MOOSense Industrial AgTech. Precision Intelligence for Livestock Management.
          </div>
        </div>
      </div>
    </div>
  );
}