import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Loader2, 
  Info,
  ChevronRight,
  Factory
} from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!employeeId || !password) {
      toast.error('Please enter both Employee ID and Password');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network delay for industrial feel
    setTimeout(() => {
      const result = login(employeeId, password);
      
      if (result.success) {
        toast.success('Authentication Successful. Redirecting...');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Invalid credentials');
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleDemoLogin = (id, pass) => {
    setEmployeeId(id);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Left Side - Branding/Industrial Visual */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-[#0a192f] relative overflow-hidden items-center justify-center p-12">
        {/* Abstract Industrial Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] border-[40px] border-white rounded-full"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] border-[20px] border-blue-500 rounded-full"></div>
          <div className="grid grid-cols-12 h-full w-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-blue-300/20"></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/50">
              <Factory className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">BDL SMART</h1>
              <p className="text-blue-400 font-semibold tracking-[0.2em] text-sm uppercase">Calibration Management</p>
            </div>
          </div>
          
          <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Precision & <span className="text-blue-500">Traceability</span> in Every Measurement.
          </h2>
          
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Enterprise-grade validation system optimized for Bharat Dynamics Limited. 
            Streamlining metrology workflows with automated rule checking and SAP integration.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="text-blue-400 font-bold text-2xl mb-1">75%</div>
              <div className="text-slate-400 text-sm">Efficiency Increase</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl">
              <div className="text-blue-400 font-bold text-2xl mb-1">100%</div>
              <div className="text-slate-400 text-sm">Traceability Compliance</div>
            </div>
          </div>
        </div>
        
        {/* Footer info for BDL */}
        <div className="absolute bottom-8 left-12 text-slate-500 text-xs font-medium tracking-widest uppercase">
          Metrology Department | Secure Terminal Access
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 md:p-12 lg:p-24">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-3 mb-10">
             <div className="w-10 h-10 bg-[#0a192f] rounded flex items-center justify-center">
                <Factory className="text-white w-6 h-6" />
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-900">BDL SMART</h1>
                <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">Calibration System</p>
             </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Login</h2>
            <p className="text-slate-500 font-medium">Enter your credentials to access the secure portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2" htmlFor="employeeId">
                Employee ID / Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="employeeId"
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  placeholder="e.g. ADMIN001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-semibold text-slate-600 cursor-pointer">
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a192f] hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>SECURE LOGIN</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 mb-4 text-blue-800">
              <Info className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Demo Credentials</span>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleDemoLogin('ADMIN001', 'admin123')}
                className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg text-sm hover:border-blue-400 transition-colors group"
              >
                <div className="text-left">
                  <div className="font-bold text-slate-900">Admin</div>
                  <div className="text-xs text-slate-500">Full System Access</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => handleDemoLogin('CAL001', 'cal123')}
                className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg text-sm hover:border-blue-400 transition-colors group"
              >
                <div className="text-left">
                  <div className="font-bold text-slate-900">Calibration Operator</div>
                  <div className="text-xs text-slate-500">Entry & Certification</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => handleDemoLogin('QA001', 'qa123')}
                className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg text-sm hover:border-blue-400 transition-colors group"
              >
                <div className="text-left">
                  <div className="font-bold text-slate-900">Quality Inspector</div>
                  <div className="text-xs text-slate-500">Review & Approval</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="mt-12 text-center text-slate-400 text-xs font-medium">
             &copy; 2025 Bharat Dynamics Limited. All rights reserved.<br/>
             Authorized Personnel Only.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
