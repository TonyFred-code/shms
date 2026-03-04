import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Building2,
  BedDouble,
  CreditCard,
  ClipboardList,
  FileText,
  ArrowRight,
  Megaphone,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Hostel Management",
    description:
      "Manage multiple hostel buildings, blocks, and floors from a single dashboard.",
  },
  {
    icon: BedDouble,
    title: "Room Allocation",
    description:
      "Allocate and track rooms with real-time occupancy across all hostels.",
  },
  {
    icon: FileText,
    title: "Accommodation Applications",
    description:
      "Students apply online. Admins review, approve, and assign rooms instantly.",
  },
  {
    icon: CreditCard,
    title: "Fee & Payments",
    description:
      "Configure annual fees per hostel with flexible instalment schedules.",
  },
  {
    icon: ClipboardList,
    title: "Maintenance Complaints",
    description:
      "Students report issues. Track resolution from submission to close.",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description: "Broadcast institutional notices to all students instantly.",
  },
];

export default function LandingPage() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e) => {
      const rect = grid.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      grid.style.setProperty("--mx", `${x}%`);
      grid.style.setProperty("--my", `${y}%`);
    };

    grid.addEventListener("mousemove", handleMouseMove);
    return () => grid.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="landing">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero" ref={gridRef}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />

        <header className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <Building2 size={16} />
            </div>
            <span>SHMS</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="btn-ghost">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary-sm">
              Get Started
            </Link>
          </div>
        </header>

        <div className="hero-body">
          <div className="mvp-badge">
            <span className="mvp-dot" />
            MVP — Phase 1 &nbsp;·&nbsp; Mock Data
          </div>

          <h1 className="hero-title">
            Hostel management,
            <br />
            <em>finally organised.</em>
          </h1>

          <p className="hero-sub">
            SHMS brings students and administrators onto one platform —
            applications, allocations, fees, complaints, and announcements, all
            in one place.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn-cta">
              Apply for Accommodation <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-outline">
              Admin Sign In
            </Link>
          </div>

          <p className="hero-note">
            This is an MVP running on simulated data. No real transactions
            occur.
          </p>
        </div>

        {/* Floating card */}
        <div className="hero-card" aria-hidden="true">
          <div className="hero-card-row">
            <Bell size={13} className="hero-card-icon" />
            <span>Application approved</span>
            <span className="hero-card-time">just now</span>
          </div>
          <div className="hero-card-room">
            <span className="hero-card-label">Room assigned</span>
            <span className="hero-card-value">NAH · Block A · 204</span>
          </div>
          <div className="hero-card-progress">
            <div className="hero-card-bar">
              <div className="hero-card-fill" style={{ width: "60%" }} />
            </div>
            <span>₦100,000 of ₦170,000 paid</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className="features">
        <div className="features-inner">
          <p className="section-label">What&apos;s included</p>
          <h2 className="section-title">Everything the hostel office needs</h2>

          <div className="features-grid">
            {features.map(({ icon: Icon, title, description }) => (
              <div className="feature-card" key={title}>
                <div className="feature-icon">
                  <Icon size={18} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ─────────────────────────────────────────────── */}
      <section className="roles">
        <div className="roles-inner">
          <div className="role-card role-student">
            <p className="role-label">For Students</p>
            <h3>Apply, track, and pay — all online.</h3>
            <p>
              Submit your accommodation application, monitor its status, view
              your room and roommates, track fee instalments, and file
              maintenance complaints without visiting any office.
            </p>
            <Link to="/register" className="role-btn">
              Register as Student <ArrowRight size={14} />
            </Link>
          </div>

          <div className="role-card role-admin">
            <p className="role-label">For Administrators</p>
            <h3>Full control, clear oversight.</h3>
            <p>
              Manage hostels, configure fees, review applications, allocate
              rooms, collect payments, resolve complaints, and publish
              announcements — from one dashboard.
            </p>
            <Link to="/login" className="role-btn">
              Admin Sign In <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-logo">
          <div className="nav-logo-icon">
            <Building2 size={14} />
          </div>
          <span>SHMS</span>
        </div>
        <p className="footer-copy">
          Smart Hostel Management System &nbsp;·&nbsp; Phase 1 MVP &nbsp;·&nbsp;
        </p>
      </footer>

      {/* ── STYLES ────────────────────────────────────────────── */}
      <style>{`
        /* ── Reset & base ───────────────────────────────────── */
        .landing {
          font-family: 'DM Sans', sans-serif;
          color: #0f1e3c;
          background: #f8f9fb;
          min-height: 100vh;
        }

        /* ── Nav ────────────────────────────────────────────── */
        .nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-family: 'DM Serif Display', serif;
          font-size: 1.125rem;
          color: #fff;
          text-decoration: none;
        }
        .nav-logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
        .btn-ghost {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          padding: 0.4rem 0.875rem;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .btn-primary-sm {
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f1e3c;
          background: #fff;
          text-decoration: none;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          transition: opacity 0.2s;
        }
        .btn-primary-sm:hover { opacity: 0.9; }

        /* ── Hero ───────────────────────────────────────────── */
        .hero {
          position: relative;
          background: #0f1e3c;
          overflow: hidden;
          padding-bottom: 6rem;
          --mx: 50%;
          --my: 50%;
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at var(--mx) var(--my), black 0%, transparent 70%);
          transition: mask-image 0.1s;
        }
        .hero-glow {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(74,122,181,0.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-body {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem 2rem;
          max-width: 680px;
          text-align: center;
        }
        .mvp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 0.3rem 0.875rem;
          margin-bottom: 2rem;
          letter-spacing: 0.02em;
        }
        .mvp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 6px #f59e0b;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.5rem, 6vw, 3.75rem);
          line-height: 1.1;
          color: #fff;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }
        .hero-title em {
          font-style: italic;
          color: #7aa8d8;
        }
        .hero-sub {
          font-size: 1.0625rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          margin: 0 0 2.25rem;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.875rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #0f1e3c;
          background: #fff;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.4);
        }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: background 0.15s, border-color 0.15s;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.35);
        }
        .hero-note {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          margin: 0;
        }

        /* ── Floating card ───────────────────────────────────── */
        .hero-card {
          position: absolute;
          bottom: 2.5rem;
          right: max(2rem, calc(50% - 520px));
          width: 240px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1rem;
          backdrop-filter: blur(12px);
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .hero-card-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.875rem;
        }
        .hero-card-icon { color: #4ade80; flex-shrink: 0; }
        .hero-card-time { margin-left: auto; color: rgba(255,255,255,0.35); font-size: 0.7rem; }
        .hero-card-room { margin-bottom: 0.875rem; }
        .hero-card-label {
          display: block;
          font-size: 0.675rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.2rem;
        }
        .hero-card-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8125rem;
          color: #fff;
          font-weight: 500;
        }
        .hero-card-progress { font-size: 0.675rem; color: rgba(255,255,255,0.4); }
        .hero-card-bar {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 0.375rem;
        }
        .hero-card-fill {
          height: 100%;
          background: linear-gradient(90deg, #4a7ab5, #7aa8d8);
          border-radius: 999px;
        }

        /* ── Features ────────────────────────────────────────── */
        .features {
          padding: 6rem 2rem;
          background: #fff;
        }
        .features-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a7ab5;
          margin: 0 0 0.75rem;
        }
        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          color: #0f1e3c;
          margin: 0 0 3rem;
          max-width: 480px;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .feature-card {
          padding: 1.75rem;
          border: 1px solid #e8edf5;
          border-radius: 16px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          border-color: #c8ddf0;
          box-shadow: 0 8px 32px rgba(15,30,60,0.07);
          transform: translateY(-2px);
        }
        .feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #eef4fb;
          color: #4a7ab5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .feature-card h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.0625rem;
          color: #0f1e3c;
          margin: 0 0 0.5rem;
        }
        .feature-card p {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.65;
          margin: 0;
        }

        /* ── Roles ───────────────────────────────────────────── */
        .roles {
          padding: 6rem 2rem;
          background: #f8f9fb;
        }
        .roles-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .role-card {
          padding: 2.5rem;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }
        .role-student {
          background: #0f1e3c;
          color: #fff;
        }
        .role-admin {
          background: #fff;
          border: 1px solid #e8edf5;
          color: #0f1e3c;
        }
        .role-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 0.875rem;
        }
        .role-student .role-label { color: #7aa8d8; }
        .role-admin .role-label { color: #4a7ab5; }
        .role-card h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.375rem;
          margin: 0 0 0.875rem;
          line-height: 1.3;
        }
        .role-card p {
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0 0 2rem;
        }
        .role-student p { color: rgba(255,255,255,0.6); }
        .role-admin p { color: #64748b; }
        .role-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          padding: 0.625rem 1.25rem;
          border-radius: 10px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .role-btn:hover { opacity: 0.85; transform: translateX(2px); }
        .role-student .role-btn { background: #fff; color: #0f1e3c; }
        .role-admin .role-btn { background: #0f1e3c; color: #fff; }

        /* ── Footer ──────────────────────────────────────────── */
        .footer {
          border-top: 1px solid #e8edf5;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          color: #0f1e3c;
        }
        .footer-logo .nav-logo-icon {
          background: #eef4fb;
          color: #4a7ab5;
        }
        .footer-copy {
          font-size: 0.8125rem;
          color: #94a3b8;
          margin: 0;
        }
        .footer-copy a {
          color: #4a7ab5;
          text-decoration: none;
        }
        .footer-copy a:hover { text-decoration: underline; }

        /* ── Responsive ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .hero-card { display: none; }
          .hero-body { padding: 3rem 1.5rem 2rem; }
          .nav { padding: 1rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
