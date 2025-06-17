import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { X, Loader2, BarChart3, User, Hash, BookOpen, Award, CheckCircle } from 'lucide-react';

const StudentMarksModal = ({ showModal, onClose, studentId, subjectId = null, onSuccess, situation }) => {
    const dispatch = useDispatch();
    const { currentUser, userDetails } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);

    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState(subjectId || "");
    const [marksObtained, setMarksObtained] = useState("");
    const [totalMarks, setTotalMarks] = useState("100");
    const [modalLoader, setModalLoader] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Only load data once when modal opens
    useEffect(() => {
        if (showModal && studentId && !dataLoaded) {
            console.log('Loading initial data for marks modal');
            setDataLoaded(true);
            
            if (subjectId) {
                setChosenSubName(subjectId);
            }
            
            // Load student details
            dispatch(getUserDetails(studentId, "Student"));
        }
    }, [showModal, studentId, dataLoaded, subjectId, dispatch]);

    // Load subjects when we have student details (only if no specific subject)
    useEffect(() => {
        if (userDetails && showModal && !subjectId && userDetails.sclassName?._id) {
            if (!subjectsList || subjectsList.length === 0) {
                dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
            }
        }
    }, [userDetails, showModal, subjectId, subjectsList, dispatch]);

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
            console.error('Marks submission error:', error);
        }
    }, [hasSubmitted, response, statestatus, error, onSuccess]);

    // Reset when modal closes
    useEffect(() => {
        if (!showModal) {
            setSubjectName("");
            setChosenSubName(subjectId || "");
            setMarksObtained("");
            setTotalMarks("100");
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
        
        if (parseInt(marksObtained) > parseInt(totalMarks)) {
            return;
        }
        
        setModalLoader(true);
        setHasSubmitted(true);
        
        const fields = { subName: chosenSubName, marksObtained };
        dispatch(updateStudentFields(studentId, fields, "UpdateExamResult"));
    };

    // Calculate percentage
    const percentage = marksObtained && totalMarks ? 
        ((parseInt(marksObtained) / parseInt(totalMarks)) * 100).toFixed(1) : 0;

    const getGrade = (percentage) => {
        if (percentage >= 90) return { grade: 'A+', color: 'green' };
        if (percentage >= 80) return { grade: 'A', color: 'green' };
        if (percentage >= 70) return { grade: 'B+', color: 'indigo' };
        if (percentage >= 60) return { grade: 'B', color: 'indigo' };
        if (percentage >= 50) return { grade: 'C', color: 'yellow' };
        if (percentage >= 40) return { grade: 'D', color: 'orange' };
        return { grade: 'F', color: 'red' };
    };

    const gradeInfo = getGrade(percentage);

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
                                Marks Submitted!
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {userDetails?.name} scored{' '}
                                <span className="font-semibold text-indigo-600">
                                    {marksObtained}/{totalMarks}
                                </span>
                                {' '}({percentage}%)
                            </p>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-center gap-4">
                                    <div className={`text-center bg-${gradeInfo.color}-100 p-3 rounded-lg`}>
                                        <p className="text-xs font-medium text-gray-600">Grade</p>
                                        <p className={`text-xl font-bold text-${gradeInfo.color}-600`}>
                                            {gradeInfo.grade}
                                        </p>
                                    </div>
                                    <div className="text-center bg-indigo-100 p-3 rounded-lg">
                                        <p className="text-xs font-medium text-gray-600">Percentage</p>
                                        <p className="text-xl font-bold text-indigo-600">
                                            {percentage}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#0000004a]" onClick={handleClose}></div>

            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Enter Marks
                            </h2>
                            <p className="text-sm text-gray-500">
                                Record student exam results
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
                <div className="flex flex-col gap-2 p-4">
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
                                        {currentUser?.teachSubject && (
                                            <p className="text-sm text-indigo-600 font-medium">
                                                Subject: {currentUser.teachSubject.subName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={submitHandler} className="flex flex-col gap-6">
                                {/* Subject Selection - only show if no subject is pre-selected */}
                                {!subjectId && (
                                    <div className="flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Subject *
                                        </label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <select
                                                value={subjectName}
                                                onChange={changeHandler}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            >
                                                <option value="">Select Subject</option>
                                                {subjectsList?.map((subject, index) => (
                                                    <option key={index} value={subject.subName}>
                                                        {subject.subName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Total Marks */}
                                <div className="flex flex-col gap-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Total Marks *
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="number"
                                            value={totalMarks}
                                            onChange={(e) => setTotalMarks(e.target.value)}
                                            min="1"
                                            max="1000"
                                            required
                                            className="w-full outline-none pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            placeholder="Enter total marks"
                                        />
                                    </div>
                                </div>

                                {/* Marks Obtained */}
                                <div className="flex flex-col gap-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Marks Obtained *
                                    </label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="number"
                                            value={marksObtained}
                                            onChange={(e) => setMarksObtained(e.target.value)}
                                            min="0"
                                            max={totalMarks}
                                            required
                                            className="w-full outline-none pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                            placeholder="Enter marks obtained"
                                        />
                                    </div>
                                    {marksObtained && parseInt(marksObtained) > parseInt(totalMarks) && (
                                        <p className="text-sm text-red-600">
                                            Marks obtained cannot exceed total marks
                                        </p>
                                    )}
                                </div>

                                {/* Grade Preview */}
                                {marksObtained && totalMarks && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Percentage</p>
                                                <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-600">Grade</p>
                                                <p className={`text-2xl font-bold text-${gradeInfo.color}-500`}>
                                                    {gradeInfo.grade}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                        disabled={modalLoader || !marksObtained || !totalMarks || (!subjectId && !chosenSubName) || parseInt(marksObtained) > parseInt(totalMarks)}
                                        className="flex-1 py-3 px-6 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {modalLoader ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting...
                                            </div>
                                        ) : (
                                            "Submit Marks"
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

export default StudentMarksModal;