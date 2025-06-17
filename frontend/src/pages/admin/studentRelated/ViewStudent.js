import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart';
import CustomPieChart from '../../../components/CustomPieChart';
import Popup from '../../../components/Popup';
import StudentAttendanceModal from '../subjectRelated/StudentAttendanceModal';
import StudentMarksModal from '../subjectRelated/StudentMarksModal';
import {
    User,
    Users,
    GraduationCap,
    School,
    Hash,
    Calendar,
    BarChart3,
    TrendingUp,
    ClipboardCheck,
    Award,
    Trash2,
    Plus,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Settings,
    Edit,
    Eye,
    X
} from 'lucide-react';

const ViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id;
    const address = "Student";

    const [activeTab, setActiveTab] = useState('details');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'

    // Modal states
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showMarksModal, setShowMarksModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [modalAction, setModalAction] = useState('add'); // 'add' or 'edit'

    // Form states
    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName?._id) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails?.sclassName?._id]);

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
        }
    }, [userDetails]);

    const toggleSubjectExpansion = (subId) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subId]: !prev[subId]
        }));
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const fields = password === "" ? { name, rollNum } : { name, rollNum, password };
        dispatch(updateUser(fields, studentID, address))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
                setShowEditForm(false);
                setMessage("Student details updated successfully!");
                setShowPopup(true);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Failed to update student details.");
                setShowPopup(true);
            });
    };

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
                setMessage("Subject attendance removed successfully!");
                setShowPopup(true);
            });
    };

    const removeAllAttendance = () => {
        dispatch(removeStuff(studentID, "RemoveStudentAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
                setMessage("All attendance records removed!");
                setShowPopup(true);
            });
    };

    // Modal handlers with useCallback to prevent re-renders
    const handleAddAttendance = useCallback(() => {
        setSelectedSubject(null);
        setModalAction('add');
        setShowAttendanceModal(true);
    }, []);

    const handleEditAttendance = useCallback((subId) => {
        setSelectedSubject(subId);
        setModalAction('edit');
        setShowAttendanceModal(true);
    }, []);

    const handleAddMarks = useCallback(() => {
        setSelectedSubject(null);
        setModalAction('add');
        setShowMarksModal(true);
    }, []);

    const handleEditMarks = useCallback((subId) => {
        setSelectedSubject(subId);
        setModalAction('edit');
        setShowMarksModal(true);
    }, []);

    const handleModalSuccess = useCallback(() => {
        // Close modals and reset states first
        setShowAttendanceModal(false);
        setShowMarksModal(false);
        setSelectedSubject(null);
        setModalAction('add');
        
        // Then refresh student data after modal operations
        setTimeout(() => {
            dispatch(getUserDetails(studentID, address));
            setMessage("Operation completed successfully!");
            setShowPopup(true);
        }, 100);
    }, [dispatch, studentID, address]);

    const handleModalClose = useCallback(() => {
        setShowAttendanceModal(false);
        setShowMarksModal(false);
        setSelectedSubject(null);
        setModalAction('add');
    }, []);

    if (!userDetails) return null;

    const subjectAttendance = userDetails.attendance || [];
    const subjectMarks = userDetails.examResult || [];

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance) || 0;
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        // Ensure we have valid numbers
        const validPercentage = typeof subjectAttendancePercentage === 'number' && !isNaN(subjectAttendancePercentage) 
            ? subjectAttendancePercentage 
            : 0;
        
        return {
            subject: subName,
            attendancePercentage: validPercentage,
            totalClasses: sessions || 0,
            attendedClasses: present || 0
        };
    });

    const tabs = [
        { id: 'details', label: 'Details', icon: <User className="w-4 h-4" /> },
        { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck className="w-4 h-4" /> },
        { id: 'marks', label: 'Marks', icon: <Award className="w-4 h-4" /> },
    ];

    const StatCard = ({ icon, title, value, subtitle, color = "indigo" }) => {
        const colorClasses = {
            indigo: "bg-indigo-500",
            green: "bg-green-500",
            blue: "bg-blue-500",
            purple: "bg-purple-500",
            orange: "bg-orange-500",
        };

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DetailsSection = () => (
        <div className="flex flex-col gap-8">
            {/* Student Info Card */}
            <div className="flex flex-col gap-4 bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-600" />
                        Student Information
                    </h3>
                    <button
                        onClick={() => setShowEditForm(!showEditForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Details
                    </button>
                </div>

                {!showEditForm ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                                    <p className="text-gray-900 font-semibold">{userDetails.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Hash className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Roll Number</p>
                                    <p className="text-gray-900 font-semibold">{userDetails.rollNum}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Class</p>
                                    <p className="text-gray-900 font-semibold">{userDetails.sclassName?.sclassName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <School className="w-5 h-5 text-orange-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">School</p>
                                    <p className="text-gray-900 font-semibold">{userDetails.school?.schoolName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                                <input
                                    type="number"
                                    value={rollNum}
                                    onChange={(e) => setRollNum(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password (Optional)</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Update Details
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowEditForm(false)}
                                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<ClipboardCheck className="w-6 h-6" />}
                    title="Overall Attendance"
                    value={`${(overallAttendancePercentage || 0).toFixed(1)}%`}
                    color="green"
                />
                <StatCard
                    icon={<Award className="w-6 h-6" />}
                    title="Subjects Enrolled"
                    value={subjectMarks?.length || 0}
                    color="purple"
                />
                <StatCard
                    icon={<BarChart3 className="w-6 h-6" />}
                    title="Total Marks"
                    value={subjectMarks?.reduce((sum, mark) => sum + (mark.marksObtained || 0), 0) || 0}
                    color="blue"
                />
                <StatCard
                    icon={<Calendar className="w-6 h-6" />}
                    title="Classes Attended"
                    value={subjectData?.reduce((sum, subject) => sum + (subject.attendedClasses || 0), 0) || 0}
                    color="orange"
                />
            </div>

            {/* Attendance Overview Chart */}
            {subjectAttendance.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
                    <CustomPieChart data={chartData} />
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                <div className="flex gap-3">
                    <button
                        onClick={handleAddAttendance}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        Add Attendance
                    </button>
                    <button
                        onClick={handleAddMarks}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                        <Award className="w-4 h-4" />
                        Add Marks
                    </button>
                    <button
                        onClick={deleteHandler}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Student
                    </button>
                </div>
            </div>
        </div>
    );

    const AttendanceSection = () => (
        <div className="flex flex-col gap-6">
            {subjectAttendance.length > 0 ? (
                <>
                    {/* View Toggle */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Table View
                            </button>
                            <button
                                onClick={() => setViewMode('chart')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    viewMode === 'chart'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                Chart View
                            </button>
                        </div>
                    </div>

                    {viewMode === 'table' ? (
                        <div className="flex flex-col gap-4">
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }]) => {
                                const attendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                const isExpanded = expandedSubjects[subId];
                                
                                // Ensure attendancePercentage is a valid number
                                const validAttendancePercentage = typeof attendancePercentage === 'number' && !isNaN(attendancePercentage) 
                                    ? attendancePercentage 
                                    : 0;

                                return (
                                    <div key={subId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <ClipboardCheck className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{subName}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {present || 0}/{sessions || 0} classes attended ({validAttendancePercentage.toFixed(1)}%)
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditAttendance(subId)}
                                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => removeSubAttendance(subId)}
                                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => toggleSubjectExpansion(subId)}
                                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="p-6">
                                                <h5 className="font-medium text-gray-900 mb-4">Attendance Details</h5>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b border-gray-200">
                                                                <th className="text-left py-2 font-medium text-gray-600">Date</th>
                                                                <th className="text-right py-2 font-medium text-gray-600">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {allData.map((data, index) => {
                                                                const date = new Date(data.date);
                                                                const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                return (
                                                                    <tr key={index} className="border-b border-gray-100">
                                                                        <td className="py-2">{dateString}</td>
                                                                        <td className="py-2 text-right">
                                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                                data.status === 'Present' 
                                                                                    ? 'bg-green-100 text-green-700'
                                                                                    : 'bg-red-100 text-red-700'
                                                                            }`}>
                                                                                {data.status}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Overall Attendance</h4>
                                        <p className="text-2xl font-bold text-green-600">{(overallAttendancePercentage || 0).toFixed(2)}%</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={removeAllAttendance}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete All
                                        </button>
                                        <button
                                            onClick={handleAddAttendance}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Attendance
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col gap-4 items-center justify-center text-center py-16 bg-white rounded-xl border border-gray-200">
                    <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Attendance Records</h3>
                    <p className="text-gray-500 mb-6">Start tracking attendance for this student.</p>
                    <button
                        onClick={handleAddAttendance}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Attendance
                    </button>
                </div>
            )}
        </div>
    );

    const MarksSection = () => (
        <div className="flex flex-col gap-6">
            {subjectMarks.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Subject Marks</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        viewMode === 'table'
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Table View
                                </button>
                                <button
                                    onClick={() => setViewMode('chart')}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        viewMode === 'chart'
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Chart View
                                </button>
                            </div>
                            <button
                                onClick={handleAddMarks}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Marks
                            </button>
                        </div>
                    </div>

                    {viewMode === 'table' ? (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-medium text-gray-600">Subject</th>
                                            <th className="text-right py-4 px-6 font-medium text-gray-600">Marks Obtained</th>
                                            <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subjectMarks.map((result, index) => {
                                            if (!result.subName || !result.marksObtained) return null;
                                            return (
                                                <tr key={index} className="border-b border-gray-100">
                                                    <td className="py-4 px-6 font-medium text-gray-900">
                                                        {result.subName.subName}
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                            {result.marksObtained}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <button
                                                            onClick={() => handleEditMarks(result.subName._id)}
                                                            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Marks Recorded</h3>
                    <p className="text-gray-500 mb-6">Start recording exam results for this student.</p>
                    <button
                        onClick={handleAddMarks}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Marks
                    </button>
                </div>
            )}
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return <DetailsSection />;
            case 'attendance':
                return <AttendanceSection />;
            case 'marks':
                return <MarksSection />;
            default:
                return <DetailsSection />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading student details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {userDetails?.name}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Roll No: {userDetails?.rollNum} • {userDetails?.sclassName?.sclassName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Tabs */}
                    <div className="flex gap-1 pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
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

            {/* Modals - Only render when explicitly opened */}
            {showAttendanceModal && (
                <div key={`attendance-${studentID}-${Date.now()}`}>
                    <StudentAttendanceModal
                        showModal={showAttendanceModal}
                        onClose={handleModalClose}
                        studentId={studentID}
                        subjectId={selectedSubject}
                        situation="Student"
                        onSuccess={handleModalSuccess}
                    />
                </div>
            )}

            {showMarksModal && (
                <div key={`marks-${studentID}-${Date.now()}`}>
                    <StudentMarksModal
                        showModal={showMarksModal}
                        onClose={handleModalClose}
                        studentId={studentID}
                        subjectId={selectedSubject}
                        situation="Student"
                        onSuccess={handleModalSuccess}
                    />
                </div>
            )}

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default ViewStudent;