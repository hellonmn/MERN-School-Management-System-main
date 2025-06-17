import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { 
    Plus, 
    Trash2, 
    Search, 
    Bell, 
    Calendar, 
    FileText, 
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    AlertCircle
} from 'lucide-react';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';

const ShowNotices = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        setDeleteTarget({ id: deleteID, address });
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        dispatch(deleteUser(deleteTarget.id, deleteTarget.address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
                setMessage("Notice deleted successfully!");
                setShowPopup(true);
            })
            .catch(() => {
                setMessage("Failed to delete notice. Please try again.");
                setShowPopup(true);
            });
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
    };

    // Filter notices based on search term
    const filteredNotices = noticesList?.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.details.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Pagination
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedNotices = filteredNotices.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredNotices.length / rowsPerPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (date.toString() === "Invalid Date") return "Invalid Date";
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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

    const NoticeCard = ({ notice }) => {
        const [showActions, setShowActions] = useState(false);

        const actions = [
            {
                icon: <Eye className="w-4 h-4" />,
                name: "View Details",
                action: () => navigate(`/Admin/notices/notice/${notice._id}`),
                color: "text-gray-600",
            },
            {
                icon: <Edit className="w-4 h-4" />,
                name: "Edit Notice",
                action: () => navigate(`/Admin/notices/edit/${notice._id}`),
                color: "text-gray-600",
            }
        ];

        return (
            <div className="group bg-white rounded-xl border border-gray-200 ring-1 ring-offset-2 hover:ring-offset-blue-200 ring-transparent hover:ring-blue-300 hover:border-gray-200 transition-all duration-300 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{notice.title}</h3>
                                <p className="text-sm text-gray-500">Notice ID: {notice._id.slice(-6)}</p>
                            </div>
                        </div>

                        {/* Action Menu */}
                        <div className="relative flex">
                            <button
                                onClick={() => deleteHandler(notice._id, "Notice")}
                                className="p-3 flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                                title="Delete Notice"
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
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Notice Details */}
                        <div>
                            <p className="text-gray-700 line-clamp-3">{notice.details}</p>
                        </div>

                        {/* Date Information */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(notice.date)}</span>
                            </div>
                            <div className="text-gray-500">
                                • {getTimeAgo(notice.date)}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => navigate(`/Admin/notices/notice/${notice._id}`)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </button>
                            
                            <button
                                onClick={() => navigate(`/Admin/notices/edit/${notice._id}`)}
                                className="px-4 py-2.5 text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const NoticeTable = () => {
        const columns = [
            { id: 'title', label: 'Title', minWidth: 200 },
            { id: 'details', label: 'Details', minWidth: 300 },
            { id: 'date', label: 'Date', minWidth: 150 },
            { id: 'actions', label: 'Actions', minWidth: 150 },
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
                            {paginatedNotices.map((notice) => (
                                <tr key={notice._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="line-clamp-2">{notice.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="line-clamp-2">{notice.details}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{formatDate(notice.date)}</div>
                                        <div className="text-xs text-gray-400">{getTimeAgo(notice.date)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/Admin/notices/notice/${notice._id}`)}
                                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => deleteHandler(notice._id, "Notice")}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Notice"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredNotices.length > rowsPerPage && (
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
                                        {Math.min(endIndex, filteredNotices.length)}
                                    </span>{' '}
                                    of <span className="font-medium">{filteredNotices.length}</span> results
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
            icon: <Plus className="w-5 h-5 text-blue-500" />,
            name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <Trash2 className="w-5 h-5 text-red-500" />,
            name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notices Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm
                    ? 'No notices match your search criteria. Try adjusting your search term.'
                    : 'Get started by creating your first notice to communicate with students and staff.'}
            </p>
            <button
                onClick={() => navigate("/Admin/addnotice")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Create Your First Notice
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
                        <h3 className="text-lg font-semibold text-gray-900">Delete Notice</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this notice? This action cannot be undone and will remove the notice permanently.
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
        )
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl flex flex-col gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with Search and Filters */}
                <div className="">
                    {!loading && !response && Array.isArray(noticesList) && noticesList.length > 0 && (
                        <div className="mt-6 flex flex-col justify-between sm:flex-row gap-4">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search notices..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full min-w-96 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-0 focus:ring-1 focus:ring-blue-200 focus:border-blue-500 transition-colors"
                                    />
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
                                onClick={() => navigate("/Admin/addnotice")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-950 transition-colors font-medium shadow-sm cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Notice
                            </button>
                        </div>
                    )}
                </div>

                {/* Count */}
                {!loading && !response && Array.isArray(noticesList) && noticesList.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-blue-100 rounded-xl p-3 px-5 w-fit">
                        <span>{filteredNotices.length} of {noticesList?.length || 0} notice(s)</span>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <LoadingState />
                ) : response ? (
                    <EmptyState />
                ) : Array.isArray(noticesList) && noticesList.length > 0 ? (
                    filteredNotices.length > 0 ? (
                        viewMode === 'cards' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedNotices.map((notice) => (
                                    <NoticeCard key={notice._id} notice={notice} />
                                ))}
                            </div>
                        ) : (
                            <NoticeTable />
                        )
                    ) : (
                        <EmptyState />
                    )
                ) : (
                    <EmptyState />
                )}

                {/* Speed Dial for bulk actions */}
                {!loading && !response && Array.isArray(noticesList) && noticesList.length > 0 && (
                    <SpeedDialTemplate actions={actions} />
                )}
            </div>

            <DeleteConfirmModal />
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default ShowNotices;