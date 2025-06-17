import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { getAllNotices } from '../../redux/noticeRelated/noticeHandle';
import CountUp from 'react-countup';
import { 
    Users, 
    GraduationCap, 
    BookOpen, 
    DollarSign, 
    TrendingUp, 
    Calendar,
    Bell,
    Activity,
    Award,
    Clock,
    Plus,
    ArrowUpRight,
    BarChart3,
    Target,
    School,
    AlertCircle,
    Eye
} from 'lucide-react';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { noticesList } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
        dispatch(getAllNotices(adminID, "Notice"));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    // Get current time for greeting
    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Format date for notices
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (date.toString() === "Invalid Date") return "Invalid Date";
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    const NoticeCards = () => {
        if (!noticesList || noticesList.length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No notices yet</h4>
                    <p className="text-gray-500 mb-4">Create your first notice to keep everyone informed.</p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Plus className="w-4 h-4" />
                        Create Notice
                    </button>
                </div>
            );
        }

        // Show only the latest 3 notices
        const recentNotices = noticesList.slice(0, 3);

        return (
            <div className="flex flex-col gap-4">
                {recentNotices.map((notice) => (
                    <div key={notice._id} className="group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                                        <AlertCircle className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {notice.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {notice.details}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(notice.date)}</span>
                                            </div>
                                            <span>•</span>
                                            <span>{getTimeAgo(notice.date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                
                {noticesList.length > 3 && (
                    <div className="text-center pt-2">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                            View {noticesList.length - 3} more notices
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const StatCard = ({ icon, title, value, change, color, prefix = "", suffix = "" }) => {
        const colorClasses = {
            blue: {
                bg: "bg-blue-500",
                light: "bg-blue-50",
                text: "text-blue-600",
                accent: "text-blue-500"
            },
            green: {
                bg: "bg-green-500", 
                light: "bg-green-50",
                text: "text-green-600",
                accent: "text-green-500"
            },
            purple: {
                bg: "bg-purple-500",
                light: "bg-purple-50", 
                text: "text-purple-600",
                accent: "text-purple-500"
            },
            orange: {
                bg: "bg-orange-500",
                light: "bg-orange-50",
                text: "text-orange-600", 
                accent: "text-orange-500"
            }
        };

        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 ${colorClasses[color].light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <div className={colorClasses[color].text}>
                                    {icon}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                                {change && (
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                        <span className="text-xs text-green-600 font-medium">{change}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">
                                {prefix}
                                <CountUp 
                                    start={0} 
                                    end={value || 0} 
                                    duration={2.5}
                                    separator=","
                                />
                                {suffix}
                            </span>
                        </div>
                    </div>
                    <div className={`w-8 h-8 ${colorClasses[color].bg} rounded-lg flex items-center justify-center text-white opacity-80 group-hover:opacity-100 transition-opacity`}>
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        );
    };

    const QuickActionCard = ({ icon, title, description, action, color }) => {
        const colorClasses = {
            blue: "hover:bg-blue-50 border-blue-200 text-blue-700",
            green: "hover:bg-green-50 border-green-200 text-green-700", 
            purple: "hover:bg-purple-50 border-purple-200 text-purple-700",
            orange: "hover:bg-orange-50 border-orange-200 text-orange-700"
        };

        return (
            <button 
                onClick={action}
                className={`w-full p-4 bg-white rounded-xl border-2 border-gray-100 ${colorClasses[color]} transition-all duration-200 text-left group hover:shadow-md`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-current transition-colors">{title}</h4>
                        <p className="text-sm text-gray-500 group-hover:text-current/70 transition-colors">{description}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
            </button>
        );
    };

    const ActivityItem = ({ icon, title, time, status }) => {
        const statusColors = {
            success: "bg-green-100 text-green-800",
            warning: "bg-orange-100 text-orange-800", 
            info: "bg-blue-100 text-blue-800"
        };

        return (
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{title}</p>
                    <p className="text-xs text-gray-500">{time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                    {status === 'success' ? 'Completed' : status === 'warning' ? 'Pending' : 'In Progress'}
                </span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {getCurrentGreeting()}, {currentUser?.name}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Here's what's happening at your school today.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date().toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        title="Total Students"
                        value={numberOfStudents}
                        change="+12% from last month"
                        color="blue"
                    />
                    <StatCard
                        icon={<School className="w-6 h-6" />}
                        title="Total Classes"
                        value={numberOfClasses}
                        change="+2 new this semester"
                        color="green"
                    />
                    <StatCard
                        icon={<GraduationCap className="w-6 h-6" />}
                        title="Total Teachers"
                        value={numberOfTeachers}
                        change="+3 recently joined"
                        color="purple"
                    />
                    <StatCard
                        icon={<DollarSign className="w-6 h-6" />}
                        title="Fees Collection"
                        value={23000}
                        change="+8% this month"
                        color="orange"
                        prefix="$"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Notices and Quick Stats */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Notice Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Bell className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Recent Notices</h3>
                                            <p className="text-sm text-gray-500">Latest announcements and updates</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                                        View All
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <NoticeCards />
                            </div>
                        </div>

                        {/* Performance Overview */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                                        <p className="text-sm text-gray-500">School metrics at a glance</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Target className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                                            <p className="text-2xl font-bold text-blue-600">94.5%</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-8 h-8 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                                            <p className="text-2xl font-bold text-green-600">89.2%</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-8 h-8 text-purple-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active Classes</p>
                                            <p className="text-2xl font-bold text-purple-600">{numberOfClasses || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Actions and Recent Activity */}
                    <div className="flex flex-col gap-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                                    <p className="text-sm text-gray-500">Common tasks and shortcuts</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <QuickActionCard
                                    icon={<Users className="w-5 h-5" />}
                                    title="Add New Student"
                                    description="Enroll a new student"
                                    color="blue"
                                    action={() => console.log('Add student')}
                                />
                                <QuickActionCard
                                    icon={<GraduationCap className="w-5 h-5" />}
                                    title="Add New Teacher"
                                    description="Register a new teacher"
                                    color="green"
                                    action={() => console.log('Add teacher')}
                                />
                                <QuickActionCard
                                    icon={<BookOpen className="w-5 h-5" />}
                                    title="Create Class"
                                    description="Set up a new class"
                                    color="purple"
                                    action={() => console.log('Add class')}
                                />
                                <QuickActionCard
                                    icon={<Bell className="w-5 h-5" />}
                                    title="Post Notice"
                                    description="Share an announcement"
                                    color="orange"
                                    action={() => console.log('Add notice')}
                                />
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                    <p className="text-sm text-gray-500">Latest system activities</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <ActivityItem
                                    icon={<Users className="w-4 h-4 text-blue-600" />}
                                    title="New student enrolled"
                                    time="2 hours ago"
                                    status="success"
                                />
                                <ActivityItem
                                    icon={<Bell className="w-4 h-4 text-orange-600" />}
                                    title="Notice published"
                                    time="4 hours ago"
                                    status="info"
                                />
                                <ActivityItem
                                    icon={<GraduationCap className="w-4 h-4 text-green-600" />}
                                    title="Teacher assignment pending"
                                    time="1 day ago"
                                    status="warning"
                                />
                                <ActivityItem
                                    icon={<BookOpen className="w-4 h-4 text-purple-600" />}
                                    title="Class schedule updated"
                                    time="2 days ago"
                                    status="success"
                                />
                            </div>
                            
                            <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                View All Activities
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;