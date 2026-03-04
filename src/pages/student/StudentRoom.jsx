import { BedDouble, MapPin, Users, CheckCircle, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Badge, { StatusBadge } from "../../components/ui/Badge.jsx";

export default function StudentRoom() {
  const { user } = useAuth();
  const { allocations, rooms, hostels, users } = useData();

  const myAllocation = allocations.find(
    (a) => a.studentId === user.id && a.status === "active"
  );
  const myRoom = myAllocation
    ? rooms.find((r) => r.id === myAllocation.roomId)
    : null;
  const myHostel = myAllocation
    ? hostels.find((h) => h.id === myAllocation.hostelId)
    : null;

  const roommates = myRoom
    ? allocations
        .filter(
          (a) =>
            a.roomId === myRoom.id &&
            a.status === "active" &&
            a.studentId !== user.id
        )
        .map((a) => users.find((u) => u.id === a.studentId))
        .filter(Boolean)
    : [];

  return (
    <div>
      <PageHeader
        title="My Room"
        subtitle="Your current accommodation details"
      />

      {!myRoom ? (
        <div className="card text-center py-16">
          <BedDouble size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="font-display text-xl text-gray-700">
            No Room Allocated
          </p>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            Please contact the hostel administrator or apply for accommodation.
          </p>
          <Link to="/student/apply" className="btn-primary inline-flex">
            Apply for Accommodation
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Hostel + Room Banner */}
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {myHostel?.name}
                    </span>
                    {myHostel && (
                      <Badge
                        variant={
                          myHostel.gender === "Male"
                            ? "info"
                            : myHostel.gender === "Female"
                              ? "purple"
                              : "default"
                        }
                      >
                        {myHostel.gender}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Block {myRoom.block} · Floor {myRoom.floor}
                    </span>
                  </div>
                  <h2 className="text-4xl font-display text-navy-900 mt-2">
                    Room {myRoom.block}
                    {myRoom.number}
                  </h2>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <StatusBadge status={myRoom.status} />
                    <Badge variant="navy">{myRoom.type} Room</Badge>
                    <Badge variant="default">Capacity: {myRoom.capacity}</Badge>
                  </div>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-navy-50 flex items-center justify-center shrink-0">
                  <BedDouble size={32} className="text-navy-600" />
                </div>
              </div>

              <hr className="my-5 border-gray-100" />

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Room Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {myRoom.amenities.map((a) => (
                    <div
                      key={a}
                      className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-lg px-3 py-1.5 text-sm"
                    >
                      <CheckCircle size={13} /> {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Allocation Details */}
            <div className="card">
              <h3 className="font-display text-navy-950 mb-4">
                Allocation Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Allocation ID
                  </p>
                  <p className="font-mono text-gray-800">{myAllocation.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Academic Year
                  </p>
                  <p className="text-gray-800">{myAllocation.academicYear}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Start Date
                  </p>
                  <p className="text-gray-800">{myAllocation.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    End Date
                  </p>
                  <p className="text-gray-800">{myAllocation.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                    Status
                  </p>
                  <StatusBadge status={myAllocation.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Roommates */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Users size={15} className="text-navy-600" />
              <h3 className="font-display text-navy-950">Roommates</h3>
              <span className="ml-auto text-xs text-gray-400">
                {roommates.length}/{myRoom.capacity - 1} others
              </span>
            </div>
            {roommates.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No roommates</p>
                {myRoom.capacity > 1 && (
                  <p className="text-xs mt-1">
                    Room has {myRoom.capacity - 1} more space(s)
                  </p>
                )}
              </div>
            ) : (
              <ul className="space-y-3">
                {roommates.map((rm) => (
                  <li
                    key={rm.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-9 h-9 rounded-full bg-navy-700 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                      {rm.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {rm.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {rm.course || "Student"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
