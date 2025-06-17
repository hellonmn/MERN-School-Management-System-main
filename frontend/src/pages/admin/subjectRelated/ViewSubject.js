import React, { useEffect, useState } from 'react';
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import StudentAttendanceModal from './StudentAttendanceModal';
import StudentMarksModal from './StudentMarksModal';
import { 
    BookOpen, 
    Users, 
    ClipboardCheck, 
    GraduationCap, 
    Eye, 
    UserPlus,
    ArrowLeft,
    Settings,
    BarChart3,
    Calendar,
    Hash,
    Clock,
    School,
    UserCheck,
    Search,
    Trash2,
    UserMinus,
    Plus,
    TrendingUp,
    Award
} from 'lucide-react';

const ViewSubject = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

    const { classID, subjectID } = params;
    const [activeTab, setActiveTab] = useState('details');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showMarksModal, setShowMarksModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    if (error) {
        console.log(error);
    }

    const tabs = [
        { 
            id: "details", 
            label: "Overview", 
            icon: <Settings className="w-4 h-4" />,
            count: null
        },
        { 
            id: "students", 
            label: "Students", 
            icon: <Users className="w-4 h-4" />,
            count: sclassStudents?.length || 0
        },
        {
            id: "attendance",
            label: "Attendance",
            icon: <ClipboardCheck className="w-4 h-4" />,
            count: null
        },
        {
            id: "marks",
            label: "Marks",
            icon: <BarChart3 className="w-4 h-4" />,
            count: null
        },
    ];

    const StatCard = ({ icon, title, value, color = "indigo", trend = null }) => {
        const colorClasses = {
            indigo: "bg-indigo-500",
            green: "bg-green-500", 
            purple: "bg-purple-500",
            orange: "bg-orange-500",
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
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const SubjectDetailsSection = () => {
        const numberOfStudents = sclassStudents?.length || 0;

        return (
            <div className="flex flex-col gap-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Clock className="w-6 h-6" />}
                        title="Total Sessions"
                        value={subjectDetails?.sessions || 0}
                        color="indigo"
                    />
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        title="Enrolled Students"
                        value={numberOfStudents}
                        color="green"
                    />
                    <StatCard
                        icon={<ClipboardCheck className="w-6 h-6" />}
                        title="Attendance Rate"
                        value="95%"
                        color="purple"
                    />
                    <StatCard
                        icon={<Award className="w-6 h-6" />}
                        title="Average Score"
                        value="85%"
                        color="orange"
                    />
                </div>

                {/* Subject Information */}
                <div className="flex flex-col gap-2 bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-gray-600" />
                        Subject Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Subject Name</p>
                                    <p className="text-gray-900 font-semibold">{subjectDetails?.subName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Hash className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Subject Code</p>
                                    <p className="text-gray-900 font-semibold">{subjectDetails?.subCode || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Clock className="w-5 h-5 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                                    <p className="text-gray-900 font-semibold">{subjectDetails?.sessions || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <School className="w-5 h-5 text-orange-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Class</p>
                                    <p className="text-gray-900 font-semibold">{subjectDetails?.sclassName?.sclassName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Users className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Students Enrolled</p>
                                    <p className="text-gray-900 font-semibold">{numberOfStudents}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-pink-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Teacher</p>
                                    <p className="text-gray-900 font-semibold">{subjectDetails?.teacher?.name || 'Not Assigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2 bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
                        >
                            <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800 group-hover:text-gray-100">Add Students</p>
                                <p className="text-xs text-gray-600 group-hover:text-gray-300">Enroll new students</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate("/Admin/teachers/addteacher/" + subjectID)}
                            className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
                        >
                            <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800 group-hover:text-gray-100">Assign Teacher</p>
                                <p className="text-xs text-gray-600 group-hover:text-gray-300">Add subject teacher</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate("/Admin/subjects")}
                            className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
                        >
                            <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-800 group-hover:text-gray-100">Back to Subjects</p>
                                <p className="text-xs text-gray-600 group-hover:text-gray-300">Return to overview</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Teacher Assignment Alert */}
                {!subjectDetails?.teacher && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-yellow-800">No Teacher Assigned</h4>
                                <p className="text-yellow-700">This subject needs a teacher to manage classes and assessments.</p>
                            </div>
                            <button
                                onClick={() => navigate("/Admin/teachers/addteacher/" + subjectID)}
                                className="px-6 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                            >
                                Add Teacher
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Filter students based on search term
    const filteredStudents = sclassStudents?.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNum.toString().includes(searchTerm)
    ) || [];

    // Student Card Component
    const StudentCard = ({ student }) => {
        const handleAttendanceClick = () => {
            setSelectedStudent(student._id);
            setShowAttendanceModal(true);
        };

        const handleMarksClick = () => {
            setSelectedStudent(student._id);
            setShowMarksModal(true);
        };

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 ring-1 ring-offset-2 hover:ring-offset-indigo-200 ring-transparent hover:ring-indigo-300 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                    <button 
                        className="flex items-center gap-3 cursor-pointer w-full" 
                        onClick={() => navigate("/Admin/students/student/" + student._id)}
                    >
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                                {student.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                Roll No: {student.rollNum}
                            </p>
                        </div>
                    </button>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={handleAttendanceClick}
                            className="flex-1 px-3 py-2.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-sm cursor-pointer"
                        >
                            Attendance
                        </button>
                        <button
                            onClick={handleMarksClick}
                            className="flex-1 px-3 py-2.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm cursor-pointer"
                        >
                            Marks
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const SubjectStudentsSection = () => {
        return (
            <div className="flex flex-col gap-6">
                {getresponse ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No Students Enrolled Yet
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Add students to this class to start managing attendance and grades for this subject.
                        </p>
                        <button
                            onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Students
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Search and Header */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                                    <span className="text-sm text-gray-700 font-medium">
                                        {filteredStudents.length} of {sclassStudents?.length || 0} student(s)
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl outline-0 focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add Student
                                </button>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((student) => (
                                <StudentCard key={student._id} student={student} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const AttendanceSection = () => {
        return (
            <div className="flex flex-col justify-center items-center gap-5 text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ClipboardCheck className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Attendance Management
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Advanced attendance tracking and reporting features are coming soon. Stay tuned for updates!
                </p>
                <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-colors">
                    Coming Soon
                </button>
            </div>
        );
    };

    const MarksSection = () => {
        return (
            <div className="flex flex-col justify-center items-center gap-5 text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Marks & Assessment
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Comprehensive grading and assessment tools are being developed. Stay tuned for updates!
                </p>
                <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-colors">
                    Coming Soon
                </button>
            </div>
        );
    };

    const LoadingState = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
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
            case "details":
                return <SubjectDetailsSection />;
            case "students":
                return <SubjectStudentsSection />;
            case "attendance":
                return <AttendanceSection />;
            case "marks":
                return <MarksSection />;
            default:
                return <SubjectDetailsSection />;
        }
    };

    if (subloading) {
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
                                onClick={() => navigate("/Admin/subjects")}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {subjectDetails ? `${subjectDetails.subName}` : 'Subject Details'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {subjectDetails ? `${subjectDetails.subCode} • ${subjectDetails.sclassName?.sclassName}` : 'Loading subject information'}
                                </p>
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
                                {tab.count !== null && tab.count > 0 && (
                                    <span className={`ml-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                                        activeTab === tab.id 
                                            ? 'bg-white text-indigo-500' 
                                            : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderTabContent()}
            </div>

            {/* Modals */}
            <StudentAttendanceModal
                showModal={showAttendanceModal}
                onClose={() => {
                    setShowAttendanceModal(false);
                    setSelectedStudent(null);
                }}
                studentId={selectedStudent}
                subjectId={subjectID}
                onSuccess={() => {
                    setShowAttendanceModal(false);
                    setSelectedStudent(null);
                }}
            />

            <StudentMarksModal
                showModal={showMarksModal}
                onClose={() => {
                    setShowMarksModal(false);
                    setSelectedStudent(null);
                }}
                situation="Subject"
                studentId={selectedStudent}
                subjectId={subjectID}
                onSuccess={() => {
                    setShowMarksModal(false);
                    setSelectedStudent(null);
                }}
            />
        </div>
    );
};

export default ViewSubject;