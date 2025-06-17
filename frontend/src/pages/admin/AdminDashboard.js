import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  School,
  FileText,
  User,
} from "lucide-react";

import Logout from "../Logout";
import SideBar from "./SideBar";
import AdminProfile from "./AdminProfile";
import AdminHomePage from "./AdminHomePage";

import AddStudent from "./studentRelated/AddStudent";
import SeeComplains from "./studentRelated/SeeComplains";
import ShowStudents from "./studentRelated/ShowStudents";
import StudentAttendance from "./studentRelated/StudentAttendance";
import StudentExamMarks from "./studentRelated/StudentExamMarks";
import ViewStudent from "./studentRelated/ViewStudent";

import AddNotice from "./noticeRelated/AddNotice";
import ShowNotices from "./noticeRelated/ShowNotices";

import ShowSubjects from "./subjectRelated/ShowSubjects";
import SubjectForm from "./subjectRelated/SubjectForm";
import ViewSubject from "./subjectRelated/ViewSubject";

import AddTeacher from "./teacherRelated/AddTeacher";
import ChooseClass from "./teacherRelated/ChooseClass";
import ChooseSubject from "./teacherRelated/ChooseSubject";
import ShowTeachers from "./teacherRelated/ShowTeachers";
import TeacherDetails from "./teacherRelated/TeacherDetails";

import AddClass from "./classRelated/AddClass";
import ClassDetails from "./classRelated/ClassDetails";
import ShowClasses from "./classRelated/ShowClasses";
import AccountMenu from "../../components/AccountMenu";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard") || path === "/Admin/") return "Dashboard";
    if (path.includes("/profile")) return "Profile";
    if (path.includes("/students")) return "Students";
    if (path.includes("/teachers")) return "Teachers";
    if (path.includes("/classes")) return "Classes";
    if (path.includes("/subjects")) return "Subjects";
    if (path.includes("/notices")) return "Notices";
    if (path.includes("/complains")) return "Complaints";
    return "Admin Dashboard";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen bg-gray-200 flex overflow-hidden">
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen top-0
                fixed left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                ${sidebarOpen ? "lg:block" : "lg:w-16"}
            `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div
            className={`flex items-center gap-2 ${
              sidebarOpen ? "block" : "lg:hidden"
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">
              CCA Admin
            </span>
          </div>

          {/* Desktop sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="-ml-4 hidden lg:flex rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <School className="w-5 h-5 text-white" />
              </div>
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          <nav className="fixed flex-1 px-3 py-6 pb-20 space-y-2 h-full">
            <SideBar sidebarOpen={sidebarOpen} />
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop sidebar toggle - only show when sidebar is collapsed */}
              {!sidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="hidden lg:flex p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              {/* Page title */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {currentUser?.name || "Admin"}
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Search - hidden on mobile */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* Account menu */}
              <AccountMenu />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="">
            <Routes>
              <Route path="/" element={<AdminHomePage />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/Admin/dashboard" element={<AdminHomePage />} />
              <Route path="/Admin/profile" element={<AdminProfile />} />
              <Route path="/Admin/complains" element={<SeeComplains />} />

              {/* Notice */}
              <Route path="/Admin/addnotice" element={<AddNotice />} />
              <Route path="/Admin/notices" element={<ShowNotices />} />

              {/* Subject */}
              <Route path="/Admin/subjects" element={<ShowSubjects />} />
              <Route
                path="/Admin/subjects/subject/:classID/:subjectID"
                element={<ViewSubject />}
              />
              <Route
                path="/Admin/subjects/chooseclass"
                element={<ChooseClass situation="Subject" />}
              />

              <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
              <Route
                path="/Admin/class/subject/:classID/:subjectID"
                element={<ViewSubject />}
              />

              <Route
                path="/Admin/subject/student/attendance/:studentID/:subjectID"
                element={<StudentAttendance situation="Subject" />}
              />
              <Route
                path="/Admin/subject/student/marks/:studentID/:subjectID"
                element={<StudentExamMarks situation="Subject" />}
              />

              {/* Class */}
              <Route path="/Admin/addclass" element={<AddClass />} />
              <Route path="/Admin/classes" element={<ShowClasses />} />
              <Route
                path="/Admin/classes/class/:id"
                element={<ClassDetails />}
              />
              <Route
                path="/Admin/class/addstudents/:id"
                element={<AddStudent situation="Class" />}
              />

              {/* Student */}
              <Route
                path="/Admin/addstudents"
                element={<AddStudent situation="Student" />}
              />
              <Route path="/Admin/students" element={<ShowStudents />} />
              <Route
                path="/Admin/students/student/:id"
                element={<ViewStudent />}
              />
              <Route
                path="/Admin/students/student/attendance/:id"
                element={<StudentAttendance situation="Student" />}
              />
              <Route
                path="/Admin/students/student/marks/:id"
                element={<StudentExamMarks situation="Student" />}
              />

              {/* Teacher */}
              <Route path="/Admin/teachers" element={<ShowTeachers />} />
              <Route
                path="/Admin/teachers/teacher/:id"
                element={<TeacherDetails />}
              />
              <Route
                path="/Admin/teachers/chooseclass"
                element={<ChooseClass situation="Teacher" />}
              />
              <Route
                path="/Admin/teachers/choosesubject/:id"
                element={<ChooseSubject situation="Norm" />}
              />
              <Route
                path="/Admin/teachers/choosesubject/:classID/:teacherID"
                element={<ChooseSubject situation="Teacher" />}
              />
              <Route
                path="/Admin/teachers/addteacher/:id"
                element={<AddTeacher />}
              />

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
