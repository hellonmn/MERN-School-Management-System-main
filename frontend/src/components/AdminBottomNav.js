import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  School,
  Bell,
  Users,
  User
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/admin/dashboard",
  },
  {
    label: "Classes",
    icon: School,
    to: "/admin/classes",
  },
  {
    label: "Notices",
    icon: Bell,
    to: "/admin/notices",
  },
  {
    label: "Students",
    icon: Users,
    to: "/admin/students",
  },
  {
    label: "Profile",
    icon: User,
    to: "/admin/profile",
  },
];

const AdminBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="admin-bottom-nav-modern">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={
              `admin-bottom-nav-modern__item${isActive ? " active" : ""}`
            }
          >
            <span className="admin-bottom-nav-modern__icon-label">
              <span className={`admin-bottom-nav-modern__icon-bg${isActive ? " active" : ""}`}>
                <Icon className="admin-bottom-nav-modern__icon" />
              </span>
              <span className={`admin-bottom-nav-modern__label${isActive ? " active" : ""}`}>{item.label}</span>
            </span>
            {isActive && <span className="admin-bottom-nav-modern__indicator" />}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default AdminBottomNav;

// Add the following CSS to index.css or a new CSS file:
/*
.admin-bottom-nav-custom {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 95vw;
  max-width: 500px;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 4px 24px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.07);
  border-radius: 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  padding: 0 8px;
  height: 64px;
  border: 1px solid #e0e7ef;
}
.admin-bottom-nav-custom__item {
  flex: 1;
  text-align: center;
  color: #7b8794;
  text-decoration: none;
  padding: 8px 0 2px 0;
  transition: color 0.2s, background 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  border-radius: 16px;
  position: relative;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.admin-bottom-nav-custom__item:active {
  background: #f0f4fa;
}
.admin-bottom-nav-custom__item.active {
  color: #2563eb;
  background: #e0e7ff;
}
.admin-bottom-nav-custom__icon {
  font-size: 24px;
  margin-bottom: 2px;
}
.admin-bottom-nav-custom__label {
  font-size: 11px;
  font-weight: 500;
}
.admin-bottom-nav-fab-wrapper {
  flex: 0 0 64px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  top: -28px;
  z-index: 2;
}
.admin-bottom-nav-fab {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #2563eb 60%, #6366f1 100%);
  color: #fff;
  border-radius: 50%;
  border: none;
  box-shadow: 0 4px 16px rgba(37,99,235,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -16px;
  transition: box-shadow 0.2s;
  outline: none;
  cursor: pointer;
}
.admin-bottom-nav-fab:active {
  box-shadow: 0 2px 8px rgba(37,99,235,0.12);
}
@media (min-width: 768px) {
  .admin-bottom-nav-custom {
    display: none;
  }
}
*/ 