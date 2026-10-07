import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  Building2,
  UserCheck,
  Shield,
  GraduationCap,
  Database,
  RefreshCw,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, activeStudent, setActiveStudent, students, resetData } = useHostel();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const supabaseActive = isSupabaseConfigured();

  return (
    <header className="bg-brand-primary text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & System Name */}
          <div className="flex items-center space-x-3">
            <div className="bg-brand-accent p-2 rounded-xl text-white shadow-sm flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block text-white leading-tight">
                Hostel<span className="text-brand-accent">Sync</span> Pro
              </span>
              <span className="text-xs text-brand-secondary font-medium block">
                Smart Residence Management
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-4">

            {/* Supabase Status Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-dark border border-brand-secondary/30">
              <Database className={`w-3.5 h-3.5 ${supabaseActive ? 'text-green-400' : 'text-amber-400'}`} />
              <span className="text-gray-200">
                {supabaseActive ? 'Supabase Live' : 'Demo Local Mode'}
              </span>
            </div>

            {/* Role Switcher Pill */}
            <div className="bg-brand-dark p-1 rounded-xl flex items-center border border-brand-secondary/30">
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  role === 'admin'
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              
              <button
                onClick={() => setRole('student')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  role === 'student'
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
            </div>

            {/* If Student Role, Select Active Student */}
            {role === 'student' && activeStudent && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 bg-brand-dark hover:bg-white/10 px-3 py-1.5 rounded-lg border border-brand-accent/50 text-xs font-medium transition"
                >
                  <UserCheck className="w-4 h-4 text-brand-accent" />
                  <span className="max-w-[120px] truncate">{activeStudent.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-brand-border text-brand-mainText py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-gray-100 text-xs font-semibold text-brand-subText">
                      Select Student View:
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {students.map((stu) => (
                        <button
                          key={stu.id}
                          onClick={() => {
                            setActiveStudent(stu);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-brand-bg flex items-center justify-between ${
                            activeStudent.id === stu.id ? 'font-bold text-brand-accent bg-brand-accent/10' : ''
                          }`}
                        >
                          <div>
                            <div>{stu.name}</div>
                            <div className="text-[10px] text-brand-subText">{stu.studentId}</div>
                          </div>
                          {stu.roomNumber && (
                            <span className="text-[10px] bg-brand-bg px-1.5 py-0.5 rounded text-brand-mainText">
                              Rm {stu.roomNumber}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reset Demo Data Button */}
            <button
              onClick={resetData}
              title="Reset to Initial Demo Seed Data"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
