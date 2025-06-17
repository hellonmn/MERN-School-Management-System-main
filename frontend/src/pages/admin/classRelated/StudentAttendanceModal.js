import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { X, Loader2, ClipboardCheck, User, Calendar, BookOpen, CheckCircle, XCircle } from 'lucide-react';

const StudentAttendanceModal = ({ showModal, onClose, studentId, subjectId = null, onSuccess, situation = "Student" }) => {
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);

    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [modalLoader, setModalLoader] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Local state to avoid Redux dependency loops
    const [localStudentData, setLocalStudentData] = useState(null);
    const [localSubjectsData, setLocalSubjectsData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Initialize modal when it opens
    useEffect(() => {
        if (showModal && studentId && !hasInitialized) {
            console.log('Initializing modal for student:', studentId, 'situation:', situation);
            
            setDataLoading(true);
            setHasInitialized(true);
            
            // Set today's date
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
            
            // Set subject if provided
            if (subjectId) {
                setChosenSubName(subjectId);
            }
            
            // Load student details
            dispatch(getUserDetails(studentId, "Student"));
        }
    }, [showModal, studentId, situation, hasInitialized, subjectId, dispatch]);

    // Handle userDetails response
    useEffect(() => {
        if (userDetails && showModal && hasInitialized) {
            console.log('Received user details:', userDetails);
            setLocalStudentData(userDetails);
            
            // Load subjects only for "Student" situation
            if (situation === "Student" && userDetails.sclassName && localSubjectsData.length === 0) {
                dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
            } else {
                setDataLoading(false);
            }
        }
    }, [userDetails, showModal, hasInitialized, situation, localSubjectsData.length, dispatch]);

    // Handle subjectsList response
    useEffect(() => {
        if (subjectsList && subjectsList.length > 0 && showModal && situation === "Student") {
            console.log('Received subjects:', subjectsList);
            setLocalSubjectsData(subjectsList);
            setDataLoading(false);
        }
    }, [subjectsList, showModal, situation]);

    // Handle form submission response
    useEffect(() => {
        if (modalLoader && (response || statestatus === "added")) {
            console.log('Attendance submitted successfully');
            setModalLoader(false);
            setShowSuccess(true);
            
            setTimeout(() => {
                if (onSuccess) onSuccess();
                handleClose();
            }, 2000);
        } else if (modalLoader && error) {
            console.error('Attendance submission error:', error);
            setModalLoader(false);
        }
    }, [modalLoader, response, statestatus, error, onSuccess]);

    // Reset everything when modal closes
    useEffect(() => {
        if (!showModal) {
            setSubjectName("");
            setChosenSubName("");
            setStatus("");
            setDate("");
            setModalLoader(false);
            setShowSuccess(false);
            setLocalStudentData(null);
            setLocalSubjectsData([]);
            setDataLoading(false);
            setHasInitialized(false);
        }
    }, [showModal]);

    const handleClose = () => {
        onClose();
    };

    const changeHandler = (event) => {
        const selectedSubject = localSubjectsData.find(
            (subject) => subject.subName === event.target.value
        );
        if (selectedSubject) {
            setSubjectName(selectedSubject.subName);
            setChosenSubName(selectedSubject._id);
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();
        console.log('Submitting attendance:', { studentId, chosenSubName: chosenSubName || subjectId, status, date });
        
        if (!status || !date) return;
        if (situation === "Student" && !chosenSubName) return;
        
        setModalLoader(true);
        const fields = { 
            subName: chosenSubName || subjectId, 
            status, 
            date 
        };
        dispatch(updateStudentFields(studentId, fields, "StudentAttendance"));
    };

    if (!showModal) return null;

    // Success State
    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Attendance Recorded!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {localStudentData?.name}'s attendance has been successfully recorded as{' '}
                            <span className={`font-semibold ${status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                                {status}
                            </span>
                        </p>
                        
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>

            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <ClipboardCheck className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Take Attendance
                            </h2>
                            <p className="text-sm text-gray-500">
                                Record student attendance
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {dataLoading || !localStudentData ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-500">Loading student details...</span>
                        </div>
                    ) : (
                        <>
                            {/* Student Info */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {localStudentData.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Roll No: {localStudentData.rollNum}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Class: {localStudentData.sclassName?.sclassName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={submitHandler} className="space-y-6">
                                {/* Subject Selection - Only for "Student" situation */}
                                {situation === "Student" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Subject *
                                        </label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <select
                                                value={subjectName}
                                                onChange={changeHandler}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                            >
                                                <option value="">Choose a subject</option>
                                                {localSubjectsData.map((subject, index) => (
                                                    <option key={subject._id || index} value={subject.subName}>
                                                        {subject.subName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Attendance Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Attendance Status *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStatus('Present')}
                                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                                status === 'Present'
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-green-300'
                                            }`}
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Present
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStatus('Absent')}
                                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                                status === 'Absent'
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-red-300'
                                            }`}
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Absent
                                        </button>
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 py-3 px-6 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            modalLoader || 
                                            !status || 
                                            !date || 
                                            (situation === "Student" && !chosenSubName)
                                        }
                                        className="flex-1 py-3 px-6 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {modalLoader ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Recording...
                                            </div>
                                        ) : (
                                            "Submit"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceModal;