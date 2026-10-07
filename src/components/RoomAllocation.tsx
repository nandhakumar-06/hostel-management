import React, { useState } from 'react';
import { useHostel } from '../context/HostelContext';
import {
  Key,
  UserCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  LogOut,
  Search
} from 'lucide-react';

export const RoomAllocation: React.FC = () => {
  const { students, hostels, rooms, allocateRoom, vacateRoom } = useHostel();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedHostelId, setSelectedHostelId] = useState(hostels[0]?.id || '');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [allocationMessage, setAllocationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Unallocated students list
  const unallocatedStudents = students.filter(s => !s.roomNumber);

  // Available rooms in selected hostel
  const availableRoomsInHostel = rooms.filter(
    r => r.hostelId === selectedHostelId && r.currentOccupancy < r.capacity && r.status !== 'Maintenance'
  );

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAllocationMessage(null);

    if (!selectedStudentId || !selectedHostelId || !selectedRoomNumber) {
      setAllocationMessage({ type: 'error', text: 'Please select a student, hostel, and room.' });
      return;
    }

    const success = allocateRoom(selectedStudentId, selectedHostelId, selectedRoomNumber);
    if (success) {
      setAllocationMessage({ type: 'success', text: 'Student allocated to room successfully!' });
      setSelectedStudentId('');
      setSelectedRoomNumber('');
    } else {
      setAllocationMessage({ type: 'error', text: 'Failed to allocate: Room may be full or unavailable.' });
    }
  };

  const occupiedRooms = rooms.filter(r => r.currentOccupancy > 0);

  const filteredOccupiedRooms = occupiedRooms.filter(r => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hostelName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
        <h2 className="text-xl font-bold text-brand-mainText flex items-center space-x-2">
          <Key className="w-6 h-6 text-brand-accent" />
          <span>Room Allocation & Occupant Tracking</span>
        </h2>
        <p className="text-xs text-brand-subText mt-1">
          Allocate unassigned students, verify room capacities, transfer allocations, or vacate student beds.
        </p>
      </div>

      {/* Allocation Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Quick Allocation Form */}
        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-brand-mainText flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-brand-accent" />
              <span>Allocate Student to Room</span>
            </h3>
            <p className="text-xs text-brand-subText">Select student and assign available bed space</p>
          </div>

          {allocationMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                allocationMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {allocationMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{allocationMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleAllocateSubmit} className="space-y-4 text-xs">
            
            {/* Student Select */}
            <div>
              <label className="font-semibold text-brand-mainText block mb-1">
                Select Student ({unallocatedStudents.length} Unallocated)
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
              >
                <option value="">-- Choose Student --</option>
                {unallocatedStudents.map(stu => (
                  <option key={stu.id} value={stu.id}>
                    {stu.name} ({stu.studentId}) • {stu.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Hostel Block Select */}
            <div>
              <label className="font-semibold text-brand-mainText block mb-1">Select Hostel Block</label>
              <select
                value={selectedHostelId}
                onChange={(e) => {
                  setSelectedHostelId(e.target.value);
                  setSelectedRoomNumber('');
                }}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
              >
                {hostels.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.type}) - {h.totalCapacity - h.occupiedBeds} Beds Vacant
                  </option>
                ))}
              </select>
            </div>

            {/* Room Select */}
            <div>
              <label className="font-semibold text-brand-mainText block mb-1">
                Select Available Room ({availableRoomsInHostel.length} Options)
              </label>
              <select
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-bg text-brand-mainText"
              >
                <option value="">-- Choose Available Room --</option>
                {availableRoomsInHostel.map(r => (
                  <option key={r.id} value={r.roomNumber}>
                    Room {r.roomNumber} ({r.type} • {r.currentOccupancy}/{r.capacity} Occupied • ₹{r.rentPerMonth}/mo)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={unallocatedStudents.length === 0}
              className="w-full py-3 bg-brand-accent hover:bg-brand-accentHover disabled:bg-gray-300 text-white rounded-xl font-bold shadow-sm transition flex items-center justify-center space-x-2"
            >
              <span>Confirm Allocation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right: Occupant Tracker */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-mainText">Current Room Occupants</h3>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-brand-subText absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search occupied room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-brand-bg rounded-xl border border-brand-border text-brand-mainText focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredOccupiedRooms.map((room) => {
              const roomOccupants = students.filter(
                s => s.hostelId === room.hostelId && s.roomNumber === room.roomNumber
              );

              return (
                <div key={room.id} className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm space-y-3">
                  
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-brand-mainText bg-brand-bg px-2.5 py-1 rounded-lg border border-brand-border">
                        Rm {room.roomNumber}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-brand-mainText">{room.hostelName}</span>
                        <span className="text-[10px] text-brand-subText block">
                          Floor {room.floor} • {room.type} Room
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-accent">
                        {room.currentOccupancy} / {room.capacity} Occupied
                      </span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-brand-accent"
                          style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {roomOccupants.map((student) => (
                      <div
                        key={student.id}
                        className="bg-brand-bg p-2.5 rounded-xl border border-brand-border flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-brand-mainText">{student.name}</div>
                          <div className="text-[10px] text-brand-subText">
                            {student.studentId} • {student.department}
                          </div>
                        </div>

                        <button
                          onClick={() => vacateRoom(student.id)}
                          title="Vacate Bed"
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition text-[10px] font-semibold flex items-center space-x-1"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Vacate</span>
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
