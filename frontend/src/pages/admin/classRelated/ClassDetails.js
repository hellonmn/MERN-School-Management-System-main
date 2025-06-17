import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import StudentAttendanceModal from "../subjectRelated/StudentAttendanceModal";
import {
  Users,
  BookOpen,
  GraduationCap,
  UserPlus,
  UserMinus,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Settings,
  MoreVertical,
  ArrowLeft,
  ChevronRight,
  Search,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    subjectsList,
    sclassStudents,
    sclassDetails,
    loading,
    error,
    response,
    getresponse,
  } = useSelector((state) => state.sclass);

  const classID = params.id;
  const [activeTab, setActiveTab] = useState("details");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Attendance Modal States - matching ViewSubject pattern
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

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

  const tabs = [
    { 
      id: "details", 
      label: "Overview", 
      icon: <Settings className="w-4 h-4" />,
      count: null
    },
    {
      id: "subjects",
      label: "Subjects",
      icon: <BookOpen className="w-4 h-4" />,
      count: subjectsList?.length || 0
    },
    { 
      id: "students", 
      label: "Students", 
      icon: <Users className="w-4 h-4" />,
      count: sclassStudents?.length || 0
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: <GraduationCap className="w-4 h-4" />,
      count: 0
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

  const ClassDetailsSection = () => {
    const numberOfSubjects = subjectsList?.length || 0;
    const numberOfStudents = sclassStudents?.length || 0;

    return (
      <div className="flex flex-col gap-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Total Subjects"
            value={numberOfSubjects}
            color="indigo"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Students"
            value={numberOfStudents}
            color="green"
          />
          <StatCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Active Teachers"
            value="0"
            color="purple"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Avg. Attendance"
            value="95%"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
              onClick={() => navigate("/Admin/addsubject/" + classID)}
              className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 group-hover:text-gray-100">Add Subjects</p>
                <p className="text-xs text-gray-600 group-hover:text-gray-300">Create new subjects</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/Admin/classes")}
              className="flex items-center gap-3 p-4 hover:bg-gray-800 rounded-xl transition-all duration-200 border border-gray-200 hover:shadow-md group"
            >
              <div className="w-10 h-10 bg-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 group-hover:text-gray-100">Back to Classes</p>
                <p className="text-xs text-gray-600 group-hover:text-gray-300">Return to overview</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filter subjects/students based on search term
  const filteredSubjects = subjectsList?.filter(subject => 
    subject.subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subCode.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredStudents = sclassStudents?.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNum.toString().includes(searchTerm)
  ) || [];

  // Subject Card Component
  const SubjectCard = ({ subject }) => {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 ring-1 ring-offset-2 hover:ring-offset-indigo-200 ring-transparent hover:ring-indigo-300 transition-all duration-200 group">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-3 cursor-pointer w-full" onClick={() => navigate(`/Admin/class/subject/${classID}/${subject._id}`)}>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                {subject.subName}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Code: {subject.subCode}
              </p>
            </div>
          </button>
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => deleteHandler(subject._id, "Subject")}
              className="p-3 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              title="Delete Subject"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Student Card Component - matching ViewSubject pattern exactly
  const StudentCard = ({ student }) => {
    const handleAttendanceClick = () => {
      console.log('Opening attendance modal for student:', student._id);
      setSelectedStudent(student._id);
      setShowAttendanceModal(true);
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 ring-1 ring-offset-2 hover:ring-offset-indigo-200 ring-transparent hover:ring-indigo-300 transition-all duration-200 group">
        <div className="flex items-start justify-between mb-4">
          <button className="flex items-center gap-3 cursor-pointer w-full" onClick={() => navigate("/Admin/students/student/" + student._id)}>
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
          <div className="relative">
            <button
              onClick={() => deleteHandler(student._id, "Student")}
              className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove Student"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-2 w-full">
            <button
              onClick={handleAttendanceClick}
              className="w-full px-3 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium text-sm cursor-pointer"
            >
              Attendance
            </button>
          </div>
        </div>
      </div>
    );
  };

  const subjectActions = [
    {
      icon: <Plus className="w-5 h-5 text-indigo-500" />,
      name: "Add New Subject",
      action: () => navigate("/Admin/addsubject/" + classID),
    },
    {
      icon: <Trash2 className="w-5 h-5 text-red-500" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(classID, "SubjectsClass"),
    },
  ];

  const ClassSubjectsSection = () => {
    return (
      <div className="flex flex-col gap-6">
        {response ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Subjects Added Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding subjects to this class to create a comprehensive curriculum.
            </p>
            <button
              onClick={() => navigate("/Admin/addsubject/" + classID)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Your First Subject
            </button>
          </div>
        ) : (
          <>
            {/* Search and Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <span className="text-sm text-gray-700 font-medium">
                    {filteredSubjects.length} of {subjectsList?.length || 0} subject(s)
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl outline-0 focus:ring-1 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <button
                  onClick={() => navigate("/Admin/addsubject/" + classID)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject._id} subject={subject} />
              ))}
            </div>
            
            <SpeedDialTemplate actions={subjectActions} />
          </>
        )}
      </div>
    );
  };

  const studentActions = [
    {
      icon: <UserPlus className="w-5 h-5 text-indigo-500" />,
      name: "Add New Student",
      action: () => navigate("/Admin/class/addstudents/" + classID),
    },
    {
      icon: <UserMinus className="w-5 h-5 text-red-500" />,
      name: "Delete All Students",
      action: () => deleteHandler(classID, "StudentsClass"),
    },
  ];

  const ClassStudentsSection = () => {
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
              Start building your class by enrolling students to begin their learning journey.
            </p>
            <button
              onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Enroll Your First Student
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
            
            <SpeedDialTemplate actions={studentActions} />
          </>
        )}
      </div>
    );
  };

  const ClassTeachersSection = () => {
    return (
      <div className="flex flex-col justify-center items-center gap-5 text-center py-16 bg-white rounded-xl border border-gray-200">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-indigo-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Teachers Management
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Teacher assignment and management features are coming soon. Stay tuned for updates!
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

  const DeleteConfirmModal = () =>
    showDeleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-[#0000004a] transition-opacity"></div>
        <div className="flex flex-col gap-4 bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Deletion
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this item? This action cannot be
            undone and will remove all associated data.
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <ClassDetailsSection />;
      case "subjects":
        return <ClassSubjectsSection />;
      case "students":
        return <ClassStudentsSection />;
      case "teachers":
        return <ClassTeachersSection />;
      default:
        return <ClassDetailsSection />;
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
                onClick={() => navigate("/Admin/classes")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sclassDetails
                    ? `Class ${sclassDetails.sclassName}`
                    : "Class Details"}
                </h1>
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
      <DeleteConfirmModal />
      
      {/* Attendance Modal - Matching ViewSubject pattern exactly */}
      <StudentAttendanceModal
        showModal={showAttendanceModal}
        onClose={() => {
          console.log('Closing attendance modal');
          setShowAttendanceModal(false);
          setSelectedStudent(null);
        }}
        studentId={selectedStudent}
        onSuccess={() => {
          console.log('Attendance submitted successfully');
          setShowAttendanceModal(false);
          setSelectedStudent(null);
          setMessage("Attendance recorded successfully!");
          setShowPopup(true);
          // Refresh student data
          dispatch(getClassStudents(classID));
        }}
        situation="Student"
      />

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default ClassDetails;