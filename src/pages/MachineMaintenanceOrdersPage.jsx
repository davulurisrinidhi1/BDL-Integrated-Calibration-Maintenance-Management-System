import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';

const MachineMaintenanceOrdersPage = () => {
  const { maintenanceOrders, setMaintenanceOrders, selectedMachineCode, selectedMachine } = useData();
  const [activeTab, setActiveTab] = useState('SM');
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
  const filteredOrders = maintenanceOrders.filter(o => o.code === selectedMachineCode && o.type === activeTab);

  const columnDefs = useMemo(() => [
    { field: 'orderNumber', headerName: 'Order ID', editable: true, width: 200, pinned: 'left' },
    { field: 'description', headerName: 'Activity', editable: true, flex: 1, minWidth: 250 },
    { field: 'completedDate', headerName: 'Last Date', editable: true, width: 150 },
    { field: 'plannedDate', headerName: 'Planned Date', editable: true, width: 150 },
    { 
      field: 'status', 
      headerName: 'Status', 
      editable: true, 
      width: 150,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Scheduled', 'In Progress', 'Completed'] },
      cellRenderer: params => {
        if (!params.value) return null;
        let color = 'bg-slate-100 text-slate-700';
        if (params.value === 'Completed') color = 'bg-emerald-100 text-emerald-700';
        if (params.value === 'Scheduled') color = 'bg-blue-100 text-blue-700';
        if (params.value === 'In Progress') color = 'bg-amber-100 text-amber-700';
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${color}`}>
            {params.value}
          </span>
        );
      }
    },
    { field: 'engineer', headerName: 'Engineer', editable: true, width: 150 },
    { field: 'remarks', headerName: 'Remarks', editable: true, flex: 1, minWidth: 200 }
  ], []);

  const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

  const onCellValueChanged = (params) => {
    const updated = [...maintenanceOrders];
    const index = updated.findIndex(o => o.id === params.data.id);
    if (index >= 0) {
      updated[index] = params.data;
    } else {
      updated.push(params.data);
    }
    setMaintenanceOrders(updated);
  };

  const addNewRow = () => {
    const newOrder = {
      id: `MO-${Date.now()}`,
      code: selectedMachineCode,
      orderNumber: `${activeTab}-ORD-${new Date().toISOString().split('T')[0]}`,
      type: activeTab,
      description: '',
      plannedDate: '',
      completedDate: '',
      engineer: '',
      remarks: '',
      status: 'Scheduled'
    };
    setMaintenanceOrders([newOrder, ...maintenanceOrders]);
  };

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-1.5 bg-[#0a192f] rounded-lg">
                <Calendar className="text-blue-400 w-5 h-5" />
              </div>
              Maintenance Orders
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
          
          <button onClick={addNewRow} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow hover:bg-blue-500 transition-all">
            <Plus size={16} /> New Order
          </button>
        </div>
        
        {/* SM / PM Tabs */}
        <div className="flex gap-4 mt-6 px-1">
          <button 
            className={`font-bold text-sm pb-2 border-b-2 transition-all ${activeTab === 'SM' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('SM')}
          >
            SM Maintenance Orders
          </button>
          <button 
            className={`font-bold text-sm pb-2 border-b-2 transition-all ${activeTab === 'PM' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('PM')}
          >
            PM Maintenance Orders
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full ag-theme-quartz shadow-xl border border-slate-200 rounded-xl overflow-hidden">
        <AgGridReact
          key={activeTab}
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

export default MachineMaintenanceOrdersPage;
