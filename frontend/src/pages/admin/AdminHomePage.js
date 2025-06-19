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
    Eye,
    ChevronRight,
    Zap,
    Star
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
                <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">No notices yet</h4>
                    <p className="text-sm text-gray-500 mb-3">Create your first notice</p>
                    <button className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        <Plus className="w-4 h-4" />
                        Create Notice
                    </button>
                </div>
            );
        }

        // Show only the latest 2 notices on mobile, 3 on desktop
        const recentNotices = noticesList.slice(0, 2);

        return (
            <div className="space-y-3">
                {recentNotices.map((notice) => (
                    <div key={notice._id} className="group p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-all duration-200 active:scale-[0.98]">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm line-clamp-1">
                                    {notice.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {notice.details}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(notice.date)}</span>
                                    <span>•</span>
                                    <span>{getTimeAgo(notice.date)}</span>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                    </div>
                ))}
                
                {noticesList.length > 2 && (
                    <button className="w-full text-center py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                        View {noticesList.length - 2} more notices
                    </button>
                )}
            </div>
        );
    };

    const StatCard = ({ icon, title, value, change, color, prefix = "", suffix = "" }) => {
        const colorClasses = {
            blue: {
                bg: "bg-gradient-to-br from-blue-500 to-blue-600",
                light: "bg-gradient-to-br from-blue-50 to-blue-100",
                text: "text-blue-600",
                accent: "text-blue-500",
                shadow: "shadow-blue-200"
            },
            green: {
                bg: "bg-gradient-to-br from-green-500 to-green-600", 
                light: "bg-gradient-to-br from-green-50 to-green-100",
                text: "text-green-600",
                accent: "text-green-500",
                shadow: "shadow-green-200"
            },
            purple: {
                bg: "bg-gradient-to-br from-purple-500 to-purple-600",
                light: "bg-gradient-to-br from-purple-50 to-purple-100", 
                text: "text-purple-600",
                accent: "text-purple-500",
                shadow: "shadow-purple-200"
            },
            orange: {
                bg: "bg-gradient-to-br from-orange-500 to-orange-600",
                light: "bg-gradient-to-br from-orange-50 to-orange-100",
                text: "text-orange-600", 
                accent: "text-orange-500",
                shadow: "shadow-orange-200"
            }
        };

        return (
            <div className={`bg-white rounded-3xl p-5 lg:p-6 shadow-lg ${colorClasses[color].shadow} border border-gray-100 hover:shadow-xl transition-all duration-300 group active:scale-[0.97]`}>
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 ${colorClasses[color].light} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <div className={colorClasses[color].text}>
                            {icon}
                        </div>
                    </div>
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 ${colorClasses[color].bg} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                </div>
                
                <div className="mb-3">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {prefix}
                        <CountUp 
                            start={0} 
                            end={value || 0} 
                            duration={2.5}
                            separator=","
                        />
                        {suffix}
                    </div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                </div>
                
                {change && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">{change}</span>
                    </div>
                )}
            </div>
        );
    };

    const QuickActionCard = ({ icon, title, description, action, color }) => {
        const colorClasses = {
            blue: "from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 shadow-blue-200",
            green: "from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-green-200", 
            purple: "from-purple-500 via-purple-600 to-violet-600 hover:from-purple-600 hover:via-purple-700 hover:to-violet-700 shadow-purple-200",
            orange: "from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 shadow-orange-200"
        };

        return (
            <button 
                onClick={action}
                className={`w-full p-5 bg-gradient-to-br ${colorClasses[color]} text-white rounded-3xl transition-all duration-300 text-left group hover:shadow-2xl active:scale-[0.97] shadow-lg`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white mb-1 text-lg">{title}</h4>
                        <p className="text-sm text-white/90">{description}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
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
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors active:scale-[0.98]">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{title}</p>
                    <p className="text-xs text-gray-500">{time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} flex-shrink-0`}>
                    {status === 'success' ? 'Done' : status === 'warning' ? 'Pending' : 'Active'}
                </span>
            </div>
        );
    };

    const PerformanceCard = ({ icon, title, value, color }) => {
        const colorClasses = {
            blue: "from-blue-50 to-indigo-50 text-blue-600",
            green: "from-green-50 to-emerald-50 text-green-600",
            purple: "from-purple-50 to-violet-50 text-purple-600"
        };

        return (
            <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-4 active:scale-[0.98] transition-transform`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10">
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs lg:text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-xl lg:text-2xl font-bold">{value}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Mobile Header */}
                <div className="mb-8 lg:mb-8">
                    {/* Greeting Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                                    <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center">
                                        <span className="text-lg">👋</span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                        {getCurrentGreeting()}!
                                    </h1>
                                    <p className="text-gray-600 text-sm lg:text-base">
                                        Welcome back, {currentUser?.name}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Date Badge */}
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl px-4 py-3 shadow-lg">
                                <div className="flex items-center gap-2 text-sm text-white">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-medium">{new Date().toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards - Mobile Optimized Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-8">
                    <StatCard
                        icon={<Users className="w-6 h-6 lg:w-7 lg:h-7" />}
                        title="Students"
                        value={numberOfStudents}
                        change="+12%"
                        color="blue"
                    />
                    <StatCard
                        icon={<School className="w-6 h-6 lg:w-7 lg:h-7" />}
                        title="Classes"
                        value={numberOfClasses}
                        change="+2 new"
                        color="green"
                    />
                    <StatCard
                        icon={<GraduationCap className="w-6 h-6 lg:w-7 lg:h-7" />}
                        title="Teachers"
                        value={numberOfTeachers}
                        change="+3 new"
                        color="purple"
                    />
                    <StatCard
                        icon={<DollarSign className="w-6 h-6 lg:w-7 lg:h-7" />}
                        title="Revenue"
                        value={23}
                        change="+8%"
                        color="orange"
                        prefix="$"
                        suffix="K"
                    />
                </div>

                {/* Mobile-First Layout */}
                <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
                    
                    {/* Main Content - Full width on mobile */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Quick Actions - Prominent on mobile */}
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8">
                            <div className="flex items-center gap-4 mb-6 lg:mb-8">
                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Zap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                                    <p className="text-sm text-gray-500">Get things done faster</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <QuickActionCard
                                    icon={<Users className="w-6 h-6" />}
                                    title="Add Student"
                                    description="Enroll new student"
                                    color="blue"
                                    action={() => console.log('Add student')}
                                />
                                <QuickActionCard
                                    icon={<GraduationCap className="w-6 h-6" />}
                                    title="Add Teacher"
                                    description="Register new teacher"
                                    color="green"
                                    action={() => console.log('Add teacher')}
                                />
                                <QuickActionCard
                                    icon={<BookOpen className="w-6 h-6" />}
                                    title="Create Class"
                                    description="Set up new class"
                                    color="purple"
                                    action={() => console.log('Add class')}
                                />
                                <QuickActionCard
                                    icon={<Bell className="w-6 h-6" />}
                                    title="Post Notice"
                                    description="Share announcement"
                                    color="orange"
                                    action={() => console.log('Add notice')}
                                />
                            </div>
                        </div>

                        {/* Performance Overview */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                                    <p className="text-sm text-gray-500">School metrics overview</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                                <PerformanceCard
                                    icon={<Target className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />}
                                    title="Attendance"
                                    value="94.5%"
                                    color="blue"
                                />
                                <PerformanceCard
                                    icon={<Award className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />}
                                    title="Pass Rate"
                                    value="89.2%"
                                    color="green"
                                />
                                <PerformanceCard
                                    icon={<Activity className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />}
                                    title="Active Classes"
                                    value={numberOfClasses || 0}
                                    color="purple"
                                />
                            </div>
                        </div>

                        {/* Notices - Compact on mobile */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 lg:p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Recent Notices</h3>
                                            <p className="text-sm text-gray-500 hidden lg:block">Latest announcements</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                                        View All
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 lg:p-6">
                                <NoticeCards />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Stacked on mobile */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                                    <p className="text-sm text-gray-500">Latest updates</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
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
                                    title="Teacher assignment"
                                    time="1 day ago"
                                    status="warning"
                                />
                                <ActivityItem
                                    icon={<BookOpen className="w-4 h-4 text-purple-600" />}
                                    title="Schedule updated"
                                    time="2 days ago"
                                    status="success"
                                />
                            </div>
                            
                            <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
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