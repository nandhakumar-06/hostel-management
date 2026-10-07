import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserRole, Student, Hostel, Room, FeeRecord, Complaint, VisitorRecord, Notice } from '../types';
import {
  INITIAL_HOSTELS,
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_FEES,
  INITIAL_COMPLAINTS,
  INITIAL_VISITORS,
  INITIAL_NOTICES
} from '../data/mockData';

interface HostelContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeStudent: Student | null;
  setActiveStudent: (student: Student | null) => void;
  
  hostels: Hostel[];
  addHostel: (hostel: Omit<Hostel, 'id' | 'occupiedBeds'>) => void;
  updateHostel: (id: string, hostel: Partial<Hostel>) => void;
  deleteHostel: (id: string) => void;
  
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id' | 'currentOccupancy' | 'status'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'status'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  allocateRoom: (studentId: string, hostelId: string, roomNumber: string) => boolean;
  vacateRoom: (studentId: string) => void;
  
  fees: FeeRecord[];
  addFee: (fee: Omit<FeeRecord, 'id' | 'pendingAmount' | 'status'>) => void;
  recordPayment: (id: string, amount: number) => void;
  
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => void;
  updateComplaintStatus: (id: string, status: 'Pending' | 'In Progress' | 'Resolved', adminNote?: string) => void;
  
  visitors: VisitorRecord[];
  addVisitor: (visitor: Omit<VisitorRecord, 'id' | 'entryTime' | 'status'>) => void;
  checkoutVisitor: (id: string) => void;

  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  
  resetData: () => void;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');

  // Load state from localStorage or initial mock data
  const [hostels, setHostels] = useState<Hostel[]>(() => {
    const saved = localStorage.getItem('hms_hostels');
    return saved ? JSON.parse(saved) : INITIAL_HOSTELS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hms_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('hms_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [fees, setFees] = useState<FeeRecord[]>(() => {
    const saved = localStorage.getItem('hms_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('hms_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [visitors, setVisitors] = useState<VisitorRecord[]>(() => {
    const saved = localStorage.getItem('hms_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('hms_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [activeStudent, setActiveStudent] = useState<Student | null>(students[0] || null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hms_hostels', JSON.stringify(hostels));
  }, [hostels]);

  useEffect(() => {
    localStorage.setItem('hms_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hms_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('hms_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('hms_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('hms_visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('hms_notices', JSON.stringify(notices));
  }, [notices]);

  // Recalculate hostel occupied beds and room occupancy status
  const updateOccupancyMetrics = (currentRooms: Room[], currentHostels: Hostel[]) => {
    const hostelBedsMap: Record<string, number> = {};
    currentRooms.forEach(room => {
      hostelBedsMap[room.hostelId] = (hostelBedsMap[room.hostelId] || 0) + room.currentOccupancy;
    });

    const updatedHostels = currentHostels.map(h => ({
      ...h,
      occupiedBeds: hostelBedsMap[h.id] || 0
    }));

    return updatedHostels;
  };

  // Hostel Handlers
  const addHostel = (hostelData: Omit<Hostel, 'id' | 'occupiedBeds'>) => {
    const newHostel: Hostel = {
      ...hostelData,
      id: 'h-' + Date.now(),
      occupiedBeds: 0
    };
    setHostels(prev => [...prev, newHostel]);
  };

  const updateHostel = (id: string, hostelData: Partial<Hostel>) => {
    setHostels(prev => prev.map(h => h.id === id ? { ...h, ...hostelData } : h));
  };

  const deleteHostel = (id: string) => {
    setHostels(prev => prev.filter(h => h.id !== id));
    setRooms(prev => prev.filter(r => r.hostelId !== id));
  };

  // Room Handlers
  const addRoom = (roomData: Omit<Room, 'id' | 'currentOccupancy' | 'status'>) => {
    const newRoom: Room = {
      ...roomData,
      id: 'r-' + Date.now(),
      currentOccupancy: 0,
      status: 'Available'
    };
    setRooms(prev => {
      const nextRooms = [...prev, newRoom];
      setHostels(hPrev => updateOccupancyMetrics(nextRooms, hPrev));
      return nextRooms;
    });
  };

  const updateRoom = (id: string, roomData: Partial<Room>) => {
    setRooms(prev => {
      const nextRooms = prev.map(r => {
        if (r.id === id) {
          const updated = { ...r, ...roomData };
          if (updated.status !== 'Maintenance') {
            updated.status = updated.currentOccupancy >= updated.capacity ? 'Full' : 'Available';
          }
          return updated;
        }
        return r;
      });
      setHostels(hPrev => updateOccupancyMetrics(nextRooms, hPrev));
      return nextRooms;
    });
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => {
      const nextRooms = prev.filter(r => r.id !== id);
      setHostels(hPrev => updateOccupancyMetrics(nextRooms, hPrev));
      return nextRooms;
    });
  };

  // Student Handlers
  const addStudent = (studentData: Omit<Student, 'id' | 'status'>) => {
    const newStudent: Student = {
      ...studentData,
      id: 's-' + Date.now(),
      status: 'Active'
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...studentData } : s));
  };

  const deleteStudent = (id: string) => {
    const targetStudent = students.find(s => s.id === id);
    if (targetStudent && targetStudent.roomNumber && targetStudent.hostelId) {
      vacateRoom(id);
    }
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Room Allocation Handlers
  const allocateRoom = (studentId: string, hostelId: string, roomNumber: string): boolean => {
    const hostel = hostels.find(h => h.id === hostelId);
    const room = rooms.find(r => r.hostelId === hostelId && r.roomNumber === roomNumber);
    const student = students.find(s => s.id === studentId || s.studentId === studentId);

    if (!hostel || !room || !student) return false;
    if (room.currentOccupancy >= room.capacity) return false;

    if (student.hostelId && student.roomNumber) {
      vacateRoom(student.id);
    }

    const updatedRooms = rooms.map(r => {
      if (r.id === room.id) {
        const nextOccupancy = r.currentOccupancy + 1;
        return {
          ...r,
          currentOccupancy: nextOccupancy,
          status: (nextOccupancy >= r.capacity ? 'Full' : 'Available') as 'Full' | 'Available'
        };
      }
      return r;
    });

    setRooms(updatedRooms);

    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          hostelId: hostel.id,
          hostelName: hostel.name,
          roomNumber: room.roomNumber
        };
      }
      return s;
    }));

    setHostels(prev => updateOccupancyMetrics(updatedRooms, prev));
    return true;
  };

  const vacateRoom = (studentId: string) => {
    const student = students.find(s => s.id === studentId || s.studentId === studentId);
    if (!student || !student.hostelId || !student.roomNumber) return;

    const updatedRooms = rooms.map(r => {
      if (r.hostelId === student.hostelId && r.roomNumber === student.roomNumber) {
        const nextOccupancy = Math.max(0, r.currentOccupancy - 1);
        return {
          ...r,
          currentOccupancy: nextOccupancy,
          status: 'Available' as 'Available'
        };
      }
      return r;
    });

    setRooms(updatedRooms);

    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          hostelId: undefined,
          hostelName: undefined,
          roomNumber: undefined
        };
      }
      return s;
    }));

    setHostels(prev => updateOccupancyMetrics(updatedRooms, prev));
  };

  // Fee Handlers
  const addFee = (feeData: Omit<FeeRecord, 'id' | 'pendingAmount' | 'status'>) => {
    const pending = Math.max(0, feeData.totalAmount - feeData.paidAmount);
    let status: 'Paid' | 'Pending' | 'Partial' = 'Pending';
    if (pending === 0) status = 'Paid';
    else if (feeData.paidAmount > 0) status = 'Partial';

    const newFee: FeeRecord = {
      ...feeData,
      id: 'f-' + Date.now(),
      pendingAmount: pending,
      status
    };
    setFees(prev => [newFee, ...prev]);
  };

  const recordPayment = (id: string, amount: number) => {
    setFees(prev => prev.map(f => {
      if (f.id === id) {
        const newPaid = f.paidAmount + amount;
        const newPending = Math.max(0, f.totalAmount - newPaid);
        let newStatus: 'Paid' | 'Pending' | 'Partial' = 'Pending';
        if (newPending === 0) newStatus = 'Paid';
        else if (newPaid > 0) newStatus = 'Partial';

        return {
          ...f,
          paidAmount: newPaid,
          pendingAmount: newPending,
          status: newStatus,
          lastPaymentDate: new Date().toISOString().split('T')[0]
        };
      }
      return f;
    }));
  };

  // Complaint Handlers
  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0] + ' ' + today.toTimeString().split(' ')[0].substring(0, 5);

    const newComplaint: Complaint = {
      ...complaintData,
      id: 'c-' + Date.now(),
      status: 'Pending',
      createdAt: formattedDate
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: 'Pending' | 'In Progress' | 'Resolved', adminNote?: string) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0] + ' ' + today.toTimeString().split(' ')[0].substring(0, 5);

    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          adminNote: adminNote !== undefined ? adminNote : c.adminNote,
          updatedAt: formattedDate
        };
      }
      return c;
    }));
  };

  // Visitor Handlers
  const addVisitor = (visitorData: Omit<VisitorRecord, 'id' | 'entryTime' | 'status'>) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0] + ' ' + today.toTimeString().split(' ')[0].substring(0, 5);

    const newVisitor: VisitorRecord = {
      ...visitorData,
      id: 'v-' + Date.now(),
      entryTime: formattedDate,
      status: 'In Campus'
    };
    setVisitors(prev => [newVisitor, ...prev]);
  };

  const checkoutVisitor = (id: string) => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0] + ' ' + today.toTimeString().split(' ')[0].substring(0, 5);

    setVisitors(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          exitTime: formattedDate,
          status: 'Checked Out'
        };
      }
      return v;
    }));
  };

  // Notice Handlers
  const addNotice = (noticeData: Omit<Notice, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newNotice: Notice = {
      ...noticeData,
      id: 'n-' + Date.now(),
      date: today
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const resetData = () => {
    setHostels(INITIAL_HOSTELS);
    setRooms(INITIAL_ROOMS);
    setStudents(INITIAL_STUDENTS);
    setFees(INITIAL_FEES);
    setComplaints(INITIAL_COMPLAINTS);
    setVisitors(INITIAL_VISITORS);
    setNotices(INITIAL_NOTICES);
    localStorage.clear();
  };

  return (
    <HostelContext.Provider
      value={{
        role,
        setRole,
        activeStudent,
        setActiveStudent,
        hostels,
        addHostel,
        updateHostel,
        deleteHostel,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        allocateRoom,
        vacateRoom,
        fees,
        addFee,
        recordPayment,
        complaints,
        addComplaint,
        updateComplaintStatus,
        visitors,
        addVisitor,
        checkoutVisitor,
        notices,
        addNotice,
        resetData
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) throw new Error('useHostel must be used within a HostelProvider');
  return context;
};
