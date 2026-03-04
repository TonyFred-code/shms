import { useState, useEffect, useCallback } from "react";
import {
  mockUsers,
  mockHostels,
  mockRooms,
  mockAllocations,
  mockFeeConfigs,
  mockPayments,
  mockComplaints,
  mockAnnouncements,
  mockApplications,
} from "../data/mockData.js";
import { setUsersRef } from "../services/authService.js";
import DataContext from "./dataContext.jsx";
import { node } from "prop-types";

export default function DataProvider({ children }) {
  const [users, setUsers] = useState(mockUsers);
  const [hostels, setHostels] = useState(mockHostels);
  const [rooms, setRooms] = useState(mockRooms);
  const [allocations, setAllocations] = useState(mockAllocations);
  const [feeConfigs, setFeeConfigs] = useState(mockFeeConfigs);
  const [payments, setPayments] = useState(mockPayments);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [applications, setApplications] = useState(mockApplications);
  const [notifications, setNotifications] = useState([]);

  // ─── Sync authService with current users list ────────────────────────────────
  const addUser = useCallback((userData) => {
    const newUser = userData.id
      ? userData
      : { ...userData, id: `u${Date.now()}` };
    setUsers((prev) => {
      const updated = [...prev, newUser];
      setUsersRef(updated, addUser);
      return updated;
    });
    return newUser;
  }, []);

  useEffect(() => {
    setUsersRef(users, addUser);
  }, []); // eslint-disable-line

  // ─── Notifications helper ─────────────────────────────────────────────────
  const pushNotification = useCallback((notif) => {
    setNotifications((prev) => [
      {
        ...notif,
        id: `n${Date.now()}${Math.random()}`,
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  // ─── Hostels ──────────────────────────────────────────────────────────────
  const addHostel = (data) => {
    const h = { ...data, id: `h${Date.now()}`, status: "active" };
    setHostels((prev) => [...prev, h]);
    return h;
  };
  const updateHostel = (id, updates) =>
    setHostels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  const deleteHostel = (id) =>
    setHostels((prev) => prev.filter((h) => h.id !== id));

  // ─── Rooms ────────────────────────────────────────────────────────────────
  const addRoom = (data) => {
    const r = { ...data, id: `r${Date.now()}`, status: "available" };
    setRooms((prev) => [...prev, r]);
    return r;
  };
  const updateRoom = (id, updates) =>
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  const deleteRoom = (id) =>
    setRooms((prev) => prev.filter((r) => r.id !== id));

  // ─── Fee Configs ──────────────────────────────────────────────────────────
  const addFeeConfig = (data) => {
    const fc = {
      ...data,
      id: `fc${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setFeeConfigs((prev) => [...prev, fc]);
    return fc;
  };
  const updateFeeConfig = (id, updates) =>
    setFeeConfigs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  const deleteFeeConfig = (id) =>
    setFeeConfigs((prev) => prev.filter((f) => f.id !== id));

  // ─── Applications ─────────────────────────────────────────────────────────
  const submitApplication = (data) => {
    // One active application per student per academic year
    const existing = applications.find(
      (a) =>
        a.studentId === data.studentId &&
        a.academicYear === data.academicYear &&
        ["pending", "approved"].includes(a.status)
    );
    if (existing)
      return {
        success: false,
        error: "You already have an active application for this academic year.",
      };

    const app = {
      ...data,
      id: `ap${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString().split("T")[0],
      reviewedAt: null,
      reviewNote: null,
      allocationId: null,
    };
    setApplications((prev) => [...prev, app]);
    pushNotification({
      type: "application_submitted",
      message: `New accommodation application from ${data.studentName}.`,
      role: "admin",
      linkTo: "/admin/applications",
    });
    return { success: true, application: app };
  };

  const approveApplication = (appId, roomId, reviewNote = "") => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return { success: false, error: "Application not found." };

    // Allocate room
    const allocResult = _allocateRoom(
      app.studentId,
      roomId,
      app.hostelId,
      app.academicYear
    );
    if (!allocResult.success) return allocResult;

    // Auto-generate payment instalments from fee config
    const fc = feeConfigs.find(
      (f) => f.hostelId === app.hostelId && f.academicYear === app.academicYear
    );
    if (fc) {
      const newPayments = fc.instalments.map((inst) => ({
        id: `p${Date.now()}${inst.number}`,
        studentId: app.studentId,
        allocationId: allocResult.allocation.id,
        hostelId: app.hostelId,
        feeConfigId: fc.id,
        instalmentNumber: inst.number,
        label: inst.label,
        academicYear: app.academicYear,
        amount: inst.amount,
        dueDate: inst.dueDate,
        paidDate: null,
        status: "unpaid",
        method: null,
      }));
      setPayments((prev) => [...prev, ...newPayments]);
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: "approved",
              reviewedAt: new Date().toISOString().split("T")[0],
              reviewNote,
              allocationId: allocResult.allocation.id,
            }
          : a
      )
    );

    // const student = users.find((u) => u.id === app.studentId);
    pushNotification({
      type: "application_approved",
      message: `Your accommodation application has been approved.`,
      role: "student",
      targetUserId: app.studentId,
      linkTo: "/student/room",
    });

    return { success: true };
  };

  const rejectApplication = (appId, reviewNote) => {
    const app = applications.find((a) => a.id === appId);
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: "rejected",
              reviewedAt: new Date().toISOString().split("T")[0],
              reviewNote,
            }
          : a
      )
    );
    pushNotification({
      type: "application_rejected",
      message: "Your accommodation application was not approved.",
      role: "student",
      targetUserId: app?.studentId,
      linkTo: "/student/apply",
    });
    return { success: true };
  };

  // ─── Allocations (internal) ───────────────────────────────────────────────
  const _allocateRoom = (studentId, roomId, hostelId, academicYear) => {
    const existing = allocations.find(
      (a) => a.studentId === studentId && a.status === "active"
    );
    if (existing)
      return {
        success: false,
        error: "Student already has an active room allocation.",
      };

    const room = rooms.find((r) => r.id === roomId);
    if (!room) return { success: false, error: "Room not found." };
    if (room.status === "maintenance")
      return { success: false, error: "Room is under maintenance." };

    const occupants = allocations.filter(
      (a) => a.roomId === roomId && a.status === "active"
    ).length;
    if (occupants >= room.capacity)
      return { success: false, error: "Room is at full capacity." };

    const newAlloc = {
      id: `a${Date.now()}`,
      studentId,
      roomId,
      hostelId,
      academicYear,
      startDate: new Date().toISOString().split("T")[0],
      endDate: `${parseInt(academicYear.split("/")[1])}-07-31`,
      status: "active",
    };
    setAllocations((prev) => [...prev, newAlloc]);

    // Only mark as occupied if now full
    if (occupants + 1 >= room.capacity) {
      updateRoom(roomId, { status: "occupied" });
    }

    return { success: true, allocation: newAlloc };
  };

  // Public manual allocation (admin can still do direct allocation)
  const allocateRoom = (studentId, roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return { success: false, error: "Room not found." };
    return _allocateRoom(studentId, roomId, room.hostelId, "2024/2025");
  };

  const deallocateRoom = (allocationId) => {
    const alloc = allocations.find((a) => a.id === allocationId);
    if (!alloc) return;
    setAllocations((prev) =>
      prev.map((a) =>
        a.id === allocationId ? { ...a, status: "inactive" } : a
      )
    );

    // Only set available if NO other active occupants remain
    const remaining = allocations.filter(
      (a) =>
        a.roomId === alloc.roomId &&
        a.status === "active" &&
        a.id !== allocationId
    ).length;
    if (remaining === 0) updateRoom(alloc.roomId, { status: "available" });
  };

  // ─── Payments ─────────────────────────────────────────────────────────────
  const updatePayment = (id, updates) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (updates.status === "overdue") {
      const p = payments.find((x) => x.id === id);
      pushNotification({
        type: "payment_overdue",
        message: `Payment overdue for ${p?.label}.`,
        role: "student",
        targetUserId: p?.studentId,
        linkTo: "/student/payments",
      });
    }
  };

  const addPayment = (data) => {
    const p = { ...data, id: `p${Date.now()}` };
    setPayments((prev) => [...prev, p]);
    return p;
  };

  // Auto-generate payments for all allocated students for a given fee config
  const generatePaymentsForFeeConfig = (feeConfigId) => {
    const fc = feeConfigs.find((f) => f.id === feeConfigId);
    if (!fc) return { success: false, error: "Fee config not found." };

    const activeAllocs = allocations.filter(
      (a) =>
        a.hostelId === fc.hostelId &&
        a.academicYear === fc.academicYear &&
        a.status === "active"
    );
    let generated = 0;

    const newPayments = [];
    activeAllocs.forEach((alloc) => {
      fc.instalments.forEach((inst) => {
        const exists = payments.find(
          (p) =>
            p.studentId === alloc.studentId &&
            p.feeConfigId === fc.id &&
            p.instalmentNumber === inst.number
        );
        if (!exists) {
          newPayments.push({
            id: `p${Date.now()}${inst.number}${alloc.id}`,
            studentId: alloc.studentId,
            allocationId: alloc.id,
            hostelId: fc.hostelId,
            feeConfigId: fc.id,
            instalmentNumber: inst.number,
            label: inst.label,
            academicYear: fc.academicYear,
            amount: inst.amount,
            dueDate: inst.dueDate,
            paidDate: null,
            status: "unpaid",
            method: null,
          });
          generated++;
        }
      });
    });

    setPayments((prev) => [...prev, ...newPayments]);
    return { success: true, generated };
  };

  // ─── Complaints ───────────────────────────────────────────────────────────
  const addComplaint = (data) => {
    const c = {
      ...data,
      id: `c${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setComplaints((prev) => [...prev, c]);
    pushNotification({
      type: "complaint_new",
      message: `New complaint: "${data.title}"`,
      role: "admin",
      linkTo: "/admin/complaints",
    });
    return c;
  };

  const updateComplaint = (id, updates) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updates,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : c
      )
    );
    if (updates.status === "resolved") {
      const c = complaints.find((x) => x.id === id);
      pushNotification({
        type: "complaint_resolved",
        message: `Your complaint "${c?.title}" has been resolved.`,
        role: "student",
        targetUserId: c?.studentId,
        linkTo: "/student/complaints",
      });
    }
  };

  // ─── Announcements ────────────────────────────────────────────────────────
  const addAnnouncement = (data) => {
    const a = {
      ...data,
      id: `an${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [a, ...prev]);
    return a;
  };
  const updateAnnouncement = (id, updates) =>
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  const deleteAnnouncement = (id) =>
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));

  return (
    <DataContext.Provider
      value={{
        // State
        users,
        hostels,
        rooms,
        allocations,
        feeConfigs,
        payments,
        complaints,
        announcements,
        applications,
        notifications,
        // Users
        addUser,
        // Hostels
        addHostel,
        updateHostel,
        deleteHostel,
        // Rooms
        addRoom,
        updateRoom,
        deleteRoom,
        // Fee Configs
        addFeeConfig,
        updateFeeConfig,
        deleteFeeConfig,
        generatePaymentsForFeeConfig,
        // Applications
        submitApplication,
        approveApplication,
        rejectApplication,
        // Allocations
        allocateRoom,
        deallocateRoom,
        // Payments
        updatePayment,
        addPayment,
        // Complaints
        addComplaint,
        updateComplaint,
        // Announcements
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        // Notifications
        pushNotification,
        markNotificationRead,
        markAllRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

DataProvider.propTypes = {
  children: node.isRequired,
};
