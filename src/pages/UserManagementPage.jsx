import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  MoreVertical, 
  UserCheck, 
  UserMinus, 
  Key,
  CheckCircle2,
  Lock,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
  const { users, updateUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(u => u.status === 'Active').length;
    const admins = users.filter(u => u.role === 'Admin').length;
    const inspectors = users.filter(u => u.role === 'Quality Inspector').length;
    return { total, active, admins, inspectors };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleToggleStatus = (user) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const confirmToggle = async () => {
    const newStatus = selectedUser.status === 'Active' ? 'Disabled' : 'Active';
    updateUser(selectedUser.id, { status: newStatus });
    toast.success(`User ${selectedUser.name} ${newStatus.toLowerCase()} successfully`);
    setIsConfirmOpen(false);
  };

  const handleResetPassword = () => {
    toast.success('Password reset link dispatched to enterprise email');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" />
            User Access Control
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Manage employee permissions and enterprise role assignments.
          </p>
        </div>

        <button className="btn btn-primary shadow-lg shadow-blue-200">
          <UserPlus size={16} />
          PROVISION USER
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Staff" value={stats.total} icon={Users} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard title="Active Sessions" value={stats.active} icon={UserCheck} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard title="System Admins" value={stats.admins} icon={Shield} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        <StatCard title="Inspectors" value={stats.inspectors} icon={CheckCircle2} colorClass="text-amber-600" bgClass="bg-amber-50" />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or Employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
          />
        </div>
        
        <div className="flex gap-2">
           <button className="p-2 hover:bg-slate-50 rounded border border-slate-200 text-slate-500 transition-colors">
              <MoreHorizontal size={18} />
           </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
              <th className="px-6 py-4">Employee Details</th>
              <th className="px-6 py-4">Role / Access</th>
              <th className="px-6 py-4">Security Status</th>
              <th className="px-6 py-4">Last Interaction</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className={u.role === 'Admin' ? 'text-indigo-500' : 'text-slate-400'} />
                    <span className="text-xs font-bold text-slate-700">{u.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${u.status === 'Active' ? 'badge-accepted' : 'badge-rejected'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-medium text-slate-600">
                    {u.lastLogin ? u.lastLogin : 'No recent activity'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={handleResetPassword}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all" 
                      title="Reset Credentials"
                    >
                      <Key size={16} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(u)}
                      className={`p-2 rounded transition-all ${
                        u.status === 'Active' ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={u.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                    >
                      {u.status === 'Active' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmToggle}
        title={selectedUser?.status === 'Active' ? 'Deactivate User?' : 'Activate User?'}
        description={`Are you sure you want to change the access status for ${selectedUser?.name}? This will affect their ability to log into the terminal.`}
        isDanger={selectedUser?.status === 'Active'}
        confirmLabel={selectedUser?.status === 'Active' ? 'Deactivate' : 'Activate'}
      />
    </div>
  );
};

export default UserManagementPage;
