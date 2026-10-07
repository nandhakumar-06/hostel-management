import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building,
  BedDouble,
  Key,
  CreditCard,
  AlertCircle,
  UserCheck,
  BarChart3
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'students'
  | 'hostels'
  | 'rooms'
  | 'allocations'
  | 'fees'
  | 'complaints'
  | 'visitors'
  | 'reports';

interface SidebarNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingComplaintsCount: number;
  activeVisitorsCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  pendingComplaintsCount,
  activeVisitorsCount
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'hostels', label: 'Hostels', icon: <Building className="w-4 h-4" /> },
    { id: 'rooms', label: 'Rooms & Occupancy', icon: <BedDouble className="w-4 h-4" /> },
    { id: 'allocations', label: 'Room Allocation', icon: <Key className="w-4 h-4" /> },
    { id: 'fees', label: 'Fee Management', icon: <CreditCard className="w-4 h-4" /> },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: <AlertCircle className="w-4 h-4" />,
      badge: pendingComplaintsCount
    },
    {
      id: 'visitors',
      label: 'Visitors',
      icon: <UserCheck className="w-4 h-4" />,
      badge: activeVisitorsCount
    },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-brand-border rounded-2xl shadow-sm p-4">
      <div className="text-xs font-bold uppercase tracking-wider text-brand-subText mb-3 px-3">
        Management Modules
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                  : 'text-brand-mainText hover:bg-brand-bg hover:text-brand-accent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-brand-accent' : 'text-brand-subText'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-brand-accent text-white' : 'bg-brand-accent/20 text-brand-accent'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
