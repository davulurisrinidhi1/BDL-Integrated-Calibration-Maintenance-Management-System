import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Settings2, Plus } from 'lucide-react';

const MachineTaskListPage = () => {
  const { machineTasks, setMachineTasks, selectedMachineCode, selectedMachine } = useData();
  const [gridApi, setGridApi] = useState(null);
  const navigate = useNavigate();

  // Safe hydration guard – show empty state if no machine selected
  if (!selectedMachineCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h2 className="text-2xl font-bold mb-4">No Machine Selected</h2>
        <p className="mb-6">Please choose a machine from Machine Dashboard.</p>
        <button onClick={() => navigate('/machine-dashboard')} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Go To Dashboard
        </button>
      </div>
    );
  }

  const machine = selectedMachine || { code: selectedMachineCode };
  const filteredTasks = machineTasks.filter(t => t.code === selectedMachineCode);

  const columnDefs = useMemo(() => [
    { field: 'ctr', headerName: 'CTR', editable: true, width: 100, pinned: 'left' },
    { field: 'description', headerName: 'TL DESCRIPTION', editable: true, flex: 1, minWidth: 250 },
    { field: 'pht', headerName: 'PHT', editable: true, width: 80 },
    { field: 'det', headerName: 'DET', editable: true, width: 100 },
    { 
      field: 'strategy', 
      headerName: 'STRATEGY', 
      editable: true, 
      width: 100,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['SM', 'PM'] },
      cellRenderer: params => {
        if (!params.value) return null;
        const color = params.value === 'SM' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${color}`}>
            {params.value}
          </span>
        );
      }
    },
    { field: 'engineer', headerName: 'ENGINEER', editable: true, width: 150 },
    { field: 'frequency', headerName: 'FREQUENCY', editable: true, width: 120 },
    { 
      field: 'status', 
      headerName: 'STATUS', 
      editable: true, 
      width: 120,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Active', 'Completed', 'Pending', 'Scheduled'] },
      cellRenderer: params => {
        if (!params.value) return null;
        let color = 'bg-slate-100 text-slate-700';
        if (params.value === 'Active') color = 'bg-blue-100 text-blue-700';
        if (params.value === 'Completed') color = 'bg-emerald-100 text-emerald-700';
        if (params.value === 'Pending') color = 'bg-amber-100 text-amber-700';
        if (params.value === 'Scheduled') color = 'bg-indigo-100 text-indigo-700';
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
    const updatedTasks = [...machineTasks];
    const index = updatedTasks.findIndex(t => t.id === params.data.id);
    if (index >= 0) {
      updatedTasks[index] = params.data;
    } else {
      updatedTasks.push(params.data);
    }
    setMachineTasks(updatedTasks);
  };

  const addNewRow = () => {
    const newTask = {
      id: `MT-${Date.now()}`,
      code: selectedMachineCode,
      stc: machine.stc || '',
      group: machine.group || '',
      ctr: '',
      description: '',
      pht: '',
      det: '',
      strategy: 'SM'
    };
    setMachineTasks([newTask, ...machineTasks]);
  };

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Header with Equipment Code | STC | Group | Machine */}
      <div className="bg-slate-50 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <Settings2 className="text-blue-400 w-5 h-5" />
              </div>
              Machine Task List
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equipment Code:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.code}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">STC:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.stc || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Group:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.group || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Machine:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.description || machine.type || 'N/A'}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={addNewRow} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-blue-500 transition-all">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full ag-theme-quartz shadow-xl border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={filteredTasks}
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

export default MachineTaskListPage;
