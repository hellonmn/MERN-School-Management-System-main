import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { 
    Users, 
    Plus, 
    Trash2, 
    Eye, 
    Search, 
    MoreVertical,
    GraduationCap,
    Hash,
    ClipboardCheck,
    BarChart3,
    UserPlus,
    UserMinus
} from 'lucide-react';

const ShowStudents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        setDeleteTarget({ id: deleteID, address });
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
    };

    // Filter students based on search term
    const filteredStudents = studentsList?.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.rollNum.toString().includes(searchTerm.toLowerCase()) ||
                            student.sclassName.sclassName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    }) || [];

    const StudentCard = ({ student }) => {
        const [showActions, setShowActions] = useState(false);

        const actions = [
            {
                icon: <Eye className="w-4 h-4" />,
                name: "View Details",
                action: () => navigate(`/Admin/students/student/${student._id}`),
                color: "text-gray-600",
            },
            {
                icon: <ClipboardCheck className="w-4 h-4" />,
                name: "Take Attendance",
                action: () => navigate(`/Admin/students/student/attendance/${student._id}`),
                color: "text-blue-600",
            },
            {
                icon: <BarChart3 className="w-4 h-4" />,
                name: "Provide Marks",
                action: () => navigate(`/Admin/students/student/marks/${student._id}`),
                color: "text-purple-600",
            }
        ];

        return (
            <div className="group bg-white rounded-xl border border-gray-200 ring-1 ring-offset-2 hover:ring-offset-indigo-200 ring-transparent hover:ring-indigo-300 hover:border-gray-200 transition-all duration-300 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <button
                            className="flex text-left items-center gap-3 w-full cursor-pointer"
                            onClick={() => navigate(`/Admin/students/student/${student._id}`)}
                        >
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-indigo-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {student.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Roll No: {student.rollNum}
                                </p>
                            </div>
                        </button>

                        {/* Action Menu */}
                        <div className="relative flex">
                            <button
                                onClick={() => deleteHandler(student._id, "Student")}
                                className="p-3 flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                                title="Delete Student"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-3 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-600 rounded-xl transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {showActions && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowActions(false)}
                                    ></div>
                                    <div className="absolute right-0 z-20 top-10 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 p-1">
                                        <div className="absolute -top-1 right-3 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                                        {actions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    action.action();
                                                    setShowActions(false);
                                                }}
                                                className={`flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-100 rounded-xl transition-colors ${action.color}`}
                                            >
                                                {action.icon}
                                                {action.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col gap-3 p-6 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex flex-col gap-3 bg-gray-50 p-3 w-full rounded-xl">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>Class: {student.sclassName.sclassName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                <span>Student ID: {student._id.slice(-6)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={() => navigate(`/Admin/students/student/attendance/${student._id}`)}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm cursor-pointer"
                        >
                            Attendance
                        </button>
                        <button
                            onClick={() => navigate(`/Admin/students/student/marks/${student._id}`)}
                            className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium text-sm cursor-pointer"
                        >
                            Marks
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Students Found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm
                    ? `No students match "${searchTerm}". Try a different search term.`
                    : "Get started by adding your first student to begin managing their academic journey."}
            </p>
            <button
                onClick={() => navigate("/Admin/addstudents")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Your First Student
            </button>
        </div>
    );

    const LoadingState = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                >
                    <div className="bg-gray-100 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const DeleteConfirmModal = () =>
        showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-[#0000004a] bg-opacity-25 transition-opacity"></div>
                <div className="flex flex-col gap-6 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Delete Student
                        </h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this student? This action cannot be
                        undone and will remove all associated data including attendance and marks.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl flex flex-col gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="">
                    {/* Search and Filters */}
                    {!loading &&
                        !response &&
                        Array.isArray(studentsList) &&
                        studentsList.length > 0 && (
                            <div className="mt-6 flex flex-col justify-between sm:flex-row gap-4">
                                <div className="flex">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full min-w-96 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-0 focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate("/Admin/addstudents")}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-950 transition-colors font-medium shadow-sm cursor-pointer"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Add New Student
                                    </button>
                                    <button
                                        onClick={() => deleteHandler(currentUser._id, "Students")}
                                        className="inline-flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm cursor-pointer"
                                        title="Delete All Students"
                                    >
                                        <UserMinus className="w-4 h-4" />
                                        Delete All
                                    </button>
                                </div>
                            </div>
                        )}
                </div>

                {/* Count */}
                {!loading &&
                    !response &&
                    Array.isArray(studentsList) &&
                    studentsList.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-indigo-100 rounded-xl p-3 px-5 w-fit">
                            <span>
                                {filteredStudents.length} of {studentsList.length} student(s)
                            </span>
                        </div>
                    )}

                {/* Content */}
                {loading ? (
                    <LoadingState />
                ) : response ? (
                    <EmptyState />
                ) : Array.isArray(studentsList) && studentsList.length > 0 ? (
                    filteredStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((student) => (
                                <StudentCard key={student._id} student={student} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* Modals */}            
            <DeleteConfirmModal />
            
            <Popup
                message={message}
                setShowPopup={setShowPopup}
                showPopup={showPopup}
            />
        </div>
    );
};

export default ShowStudents;