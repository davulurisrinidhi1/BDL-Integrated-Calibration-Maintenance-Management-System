import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Zap, Plus } from 'lucide-react';

const MachineStrategyPage = () => {
  const { machineStrategies, setMachineStrategies, selectedMachineCode, selectedMachine } = useData();
  const [smGridApi, setSmGridApi] = useState(null);
  const [pmGridApi, setPmGridApi] = useState(null);

  const navigate = useNavigate();

  if (!selectedMachineCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-2xl font-bold mb-4">No Machine Selected</h2>
        <p className="mb-6">Please choose a machine from the Machine Dashboard.</p>
        <button onClick={() => navigate('/machine-dashboard')} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Go To Dashboard
        </button>
      </div>
    );
  }

  const machine = selectedMachine || { code: selectedMachineCode };

  const smStrategies = machineStrategies.filter(s => s.code === selectedMachineCode && s.type === 'SM');
  const pmStrategies = machineStrategies.filter(s => s.code === selectedMachineCode && s.type === 'PM');

  const columnDefs = useMemo(() => [
    { field: 'action', headerName: 'Task', editable: true, flex: 1, minWidth: 250 },
    { field: 'frequency', headerName: 'Frequency', editable: true, width: 200 },
    { field: 'responsible', headerName: 'Responsible', editable: true, width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      editable: true, 
      width: 150,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Active', 'Completed', 'Scheduled', 'Planned'] },
      cellRenderer: params => {
        if (!params.value) return null;
        let color = 'bg-slate-100 text-slate-700';
        if (params.value === 'Active') color = 'bg-blue-100 text-blue-700';
        if (params.value === 'Completed') color = 'bg-emerald-100 text-emerald-700';
        if (params.value === 'Scheduled') color = 'bg-indigo-100 text-indigo-700';
        if (params.value === 'Planned') color = 'bg-amber-100 text-amber-700';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${color}`}>
            {params.value}
          </span>
        );
      }
    }
  ], []);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  const onCellValueChanged = (params) => {
    const updated = [...machineStrategies];
    const index = updated.findIndex(s => s.id === params.data.id);
    if (index >= 0) {
      updated[index] = params.data;
    } else {
      updated.push(params.data);
    }
    setMachineStrategies(updated);
  };

  const addNewRow = (type) => {
    const newStrategy = {
      id: `MS-${Date.now()}`,
      code: selectedMachineCode,
      type: type,
      action: '',
      frequency: type === 'SM' ? '3-monthly' : 'Yearly'
    };
    setMachineStrategies([newStrategy, ...machineStrategies]);
  };

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Header: Equipment Code | Machine | Type | STC | Group */}
      <div className="bg-slate-50 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <Zap className="text-emerald-400 w-5 h-5" />
              </div>
              Machine Strategy
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equipment Code:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.code}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Machine:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.description || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.type || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STC:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.stc || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Group:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.group || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SM Section */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">SM STRATEGY (3-Monthly)</h2>
          <button onClick={() => addNewRow('SM')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all">
            <Plus size={14} /> Add SM Action
          </button>
        </div>
        <div className="flex-1 min-h-0 ag-theme-quartz w-full border border-slate-200 rounded overflow-hidden">
          <AgGridReact
            rowData={smStrategies}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={(params) => setSmGridApi(params.api)}
            onCellValueChanged={onCellValueChanged}
            rowHeight={40}
            headerHeight={44}
          />
        </div>
      </div>

      {/* PM Section */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-800 border-l-4 border-indigo-500 pl-3">PM STRATEGY (Yearly)</h2>
          <button onClick={() => addNewRow('PM')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all">
            <Plus size={14} /> Add PM Action
          </button>
        </div>
        <div className="flex-1 min-h-0 ag-theme-quartz w-full border border-slate-200 rounded overflow-hidden">
          <AgGridReact
            rowData={pmStrategies}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={(params) => setPmGridApi(params.api)}
            onCellValueChanged={onCellValueChanged}
            rowHeight={40}
            headerHeight={44}
          />
        </div>
      </div>
    </div>
  );
};

export default MachineStrategyPage;
