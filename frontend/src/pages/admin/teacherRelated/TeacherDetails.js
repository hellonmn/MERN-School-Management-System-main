import React, { useEffect, useState } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    GraduationCap, 
    User, 
    School, 
    BookOpen, 
    Clock, 
    Plus, 
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Award,
    MapPin,
    Settings,
    Eye,
    TrendingUp,
    Users
} from 'lucide-react';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);
    const [activeTab, setActiveTab] = useState("overview");

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    const tabs = [
        { 
            id: "overview", 
            label: "Overview", 
            icon: <Settings className="w-4 h-4" />
        },
        {
            id: "academic",
            label: "Academic Info",
            icon: <BookOpen className="w-4 h-4" />
        },
        { 
            id: "personal", 
            label: "Personal Info", 
            icon: <User className="w-4 h-4" />
        },
        {
            id: "performance",
            label: "Performance",
            icon: <TrendingUp className="w-4 h-4" />
        },
    ];

    const StatCard = ({ icon, title, value, color = "indigo", action = null }) => {
        const colorClasses = {
            indigo: "bg-indigo-500",
            green: "bg-green-500",
            purple: "bg-purple-500",
            orange: "bg-orange-500",
            red: "bg-red-500"
        };

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                            <p className="text-2xl font-bold text-gray-900">{value || 'N/A'}</p>
                        </div>
                    </div>
                    {action && (
                        <div className="ml-4">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const InfoCard = ({ icon, label, value, color = "indigo" }) => {
        const colorClasses = {
            indigo: "text-indigo-500",
            green: "text-green-500",
            purple: "text-purple-500",
            orange: "text-orange-500"
        };

        return (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className={`${colorClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-gray-900 font-medium">{value || 'Not specified'}</p>
                </div>
            </div>
        );
    };

    const OverviewSection = () => (
        <div className="flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<School className="w-6 h-6" />}
                    title="Assigned Class"
                    value={teacherDetails?.teachSclass?.sclassName}
                    color="indigo"
                />
                
                {isSubjectNamePresent ? (
                    <>
                        <StatCard 
                            icon={<BookOpen className="w-6 h-6" />}
                            title="Teaching Subject"
                            value={teacherDetails.teachSubject.subName}
                            color="green"
                        />
                        <StatCard 
                            icon={<Clock className="w-6 h-6" />}
                            title="Total Sessions"
                            value={teacherDetails.teachSubject.sessions}
                            color="purple"
                        />
                        <StatCard 
                            icon={<Users className="w-6 h-6" />}
                            title="Students"
                            value="24"
                            color="orange"
                        />
                    </>
                ) : (
                    <StatCard 
                        icon={<Plus className="w-6 h-6" />}
                        title="Subject Assignment"
                        value="Not Assigned"
                        color="orange"
                        action={
                            <button
                                onClick={handleAddSubject}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                            >
                                Add Subject
                            </button>
                        }
                    />
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate(`/Admin/teachers/edit/${teacherID}`)}
                        className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
                    >
                        <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800 group-hover:text-gray-100">Edit Profile</p>
                            <p className="text-xs text-gray-600 group-hover:text-gray-300">Update information</p>
                        </div>
                    </button>
                    
                    {!isSubjectNamePresent && (
                        <button
                            onClick={handleAddSubject}
                            className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
                        >
                            <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800 group-hover:text-gray-100">Assign Subject</p>
                                <p className="text-xs text-gray-600 group-hover:text-gray-300">Add teaching subject</p>
                            </div>
                        </button>
                    )}
                    
                    <button
                        onClick={() => navigate(`/Admin/teachers/schedule/${teacherID}`)}
                        className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
                    >
                        <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800 group-hover:text-gray-100">View Schedule</p>
                            <p className="text-xs text-gray-600 group-hover:text-gray-300">Check timetable</p>
                        </div>
                    </button>
                    
                    <button
                        onClick={() => navigate("/Admin/teachers")}
                        className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
                    >
                        <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800 group-hover:text-gray-100">Back to Teachers</p>
                            <p className="text-xs text-gray-600 group-hover:text-gray-300">Return to overview</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Subject Assignment Alert */}
            {!isSubjectNamePresent && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-orange-800">Subject Assignment Required</h4>
                            <p className="text-orange-700 mt-1">
                                This teacher needs to be assigned a subject to start teaching. Click the button below to assign a subject.
                            </p>
                        </div>
                        <button
                            onClick={handleAddSubject}
                            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            Assign Subject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const AcademicSection = () => (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-500" />
                Academic Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InfoCard 
                    icon={<School className="w-5 h-5" />}
                    label="Assigned Class"
                    value={teacherDetails?.teachSclass?.sclassName}
                    color="indigo"
                />
                <InfoCard 
                    icon={<BookOpen className="w-5 h-5" />}
                    label="Teaching Subject"
                    value={teacherDetails?.teachSubject?.subName || 'Not assigned'}
                    color="green"
                />
                <InfoCard 
                    icon={<Clock className="w-5 h-5" />}
                    label="Subject Sessions"
                    value={teacherDetails?.teachSubject?.sessions || 'N/A'}
                    color="purple"
                />
                <InfoCard 
                    icon={<Calendar className="w-5 h-5" />}
                    label="Join Date"
                    value={teacherDetails?.joinDate || 'Not specified'}
                    color="orange"
                />
            </div>
        </div>
    );

    const PersonalSection = () => (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Personal Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InfoCard 
                    icon={<User className="w-5 h-5" />}
                    label="Full Name"
                    value={teacherDetails?.name}
                    color="indigo"
                />
                <InfoCard 
                    icon={<Mail className="w-5 h-5" />}
                    label="Email Address"
                    value={teacherDetails?.email || 'Not provided'}
                    color="green"
                />
                <InfoCard 
                    icon={<Phone className="w-5 h-5" />}
                    label="Phone Number"
                    value={teacherDetails?.phone || 'Not provided'}
                    color="purple"
                />
                <InfoCard 
                    icon={<MapPin className="w-5 h-5" />}
                    label="Address"
                    value={teacherDetails?.address || 'Not provided'}
                    color="orange"
                />
            </div>
        </div>
    );

    const PerformanceSection = () => (
        <div className="flex flex-col justify-center items-center gap-5 text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Performance Analytics
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Teacher performance tracking and analytics features are coming soon. Stay tuned for comprehensive insights!
            </p>
            <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-colors">
                Coming Soon
            </button>
        </div>
    );

    const LoadingState = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-8">
                    {/* Header skeleton */}
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    
                    {/* Profile skeleton */}
                    <div className="bg-white rounded-xl p-8 space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stats skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 space-y-3">
                                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewSection />;
            case "academic":
                return <AcademicSection />;
            case "personal":
                return <PersonalSection />;
            case "performance":
                return <PerformanceSection />;
            default:
                return <OverviewSection />;
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/Admin/teachers")}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {teacherDetails ? `${teacherDetails.name}` : 'Teacher Details'}
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    ID: {teacherDetails?._id?.slice(-6) || 'Loading...'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Teacher Avatar and Status */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        <School className="w-3 h-3 mr-1" />
                                        {teacherDetails?.teachSclass?.sclassName || 'No Class'}
                                    </span>
                                    {isSubjectNamePresent ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <BookOpen className="w-3 h-3 mr-1" />
                                            {teacherDetails.teachSubject.subName}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Tabs */}
                    <div className="flex space-x-1 pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative ${
                                    activeTab === tab.id
                                        ? "bg-indigo-100 text-indigo-500"
                                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default TeacherDetails;