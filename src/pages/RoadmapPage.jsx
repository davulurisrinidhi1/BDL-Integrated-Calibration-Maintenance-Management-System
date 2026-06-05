import React from 'react';
import { 
  Map, 
  Zap, 
  Database, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  QrCode, 
  BarChart, 
  Globe,
  CheckCircle2,
  Clock,
  Rocket
} from 'lucide-react';

const RoadmapPage = () => {
  const sections = [
    {
      title: 'Current State (v1.0 Prototype)',
      status: 'In Production',
      color: 'blue',
      items: [
        { icon: Zap, label: 'Single-Page Calibration Workflow', desc: 'Rapid entry mode reducing processing time by 80%.' },
        { icon: ShieldCheck, label: 'AI Rule Validation', desc: 'Automated 12-point logic checking for measurements.' },
        { icon: Database, label: 'Standardized Traceability', desc: 'Full historical ledger with Front/Middle/End tracking.' },
        { icon: Globe, label: 'SAP-Ready Exports', desc: 'Excel integration compatible with enterprise ERP schemas.' }
      ]
    },
    {
      title: 'Phase 2: Enterprise Scaling',
      status: 'Q3-Q4 2026',
      color: 'indigo',
      items: [
        { icon: Database, label: 'Spring Boot & MySQL', desc: 'Migration from localStorage to high-concurrency production DB.' },
        { icon: Globe, label: 'SAP API Direct Connect', desc: 'Real-time synchronization with SAP PM and MM modules.' },
        { icon: ShieldCheck, label: 'AD / LDAP Authentication', desc: 'Enterprise-grade Single Sign-On for secure terminal access.' }
      ]
    },
    {
      title: 'Phase 3: Smart Factory Integration',
      status: '2027 Vision',
      color: 'emerald',
      items: [
        { icon: Cpu, label: 'Predictive AI Analytics', desc: 'Machine learning for wear-trend prediction and alert optimization.' },
        { icon: QrCode, label: 'Hardware Integration', desc: 'QR/Barcode scanning for instant instrument identification.' },
        { icon: Rocket, label: 'Automated Notifications', desc: 'Predictive maintenance alerts sent directly via MS Teams/Mail.' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-bold uppercase tracking-widest">
          <Map size={14} />
          Development Roadmap
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Future of Metrology</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Bharat Dynamics Limited Smart Calibration System strategic vision for digital transformation and industrial excellence.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative space-y-16 before:absolute before:left-4 md:before:left-1/2 before:top-0 before:bottom-0 before:w-[2px] before:bg-slate-200 before:hidden md:before:block">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className={`relative flex flex-col md:flex-row gap-8 items-start ${sIdx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
             {/* Dot */}
             <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10 hidden md:block"></div>
             
             {/* Content */}
             <div className="w-full md:w-[calc(50%-2rem)] space-y-6">
                <div className={`p-6 rounded-2xl border bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  section.color === 'blue' ? 'border-blue-100' : 
                  section.color === 'indigo' ? 'border-indigo-100' : 'border-emerald-100'
                }`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mt-2 inline-block ${
                         section.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                         section.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {section.status}
                      </span>
                    </div>
                    {section.color === 'blue' && <CheckCircle2 className="text-emerald-500" size={24} />}
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex gap-4 group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${
                           section.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                           section.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
         <div className="bg-[#0a192f] p-8 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            <TrendingUp className="text-blue-400 mx-auto" size={40} />
            <div className="text-4xl font-black text-white tracking-tighter">80%</div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Efficiency Increase</p>
            <p className="text-slate-400 text-[11px]">Workflow reduction from 15 minutes to 3 minutes per gauge.</p>
         </div>

         <div className="bg-[#0a192f] p-8 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            <ShieldCheck className="text-indigo-400 mx-auto" size={40} />
            <div className="text-4xl font-black text-white tracking-tighter">100%</div>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Digital Traceability</p>
            <p className="text-slate-400 text-[11px]">Elimination of manual transcription errors and logbook dependency.</p>
         </div>

         <div className="bg-[#0a192f] p-8 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            <BarChart className="text-emerald-400 mx-auto" size={40} />
            <div className="text-4xl font-black text-white tracking-tighter">0%</div>
            <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Missing Calibrations</p>
            <p className="text-slate-400 text-[11px]">Real-time alerting prevents overdue instrument usage on assembly lines.</p>
         </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
