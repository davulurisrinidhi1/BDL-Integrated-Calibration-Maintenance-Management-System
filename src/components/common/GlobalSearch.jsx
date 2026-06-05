import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext.jsx';
import { Search, X, FileText, Gauge, ClipboardList, Hash } from 'lucide-react';

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const { entries, materialCodes, certificates } = useData();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();
  const results = [];

  if (q.length >= 2) {
    // Material codes
    materialCodes.filter(m => m.code.toLowerCase().includes(q) || m.type.toLowerCase().includes(q))
      .slice(0, 5).forEach(m => results.push({ category: 'Material Codes', label: `${m.code} — ${m.type}`, icon: Gauge, path: `/materials/${m.code}` }));

    // Calibration entries
    entries.filter(e => (e.gaugeNo || '').toLowerCase().includes(q) || (e.materialCode || '').toLowerCase().includes(q) || (e.type || '').toLowerCase().includes(q))
      .slice(0, 5).forEach(e => results.push({ category: 'Calibration Entries', label: `${e.gaugeNo || e.id} — ${e.type}`, icon: ClipboardList, path: '/calibration' }));

    // Certificates
    certificates.filter(c => c.id.toLowerCase().includes(q) || (c.materialCode || '').toLowerCase().includes(q))
      .slice(0, 5).forEach(c => results.push({ category: 'Certificates', label: `${c.id} — ${c.materialCode}`, icon: FileText, path: '/certificates' }));
  }

  const grouped = {};
  results.forEach(r => { if (!grouped[r.category]) grouped[r.category] = []; grouped[r.category].push(r); });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120 }} onClick={onClose}>
      <div style={{ width: 520, background: '#fff', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', gap: 10 }}>
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input
            ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search material codes, gauges, certificates..."
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0f172a', background: 'transparent' }}
          />
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {q.length < 2 && <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Type at least 2 characters to search</div>}
          {q.length >= 2 && results.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No results found</div>}
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc' }}>{cat}</div>
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} onClick={() => { navigate(item.path); onClose(); }}
                    style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155', borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Icon size={16} style={{ color: '#94a3b8' }} />{item.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 12, fontSize: 11, color: '#94a3b8' }}>
          <span><kbd style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: 3 }}>↵</kbd> select</span>
          <span><kbd style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: 3 }}>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
