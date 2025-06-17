import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { X, Loader2, ClipboardCheck, User, Calendar, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import successLotie from '../../../assets/success.json';

const StudentAttendanceModal = ({ showModal, onClose, studentId, subjectId = null, onSuccess, situation }) => {
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);

    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState(subjectId || "");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [modalLoader, setModalLoader] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Only load data once when modal opens
    useEffect(() => {
        if (showModal && studentId && !dataLoaded) {
            console.log('Loading initial data for modal');
            setDataLoaded(true);
            
            // Set today's date
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
            
            // Load student details
            dispatch(getUserDetails(studentId, "Student"));
        }
    }, [showModal, studentId, dataLoaded, dispatch]);

    // Load subjects when we have student details
    useEffect(() => {
        if (userDetails && showModal && situation === "Student" && userDetails.sclassName?._id) {
            if (!subjectsList || subjectsList.length === 0) {
                dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
            }
        }
    }, [userDetails, showModal, situation, subjectsList, dispatch]);

    // Handle submission response
    useEffect(() => {
        if (hasSubmitted && (response || statestatus === "added")) {
            setModalLoader(false);
            setHasSubmitted(false);
            setShowSuccess(true);
            
            setTimeout(() => {
                if (onSuccess) onSuccess();
                handleClose();
            }, 2000);
        } else if (hasSubmitted && error) {
            setModalLoader(false);
            setHasSubmitted(false);
            console.error('Submission error:', error);
        }
    }, [hasSubmitted, response, statestatus, error, onSuccess]);

    // Reset when modal closes
    useEffect(() => {
        if (!showModal) {
            setSubjectName("");
            setChosenSubName(subjectId || "");
            setStatus("");
            setDate("");
            setModalLoader(false);
            setShowSuccess(false);
            setDataLoaded(false);
            setHasSubmitted(false);
        }
    }, [showModal, subjectId]);

    const handleClose = () => {
        onClose();
    };

    const changeHandler = (event) => {
        const selectedSubject = subjectsList?.find(
            (subject) => subject.subName === event.target.value
        );
        if (selectedSubject) {
            setSubjectName(selectedSubject.subName);
            setChosenSubName(selectedSubject._id);
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();
        
        if (!status || !date) return;
        if (situation === "Student" && !chosenSubName) return;
        
        setModalLoader(true);
        setHasSubmitted(true);
        
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
                <div className="fixed inset-0 bg-[#0000004a] transition-opacity"></div>
                
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
                    <div className="flex flex-col justify-center items-center gap-6 p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Attendance Recorded!
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {userDetails?.name}'s attendance has been successfully recorded as{' '}
                                <span className={`font-semibold ${status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                                    {status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#0000004a]" onClick={handleClose}></div>

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
                <div className="flex flex-col gap-4 p-4">
                    {!userDetails ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-500">Loading student details...</span>
                        </div>
                    ) : (
                        <>
                            {/* Student Info */}
                            <div className="bg-gray-100 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {userDetails.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Roll No: {userDetails.rollNum}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Class: {userDetails.sclassName?.sclassName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={submitHandler} className="flex flex-col gap-4">
                                {/* Subject Selection - Only for "Student" situation */}
                                {situation === "Student" && (
                                    <div className='flex flex-col gap-1'>
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
                                                {subjectsList?.map((subject, index) => (
                                                    <option key={subject._id || index} value={subject.subName}>
                                                        {subject.subName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Attendance Status */}
                                <div className='flex flex-col gap-1'>
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
                                <div className='flex flex-col gap-1'>
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