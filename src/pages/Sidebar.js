import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // استيراد axios
import {
  Home,
  Users,
  Briefcase,
  Layers,
  Settings,
  LogOut,
  Factory,
} from 'lucide-react';
import './Sidebar.css';

const SidebarItem = ({ icon: Icon, label, to, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <div
      className="sidebar-item"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post('http://localhost:5000/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      navigate('/'); // اعد التوجيه للصفحة الرئيسية
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <SidebarItem icon={Home} label="Dashboard" to="/admin" />
      <SidebarItem icon={Users} label="Manage Accounts" to="/AccountsDashboard" />
      <SidebarItem icon={Briefcase} label="Volunteer Opportunities" to="/AdminOpportunities" />
      <SidebarItem icon={Layers} label="Skills" to="/AdminSkills" />
     <SidebarItem icon={Factory} label="Industries" to="/AdminIndustries" />
      <SidebarItem icon={Settings} label="Settings" to="/admin/settings" />
      <div className="mt-auto">
        {/* هنا بدّلنا SidebarItem ليستخدم onClick لعملية logout */}
        <SidebarItem icon={LogOut} label="Logout" onClick={handleLogout} />
      </div>
    </aside>
  );
}
