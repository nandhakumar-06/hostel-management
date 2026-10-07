import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import type { Student } from '../types';
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  BedDouble,
  Phone,
  Mail,
  X,
  AlertTriangle
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useHostel();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [allocationFilter, setAllocationFilter] = useState('All');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<Student | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    year: '1st Year',
    guardianName: '',
    emergencyContact: '',
    joinedDate: new Date().toISOString().split('T')[0]
  });

  const departments = Array.from(new Set(students.map(s => s.department)));

  // Filtered Students
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.roomNumber && student.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = departmentFilter === 'All' || student.department === departmentFilter;
    const matchesAlloc =
      allocationFilter === 'All'
        ? true
        : allocationFilter === 'Allocated'
        ? Boolean(student.roomNumber)
        : !student.roomNumber;

    return matchesSearch && matchesDept && matchesAlloc;
  });

  const handleOpenAddModal = () => {
    setFormData({
      studentId: `STU-2026-0${students.length + 1}`,
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      year: '1st Year',
      guardianName: '',
      emergencyContact: '',
      joinedDate: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addStudent({
      studentId: formData.studentId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      year: formData.year,
      guardianName: formData.guardianName,
      emergencyContact: formData.emergencyContact,
      joinedDate: formData.joinedDate
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      year: student.year,
      guardianName: student.guardianName,
      emergencyContact: student.emergencyContact,
      joinedDate: student.joinedDate
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    updateStudent(selectedStudent.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      year: formData.year,
      guardianName: formData.guardianName,
      emergencyContact: formData.emergencyContact
    });

    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = (student: Student) => {
    deleteStudent(student.id);
    setIsDeleteConfirmOpen(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
            <Users className="w-6 h-6 text-brand-accent" />
            <span>Student Management</span>
          </h2>
          <p className="text-xs text-brand-subText mt-1">
            Add, search, edit, view profile details, and manage student hostel records.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-brand-accent hover:bg-brand-accentHover text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-brand-subText absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, ID, email or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-brand-bg rounded-xl border border-brand-border focus:outline-none focus:border-brand-accent text-brand-mainText"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Allocation Filter */}
          <select
            value={allocationFilter}
            onChange={(e) => setAllocationFilter(e.target.value)}
            className="text-xs bg-brand-bg px-3 py-2 rounded-xl border border-brand-border text-brand-mainText focus:outline-none"
          >
            <option value="All">All Allocation Status</option>
            <option value="Allocated">Allocated Rooms</option>
            <option value="Unallocated">Unallocated Students</option>
          </select>
        </div>

      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/80 border-b border-brand-border text-[11px] font-bold text-brand-subText uppercase tracking-wider">
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Department & Year</th>
                <th className="py-3 px-4">Allocated Room</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-subText">
                    No student records matching your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-brand-bg/50 transition-colors">
                    
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-brand-mainText">{student.name}</div>
                      <div className="text-[11px] text-brand-subText font-mono">{student.studentId}</div>
                    </td>

                    {/* Department & Year */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-brand-mainText">{student.department}</div>
                      <div className="text-[11px] text-brand-subText">{student.year}</div>
                    </td>

                    {/* Room Assignment */}
                    <td className="py-3 px-4">
                      {student.roomNumber ? (
                        <div className="inline-flex items-center space-x-1 bg-teal-50 text-brand-accent px-2.5 py-1 rounded-lg border border-brand-accent/30 font-semibold text-[11px]">
                          <BedDouble className="w-3.5 h-3.5" />
                          <span>{student.hostelName} - Rm {student.roomNumber}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                          Unallocated
                        </span>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-brand-mainText">
                        <Mail className="w-3 h-3 text-brand-subText" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-brand-subText">
                        <Phone className="w-3 h-3 text-brand-subText" />
                        <span>{student.phone}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-200">
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 text-brand-subText hover:text-brand-accent hover:bg-brand-bg rounded-lg transition"
                          title="View Full Student Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="p-1.5 text-brand-subText hover:text-brand-accent hover:bg-brand-bg rounded-lg transition"
                          title="Edit Student Information"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsDeleteConfirmOpen(student)}
                          className="p-1.5 text-brand-subText hover:text-brand-error hover:bg-rose-50 rounded-lg transition"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT STUDENT */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
              <h3 className="text-lg font-bold text-brand-mainText flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-brand-accent" />
                <span>{isAddModalOpen ? 'Add Student Record' : 'Edit Student Record'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Student Roll ID</label>
                <input
                  type="text"
                  required
                  disabled={isEditModalOpen}
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-mainText block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electronics & Comm.">Electronics & Comm.</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Academic Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Father/Mother name"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-mainText block mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-brand-subText hover:bg-brand-bg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-accent hover:bg-brand-accentHover text-white rounded-xl font-bold shadow-sm"
                >
                  {isAddModalOpen ? 'Create Student' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW STUDENT DETAILS */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-border space-y-4">
            
            <div className="flex items-start justify-between border-b border-brand-border pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase bg-brand-accent/15 text-brand-accent px-2 py-0.5 rounded font-bold">
                  {selectedStudent.studentId}
                </span>
                <h3 className="text-xl font-extrabold text-brand-mainText mt-1">{selectedStudent.name}</h3>
                <p className="text-xs text-brand-subText">{selectedStudent.department} • {selectedStudent.year}</p>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-brand-bg p-3 rounded-xl border border-brand-border/60">
                <span className="text-brand-subText block font-semibold text-[10px] uppercase">Allocated Room</span>
                <p className="font-bold text-brand-mainText mt-0.5">
                  {selectedStudent.roomNumber
                    ? `${selectedStudent.hostelName} - Rm ${selectedStudent.roomNumber}`
                    : 'Not Allocated Yet'}
                </p>
              </div>
              <div className="bg-brand-bg p-3 rounded-xl border border-brand-border/60">
                <span className="text-brand-subText block font-semibold text-[10px] uppercase">Contact Phone</span>
                <p className="font-bold text-brand-mainText mt-0.5">{selectedStudent.phone}</p>
              </div>
              <div className="bg-brand-bg p-3 rounded-xl border border-brand-border/60">
                <span className="text-brand-subText block font-semibold text-[10px] uppercase">Email Address</span>
                <p className="font-bold text-brand-mainText mt-0.5">{selectedStudent.email}</p>
              </div>
              <div className="bg-brand-bg p-3 rounded-xl border border-brand-border/60">
                <span className="text-brand-subText block font-semibold text-[10px] uppercase">Guardian Name</span>
                <p className="font-bold text-brand-mainText mt-0.5">{selectedStudent.guardianName || 'N/A'}</p>
              </div>
              <div className="bg-brand-bg p-3 rounded-xl border border-brand-border/60">
                <span className="text-brand-subText block font-semibold text-[10px] uppercase">Emergency Contact</span>
                <p className="font-bold text-brand-mainText mt-0.5 text-rose-700">{selectedStudent.emergencyContact || 'N/A'}</p>
              </div>
              <div className="bg-brand-bg p-3 rounded-xl border border-brand-border/60">
                <span className="text-brand-subText block font-semibold text-[10px] uppercase">Joined Date</span>
                <p className="font-bold text-brand-mainText mt-0.5">{selectedStudent.joinedDate}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-brand-border text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-brand-mainText">Delete Student Record?</h4>
              <p className="text-xs text-brand-subText mt-1">
                Are you sure you want to remove <strong>{isDeleteConfirmOpen.name}</strong>? If allocated, their room bed will be vacated automatically.
              </p>
            </div>
            <div className="flex justify-center space-x-3 text-xs">
              <button
                onClick={() => setIsDeleteConfirmOpen(null)}
                className="px-4 py-2 rounded-xl border border-brand-border text-brand-subText font-semibold hover:bg-brand-bg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(isDeleteConfirmOpen)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-sm"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
