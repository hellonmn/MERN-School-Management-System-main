import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import { 
    GraduationCap, 
    Plus, 
    Trash2, 
    Eye, 
    Search, 
    Filter,
    BookOpen,
    School,
    UserMinus,
    UserPlus,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Users
} from 'lucide-react';

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [filterSubject, setFilterSubject] = useState('all');
    const [viewMode, setViewMode] = useState('cards');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

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

    // Get unique classes and subjects for filters
    const uniqueClasses = [...new Set(teachersList?.map(teacher => teacher.teachSclass?.sclassName).filter(Boolean) || [])];
    const uniqueSubjects = [...new Set(teachersList?.map(teacher => teacher.teachSubject?.subName).filter(Boolean) || [])];

    // Filter teachers based on search and filters
    const filteredTeachers = teachersList?.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            teacher.teachSubject?.subName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            teacher.teachSclass?.sclassName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'all' || teacher.teachSclass?.sclassName === filterClass;
        const matchesSubject = filterSubject === 'all' || teacher.teachSubject?.subName === filterSubject;
        return matchesSearch && matchesClass && matchesSubject;
    }) || [];

    // Pagination
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

    const TeacherCard = ({ teacher }) => {
        const [showActions, setShowActions] = useState(false);

        const actions = [
            {
                icon: <Eye className="w-4 h-4" />,
                name: "View Details",
                action: () => navigate("/Admin/teachers/teacher/" + teacher._id),
                color: "text-gray-600",
            },
            ...(teacher.teachSubject ? [] : [{
                icon: <BookOpen className="w-4 h-4" />,
                name: "Assign Subject",
                action: () => navigate(`/Admin/teachers/choosesubject/${teacher.teachSclass._id}/${teacher._id}`),
                color: "text-gray-600",
            }]),
        ];

        return (
            <div className="group bg-white rounded-xl border border-gray-200 ring-1 ring-offset-2 hover:ring-offset-purple-200 ring-transparent hover:ring-purple-300 hover:border-gray-200 transition-all duration-300 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <button
                            className="flex text-left items-center gap-2 w-full cursor-pointer"
                            onClick={() => navigate("/Admin/teachers/teacher/" + teacher._id)}
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                                <p className="text-sm text-gray-500">Teacher ID: {teacher._id.slice(-6)}</p>
                            </div>
                        </button>

                        {/* Action Menu */}
                        <div className="relative flex">
                            <button
                                onClick={() => deleteHandler(teacher._id, "Teacher")}
                                className="p-3 flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                                title="Delete Teacher"
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
                <div className="flex flex-col gap-3 p-6 pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex flex-col gap-3 space-x-4 bg-gray-100 p-3 w-full rounded-xl">
                            <div className="flex items-center gap-1">
                                <School className="w-4 h-4" />
                                <span>Class: {teacher.teachSclass?.sclassName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>Subject: {teacher.teachSubject ? teacher.teachSubject.subName : 'Not Assigned'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            teacher.teachSubject 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                        }`}>
                            {teacher.teachSubject ? 'Active' : 'Pending Assignment'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const TeacherTable = () => {
        const columns = [
            { id: 'name', label: 'Name', minWidth: 170 },
            { id: 'teachSubject', label: 'Subject', minWidth: 150 },
            { id: 'teachSclass', label: 'Class', minWidth: 120 },
            { id: 'actions', label: 'Actions', minWidth: 200 },
        ];

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedTeachers.map((teacher) => (
                                <tr key={teacher._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {teacher.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {teacher.teachSubject ? (
                                            teacher.teachSubject.subName
                                        ) : (
                                            <button
                                                onClick={() => navigate(`/Admin/teachers/choosesubject/${teacher.teachSclass._id}/${teacher._id}`)}
                                                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium"
                                            >
                                                Add Subject
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {teacher.teachSclass?.sclassName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => deleteHandler(teacher._id, "Teacher")}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove Teacher"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => navigate("/Admin/teachers/teacher/" + teacher._id)}
                                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredTeachers.length > rowsPerPage && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                disabled={page >= totalPages - 1}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(endIndex, filteredTeachers.length)}
                                    </span>{' '}
                                    of <span className="font-medium">{filteredTeachers.length}</span> results
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value));
                                        setPage(0);
                                    }}
                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={25}>25 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                                
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="px-3 py-1 text-sm text-gray-700">
                                        Page {page + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const actions = [
        {
            icon: <UserPlus className="w-5 h-5 text-blue-500" />, 
            name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <UserMinus className="w-5 h-5 text-red-500" />, 
            name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Teachers Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm || filterClass !== 'all' || filterSubject !== 'all'
                    ? 'No teachers match your current filters. Try adjusting your search or filter criteria.'
                    : 'Get started by adding teachers to manage your classes and subjects.'}
            </p>
            <button
                onClick={() => navigate("/Admin/teachers/chooseclass")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Your First Teacher
            </button>
        </div>
    );

    const LoadingState = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="bg-gray-100 px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
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

    const DeleteConfirmModal = () => (
        showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-[#0000004a] bg-opacity-25 transition-opacity"></div>
                <div className="flex flex-col gap-6 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Remove Teacher</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to remove this teacher? This action cannot be undone and will remove all associated data.
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
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <LoadingState />
                </div>
            </div>
        );
    }

    if (response) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <EmptyState />
                </div>
            </div>
        );
    }

    if (error) {
        console.log(error);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl flex flex-col gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Search and Filters */}
                <div className="">
                    {!loading && !response && Array.isArray(teachersList) && teachersList.length > 0 && (
                        <div className="mt-6 flex flex-col justify-between sm:flex-row gap-4">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search teachers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full min-w-96 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-0 focus:ring-1 focus:ring-purple-200 focus:border-purple-500 transition-colors"
                                    />
                                </div>

                                {/* Class Filter */}
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <select
                                        value={filterClass}
                                        onChange={(e) => setFilterClass(e.target.value)}
                                        className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl outline-0 focus:ring-1 focus:ring-purple-200 focus:border-purple-500 transition-colors bg-white"
                                    >
                                        <option value="all">All Classes</option>
                                        {uniqueClasses.map(className => (
                                            <option key={className} value={className}>{className}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject Filter */}
                                <div className="relative">
                                    <select
                                        value={filterSubject}
                                        onChange={(e) => setFilterSubject(e.target.value)}
                                        className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl outline-0 focus:ring-1 focus:ring-purple-200 focus:border-purple-500 transition-colors bg-white"
                                    >
                                        <option value="all">All Subjects</option>
                                        {uniqueSubjects.map(subjectName => (
                                            <option key={subjectName} value={subjectName}>{subjectName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* View Toggle */}
                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            viewMode === 'cards' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Cards
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            viewMode === 'table' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        Table
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/Admin/teachers/chooseclass")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-950 transition-colors font-medium shadow-sm cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Teacher
                            </button>
                        </div>
                    )}
                </div>

                {/* Count */}
                {!loading && !response && Array.isArray(teachersList) && teachersList.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-purple-100 rounded-xl p-3 px-5 w-fit">
                        <span>{filteredTeachers.length} of {teachersList?.length || 0} teacher(s)</span>
                    </div>
                )}

                {/* Content */}
                {Array.isArray(teachersList) && teachersList.length > 0 ? (
                    filteredTeachers.length > 0 ? (
                        viewMode === 'cards' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedTeachers.map((teacher) => (
                                    <TeacherCard key={teacher._id} teacher={teacher} />
                                ))}
                            </div>
                        ) : (
                            <TeacherTable />
                        )
                    ) : (
                        <EmptyState />
                    )
                ) : (
                    <EmptyState />
                )}

                {/* Speed Dial for bulk actions */}
                {!loading && !response && Array.isArray(teachersList) && teachersList.length > 0 && (
                    <SpeedDialTemplate actions={actions} />
                )}
            </div>

            <DeleteConfirmModal />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default ShowTeachers;