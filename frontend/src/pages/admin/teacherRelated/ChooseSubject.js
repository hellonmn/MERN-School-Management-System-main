import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherFreeClassSubjects } from '../../../redux/sclassRelated/sclassHandle';
import { updateTeachSubject } from '../../../redux/teacherRelated/teacherHandle';
import { 
    BookOpen, 
    Plus, 
    Search, 
    ArrowLeft,
    Hash,
    GraduationCap,
    ChevronRight,
    Grid3X3,
    List,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

const ChooseSubject = ({ situation }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [classID, setClassID] = useState("");
    const [teacherID, setTeacherID] = useState("");
    const [loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards');

    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);

    useEffect(() => {
        if (situation === "Norm") {
            setClassID(params.id);
            const classID = params.id;
            dispatch(getTeacherFreeClassSubjects(classID));
        }
        else if (situation === "Teacher") {
            const { classID, teacherID } = params;
            setClassID(classID);
            setTeacherID(teacherID);
            dispatch(getTeacherFreeClassSubjects(classID));
        }
    }, [situation, params, dispatch]);

    // Filter subjects based on search term
    const filteredSubjects = subjectsList?.filter(subject => 
        subject.subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.subCode.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const updateSubjectHandler = (teacherId, teachSubject) => {
        setLoader(true);
        dispatch(updateTeachSubject(teacherId, teachSubject));
        navigate("/Admin/teachers");
    };

    const getPageTitle = () => {
        switch (situation) {
            case "Norm":
                return "Choose Subject for New Teacher";
            case "Teacher":
                return "Assign Subject to Teacher";
            default:
                return "Choose a Subject";
        }
    };

    const getPageDescription = () => {
        switch (situation) {
            case "Norm":
                return "Select a subject to create a new teacher for";
            case "Teacher":
                return "Select a subject to assign to the teacher";
            default:
                return "Select a subject to continue";
        }
    };

    const getBackPath = () => {
        switch (situation) {
            case "Norm":
                return "/Admin/teachers/chooseclass";
            case "Teacher":
                return "/Admin/teachers";
            default:
                return "/Admin/teachers";
        }
    };

    const SubjectCard = ({ subject, index }) => {
        return (
            <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{subject.subName}</h3>
                                <p className="text-sm text-gray-500">Subject #{index + 1}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-green-600">{subject.subCode}</span>
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        {/* Subject Info */}
                        <div className="flex items-center gap-3">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Code:</span>
                            <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                {subject.subCode}
                            </span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                            {situation === "Norm" ? (
                                <button
                                    onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Choose Subject
                                </button>
                            ) : (
                                <button
                                    onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                    disabled={loader}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {loader ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Assign Subject
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const SubjectTable = () => {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Available Subjects</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject Name
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject Code
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubjects.map((subject, index) => (
                                <tr key={subject._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                        {subject.subName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {subject.subCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {situation === "Norm" ? (
                                            <button
                                                onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                            >
                                                Choose
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                                disabled={loader}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                            >
                                                {loader ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                        Assigning
                                                    </>
                                                ) : (
                                                    'Assign'
                                                )}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Subjects Available</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm 
                    ? `No subjects match "${searchTerm}". Try a different search term.`
                    : 'There are no available subjects in this class.'}
            </p>
        </div>
    );

    const AllAssignedState = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Subjects Assigned</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Sorry, all subjects have teachers assigned already. You can add more subjects to this class.
            </p>
            <button
                onClick={() => navigate("/Admin/addsubject/" + classID)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Subjects
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
                    <AllAssignedState />
                </div>
            </div>
        );
    }

    if (error) {
        console.log(error);
    }

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
                    {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search subjects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                                    {filteredSubjects.length} of {subjectsList?.length || 0} subjects
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                    filteredSubjects.length > 0 ? (
                        viewMode === 'cards' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSubjects.map((subject, index) => (
                                    <SubjectCard key={subject._id} subject={subject} index={index} />
                                ))}
                            </div>
                        ) : (
                            <SubjectTable />
                        )
                    ) : (
                        <EmptyState />
                    )
                ) : (
                    <EmptyState />
                )}

                {/* Context Info */}
                {Array.isArray(subjectsList) && subjectsList.length > 0 && (
                    <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            What happens after selection?
                        </h3>
                        <div className="text-green-800">
                            {situation === "Norm" && (
                                <p>After selecting a subject, you'll create a new teacher account and assign them to teach this subject.</p>
                            )}
                            {situation === "Teacher" && (
                                <p>After selecting a subject, the teacher will be assigned to teach this subject and can start managing their classes.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChooseSubject;