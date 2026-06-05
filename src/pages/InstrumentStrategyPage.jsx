import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { Search, Settings2, Plus, Zap } from 'lucide-react';

const InstrumentStrategyPage = () => {
  const { instrumentStrategies, setInstrumentStrategies } = useData();
  const [gridApi, setGridApi] = useState(null);
  const [instrumentCode, setInstrumentCode] = useState('');
  const [filteredStrategies, setFilteredStrategies] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!instrumentCode.trim()) {
      setFilteredStrategies(instrumentStrategies);
    } else {
      setFilteredStrategies(instrumentStrategies.filter(s => s.code.toLowerCase().includes(instrumentCode.toLowerCase())));
    }
  };

  const columnDefs = useMemo(() => [
    { field: 'code', headerName: 'Instrument Code', editable: true, width: 150, rowGroup: true, hide: true },
    { field: 'type', headerName: 'Strategy Type', editable: true, width: 150, cellEditor: 'agSelectCellEditor', cellEditorParams: { values: ['SM', 'PM'] }, rowGroup: true, hide: true },
    { field: 'action', headerName: 'Maintenance Action', editable: true, flex: 1 },
    { field: 'frequency', headerName: 'Frequency', editable: true, width: 200 }
  ], []);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  const autoGroupColumnDef = useMemo(() => ({
    headerName: 'Strategy Grouping',
    minWidth: 250,
    cellRendererParams: { suppressCount: false }
  }), []);

  const onCellValueChanged = (params) => {
    const updated = [...instrumentStrategies];
    const index = updated.findIndex(s => s.id === params.data.id);
    if (index >= 0) {
      updated[index] = params.data;
    } else {
      updated.push(params.data);
    }
    setInstrumentStrategies(updated);
  };

  const addNewRow = () => {
    const newStrategy = {
      id: `IS-${Date.now()}`,
      code: instrumentCode || '',
      type: 'SM',
      action: '',
      frequency: ''
    };
    const updated = [newStrategy, ...instrumentStrategies];
    setInstrumentStrategies(updated);
    setFilteredStrategies(instrumentCode ? updated.filter(s => s.code.toLowerCase().includes(instrumentCode.toLowerCase())) : updated);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="bg-slate-50 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <Zap className="text-purple-400 w-5 h-5" />
              </div>
              Instrument Strategy
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">
              Define SM & PM actions for Instruments
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Instrument Code</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={instrumentCode}
                onChange={(e) => setInstrumentCode(e.target.value)}
                placeholder="Enter Instrument Code..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 self-end">
            <button type="submit" className="bg-[#0a192f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-slate-800 transition-all">
              Load Data
            </button>
            <button type="button" onClick={addNewRow} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-purple-500 transition-all">
              <Plus size={16} /> Add Action
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 ag-theme-quartz shadow-xl border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={filteredStrategies.length > 0 || instrumentCode ? filteredStrategies : instrumentStrategies}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDisplayType="groupRows"
          onGridReady={(params) => setGridApi(params.api)}
          onCellValueChanged={onCellValueChanged}
          rowHeight={40}
          headerHeight={44}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default InstrumentStrategyPage;
