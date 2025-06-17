import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import TableTemplate from '../../../components/TableTemplate';
import { 
    GraduationCap, 
    Plus, 
    Search, 
    ArrowLeft,
    BookOpen,
    Users,
    ChevronRight,
    Grid3X3,
    List
} from 'lucide-react';

const ChooseClass = ({ situation }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards');

    const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const navigateHandler = (classID) => {
        if (situation === "Teacher") {
            navigate("/Admin/teachers/choosesubject/" + classID);
        }
        else if (situation === "Subject") {
            navigate("/Admin/addsubject/" + classID);
        }
    };

    // Filter classes based on search term
    const filteredClasses = sclassesList?.filter(sclass => 
        sclass.sclassName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getPageTitle = () => {
        switch (situation) {
            case "Teacher":
                return "Choose Class for Teacher";
            case "Subject":
                return "Choose Class for Subject";
            default:
                return "Choose a Class";
        }
    };

    const getPageDescription = () => {
        switch (situation) {
            case "Teacher":
                return "Select a class to assign the teacher to";
            case "Subject":
                return "Select a class to add subjects to";
            default:
                return "Select a class to continue";
        }
    };

    const getBackPath = () => {
        switch (situation) {
            case "Teacher":
                return "/Admin/teachers";
            case "Subject":
                return "/Admin/subjects";
            default:
                return "/Admin/classes";
        }
    };

    const ClassCard = ({ sclass }) => {
        return (
            <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden cursor-pointer"
                 onClick={() => navigateHandler(sclass._id)}>
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{sclass.sclassName}</h3>
                                <p className="text-sm text-gray-500">Class ID: {sclass._id.slice(-6)}</p>
                            </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Class Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">Students:</span>
                                <span>0</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BookOpen className="w-4 h-4" />
                                <span className="font-medium">Subjects:</span>
                                <span>0</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateHandler(sclass._id);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                            >
                                Choose Class
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Table configuration
    const sclassColumns = [
        { id: 'name', label: 'Class Name', minWidth: 170 },
    ];

    const sclassRows = filteredClasses.map((sclass) => {
        return {
            name: sclass.sclassName,
            id: sclass._id,
        };
    });

    const SclassButtonHaver = ({ row }) => {
        return (
            <button
                onClick={() => navigateHandler(row.id)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
                Choose
            </button>
        );
    };

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Classes Available</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm 
                    ? `No classes match "${searchTerm}". Try a different search term.`
                    : 'You need to create a class first before you can proceed.'}
            </p>
            <button
                onClick={() => navigate("/Admin/addclass")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Add New Class
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
                            <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate(getBackPath())}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                            <p className="text-gray-600 mt-1">{getPageDescription()}</p>
                        </div>
                    </div>

                    {/* Search and View Controls */}
                    {!loading && !getresponse && Array.isArray(sclassesList) && sclassesList.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search classes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                {/* View Toggle */}
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('cards')}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                            viewMode === 'cards' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                        Cards
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                            viewMode === 'table' 
                                                ? 'bg-white text-gray-900 shadow-sm' 
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <List className="w-4 h-4" />
                                        Table
                                    </button>
                                </div>

                                {/* Results Count */}
                                <div className="text-sm text-gray-600">
                                    {filteredClasses.length} of {sclassesList?.length || 0} classes
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <LoadingState />
                ) : getresponse ? (
                    <EmptyState />
                ) : Array.isArray(sclassesList) && sclassesList.length > 0 ? (
                    filteredClasses.length > 0 ? (
                        viewMode === 'cards' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredClasses.map((sclass) => (
                                    <ClassCard key={sclass._id} sclass={sclass} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Available Classes</h3>
                                </div>
                                <TableTemplate 
                                    buttonHaver={SclassButtonHaver} 
                                    columns={sclassColumns} 
                                    rows={sclassRows} 
                                />
                            </div>
                        )
                    ) : (
                        <EmptyState />
                    )
                ) : (
                    <EmptyState />
                )}

                {/* Context Info */}
                {!loading && !getresponse && Array.isArray(sclassesList) && sclassesList.length > 0 && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            What happens after selection?
                        </h3>
                        <div className="text-blue-800">
                            {situation === "Teacher" && (
                                <p>After selecting a class, you'll choose a subject to assign to the teacher.</p>
                            )}
                            {situation === "Subject" && (
                                <p>After selecting a class, you'll be able to add subjects to that class.</p>
                            )}
                            {!situation && (
                                <p>After selecting a class, you'll proceed to the next step in the process.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChooseClass;