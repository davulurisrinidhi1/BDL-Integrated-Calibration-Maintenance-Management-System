import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { PenTool, Plus } from 'lucide-react';

const MachineWorkOrderPage = () => {
  const { machineWorkOrders, setMachineWorkOrders, selectedMachineCode, selectedMachine } = useData();
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
  const filteredOrders = machineWorkOrders.filter(o => o.code === selectedMachineCode);

  const columnDefs = useMemo(() => [
    { field: 'order', headerName: 'Order', editable: true, width: 130, pinned: 'left' },
    { field: 'systemStatus', headerName: 'System Status', editable: true, width: 130,
      cellRenderer: params => {
        if (!params.value) return null;
        let color = 'bg-slate-100 text-slate-700';
        if (params.value === 'CRTD') color = 'bg-blue-100 text-blue-700';
        if (params.value === 'REL') color = 'bg-amber-100 text-amber-700';
        if (params.value === 'TECO') color = 'bg-emerald-100 text-emerald-700';
        if (params.value === 'CLSD') color = 'bg-slate-200 text-slate-600';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${color}`}>
            {params.value}
          </span>
        );
      }
    },
    { field: 'act', headerName: 'ACT', editable: true, width: 90 },
    { field: 'sop', headerName: 'SOP', editable: true, width: 100 },
    { field: 'workCtr', headerName: 'WorkCtr', editable: true, width: 110 },
    { field: 'plant', headerName: 'Plant', editable: true, width: 100 },
    { field: 'co', headerName: 'Co', editable: true, width: 80 },
    { field: 'stTextK', headerName: 'StTextK', editable: true, width: 110 },
    { field: 'operationText', headerName: 'Operation Short Text', editable: true, width: 220 },
    { field: 'longText', headerName: 'Long Text', editable: true, width: 250 },
    { field: 'actualWork', headerName: 'Actual Work', editable: true, width: 120 },
    { field: 'work', headerName: 'Work', editable: true, width: 100 },
    { field: 'un', headerName: 'UN', editable: true, width: 80 },
    { field: 'duration', headerName: 'Duration', editable: true, width: 100 },
    { field: 'cKey', headerName: 'C.Key', editable: true, width: 90 },
    { field: 'actType', headerName: 'Act Type', editable: true, width: 110 },
    { field: 'recipient', headerName: 'Recipient', editable: true, width: 120 },
    { field: 'unloadingPoint', headerName: 'Unloading Point', editable: true, width: 160 }
  ], []);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  const onCellValueChanged = (params) => {
    const updated = [...machineWorkOrders];
    const index = updated.findIndex(o => o.id === params.data.id);
    if (index >= 0) {
      updated[index] = params.data;
    } else {
      updated.push(params.data);
    }
    setMachineWorkOrders(updated);
  };

  const addNewRow = () => {
    const newOrder = {
      id: `MWO-${Date.now()}`,
      code: selectedMachineCode,
      order: '',
      systemStatus: 'CRTD',
      act: '', sop: '', workCtr: '', plant: '', co: '', stTextK: '',
      operationText: '', longText: '', actualWork: '', work: '', un: '',
      duration: '', cKey: '', actType: '', recipient: '', unloadingPoint: ''
    };
    setMachineWorkOrders([newOrder, ...machineWorkOrders]);
  };

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Header: Order Number | System Status */}
      <div className="bg-slate-50 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <PenTool className="text-rose-400 w-5 h-5" />
              </div>
              Machine Work Orders
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
          <button type="button" onClick={addNewRow} className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-rose-500 transition-all">
            <Plus size={16} /> Add Work Order
          </button>
        </div>
      </div>

      {/* AG Grid with proper flex-1 + min-h-0 + overflow-hidden container for full horizontal scroll */}
      <div className="flex-1 min-h-0 w-full ag-theme-quartz shadow-xl border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          rowData={filteredOrders}
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

export default MachineWorkOrderPage;
