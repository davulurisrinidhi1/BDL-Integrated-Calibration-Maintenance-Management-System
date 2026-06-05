import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Archive, Plus } from 'lucide-react';

const MachineSpareListPage = () => {
  const { machineSpares, setMachineSpares, selectedMachineCode, selectedMachine } = useData();
  const [gridApi, setGridApi] = useState(null);
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
  const filteredSpares = machineSpares.filter(s => s.code === selectedMachineCode);

  const columnDefs = useMemo(() => [
    { field: 'partName', headerName: 'Spare Part', editable: true, flex: 1, minWidth: 200, pinned: 'left' },
    { field: 'quantity', headerName: 'Quantity', editable: true, type: 'numericColumn', width: 120 },
    { field: 'threshold', headerName: 'Threshold', editable: true, type: 'numericColumn', width: 120 },
    { 
      field: 'status', 
      headerName: 'Status', 
      editable: true, 
      width: 170,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Available', 'Low Stock', 'Critical'] },
      valueGetter: (params) => {
        if (params.data.status) return params.data.status;
        const qty = params.data.quantity || 0;
        const thresh = params.data.threshold || 5;
        if (qty <= Math.floor(thresh * 0.3)) return 'Critical';
        if (qty <= thresh) return 'Low Stock';
        return 'Available';
      },
      cellRenderer: params => {
        if (!params.value) return null;
        let color = 'bg-emerald-100 text-emerald-700';
        if (params.value === 'Low Stock') color = 'bg-amber-100 text-amber-700';
        if (params.value === 'Critical') color = 'bg-rose-100 text-rose-700';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${color}`}>
            {params.value}
          </span>
        );
      }
    },
    { field: 'vendor', headerName: 'Vendor', editable: true, width: 200 },
    { field: 'lastUpdated', headerName: 'Last Updated', editable: true, width: 150 }
  ], []);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  const onCellValueChanged = (params) => {
    const updated = [...machineSpares];
    const index = updated.findIndex(s => s.id === params.data.id);
    if (index >= 0) {
      updated[index] = params.data;
    } else {
      updated.push(params.data);
    }
    setMachineSpares(updated);
  };

  const addNewRow = () => {
    const newSpare = {
      id: `MSP-${Date.now()}`,
      code: selectedMachineCode,
      partName: '',
      partNumber: '',
      quantity: 0,
      unit: 'Pieces',
      threshold: 5,
      status: '',
      remarks: ''
    };
    setMachineSpares([newSpare, ...machineSpares]);
  };

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Header: Equipment Code | Machine */}
      <div className="bg-slate-50 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <Archive className="text-amber-400 w-5 h-5" />
              </div>
              Spare Inventory
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equipment Code:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.code}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Machine:</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{machine.description || machine.type || 'N/A'}</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={addNewRow} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-amber-500 transition-all">
            <Plus size={16} /> Add Spare
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full ag-theme-quartz shadow-xl border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={filteredSpares}
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

export default MachineSpareListPage;
