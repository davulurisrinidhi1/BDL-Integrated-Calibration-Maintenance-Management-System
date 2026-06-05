import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { Search, PenTool, Plus } from 'lucide-react';

const InstrumentTaskListPage = () => {
  const { instrumentTasks, setInstrumentTasks } = useData();
  const [gridApi, setGridApi] = useState(null);
  const [instrumentCode, setInstrumentCode] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!instrumentCode.trim()) {
      setFilteredTasks(instrumentTasks);
    } else {
      setFilteredTasks(instrumentTasks.filter(t => t.code.toLowerCase().includes(instrumentCode.toLowerCase())));
    }
  };

  const columnDefs = useMemo(() => [
    { field: 'code', headerName: 'Instrument Code', editable: true, width: 150 },
    { field: 'stc', headerName: 'STC', editable: true, width: 100 },
    { field: 'group', headerName: 'Group', editable: true, width: 120 },
    { field: 'ctr', headerName: 'CTR', editable: true, width: 100 },
    { field: 'description', headerName: 'TL Description', editable: true, flex: 1, minWidth: 200 },
    { field: 'pht', headerName: 'PHT', editable: true, width: 100 },
    { field: 'det', headerName: 'DET', editable: true, width: 100 },
    { 
      field: 'strategy', 
      headerName: 'Strategy', 
      editable: true, 
      width: 120,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['SM', 'PM'] }
    }
  ], []);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  const onCellValueChanged = (params) => {
    const updatedTasks = [...instrumentTasks];
    const index = updatedTasks.findIndex(t => t.id === params.data.id);
    if (index >= 0) {
      updatedTasks[index] = params.data;
    } else {
      updatedTasks.push(params.data);
    }
    setInstrumentTasks(updatedTasks);
  };

  const addNewRow = () => {
    const newTask = {
      id: `IT-${Date.now()}`,
      code: instrumentCode || '',
      stc: '',
      group: '',
      ctr: '',
      description: '',
      pht: '',
      det: '',
      strategy: 'SM'
    };
    const updatedTasks = [newTask, ...instrumentTasks];
    setInstrumentTasks(updatedTasks);
    setFilteredTasks(instrumentCode ? updatedTasks.filter(t => t.code.toLowerCase().includes(instrumentCode.toLowerCase())) : updatedTasks);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="bg-slate-50 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <PenTool className="text-purple-400 w-5 h-5" />
              </div>
              Instrument Task List
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">
              Task list for Gauges and Instruments
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
                placeholder="Press Enter to search (e.g. VC001)..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 self-end">
            <button type="submit" className="bg-[#0a192f] text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-slate-800 transition-all">
              Load Data
            </button>
            <button type="button" onClick={addNewRow} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-purple-500 transition-all">
              <Plus size={16} /> New Task
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 ag-theme-quartz shadow-xl border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={filteredTasks.length > 0 || instrumentCode ? filteredTasks : instrumentTasks}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
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

export default InstrumentTaskListPage;
