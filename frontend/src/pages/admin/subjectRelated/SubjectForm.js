import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import { 
    Plus, 
    Trash2, 
    Save, 
    ArrowLeft, 
    BookOpen,
    Hash,
    Clock,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id;
    const adminID = currentUser._id;
    const address = "Subject";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        subjects.forEach((subject, index) => {
            if (!subject.subName.trim()) {
                newErrors[`subName_${index}`] = 'Subject name is required';
            }
            if (!subject.subCode.trim()) {
                newErrors[`subCode_${index}`] = 'Subject code is required';
            }
            if (!subject.sessions || parseInt(subject.sessions) <= 0) {
                newErrors[`sessions_${index}`] = 'Sessions must be greater than 0';
            }
        });

        // Check for duplicate subject codes
        const codes = subjects.map(s => s.subCode).filter(Boolean);
        const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
        
        if (duplicateCodes.length > 0) {
            subjects.forEach((subject, index) => {
                if (duplicateCodes.includes(subject.subCode)) {
                    newErrors[`subCode_${index}`] = 'Subject code must be unique';
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
        
        // Clear error if field becomes valid
        if (event.target.value.trim() && errors[`subName_${index}`]) {
            const newErrors = { ...errors };
            delete newErrors[`subName_${index}`];
            setErrors(newErrors);
        }
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value.toUpperCase();
        setSubjects(newSubjects);
        
        // Clear error if field becomes valid
        if (event.target.value.trim() && errors[`subCode_${index}`]) {
            const newErrors = { ...errors };
            delete newErrors[`subCode_${index}`];
            setErrors(newErrors);
        }
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || "";
        setSubjects(newSubjects);
        
        // Clear error if field becomes valid
        if (parseInt(event.target.value) > 0 && errors[`sessions_${index}`]) {
            const newErrors = { ...errors };
            delete newErrors[`sessions_${index}`];
            setErrors(newErrors);
        }
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        if (subjects.length > 1) {
            const newSubjects = [...subjects];
            newSubjects.splice(index, 1);
            setSubjects(newSubjects);
            
            // Clear errors for removed subject
            const newErrors = { ...errors };
            delete newErrors[`subName_${index}`];
            delete newErrors[`subCode_${index}`];
            delete newErrors[`sessions_${index}`];
            setErrors(newErrors);
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            setMessage("Please fix the errors below before submitting.");
            setShowPopup(true);
            return;
        }
        
        setLoader(true);
        
        const fields = {
            sclassName,
            subjects: subjects.map((subject) => ({
                subName: subject.subName.trim(),
                subCode: subject.subCode.trim(),
                sessions: parseInt(subject.sessions),
            })),
            adminID,
        };
        
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl());
            setLoader(false);
        }
        else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        }
        else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    const SubjectCard = ({ subject, index, isLast }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {subject.subName || `Subject ${index + 1}`}
                    </h3>
                </div>
                
                {!isLast && (
                    <button
                        type="button"
                        onClick={handleRemoveSubject(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Subject"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Subject Name */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Name *
                    </label>
                    <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={subject.subName}
                            onChange={handleSubjectNameChange(index)}
                            placeholder="Enter subject name"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors[`subName_${index}`] 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300'
                            }`}
                        />
                        {subject.subName && !errors[`subName_${index}`] && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                    </div>
                    {errors[`subName_${index}`] && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors[`subName_${index}`]}
                        </p>
                    )}
                </div>

                {/* Subject Code */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Code *
                    </label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={subject.subCode}
                            onChange={handleSubjectCodeChange(index)}
                            placeholder="CODE"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase ${
                                errors[`subCode_${index}`] 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300'
                            }`}
                        />
                        {subject.subCode && !errors[`subCode_${index}`] && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                    </div>
                    {errors[`subCode_${index}`] && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors[`subCode_${index}`]}
                        </p>
                    )}
                </div>
            </div>

            {/* Sessions Field */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Sessions *
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="number"
                            min="1"
                            value={subject.sessions}
                            onChange={handleSessionsChange(index)}
                            placeholder="0"
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors[`sessions_${index}`] 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300'
                            }`}
                        />
                        {subject.sessions && parseInt(subject.sessions) > 0 && !errors[`sessions_${index}`] && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                    </div>
                    {errors[`sessions_${index}`] && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors[`sessions_${index}`]}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );



    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate("/Admin/subjects")}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add Subjects</h1>
                            <p className="text-gray-600 mt-1">Create subjects for your class curriculum</p>
                        </div>
                    </div>


                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Subject Cards */}
                    <div className="space-y-6">
                        {subjects.map((subject, index) => (
                            <SubjectCard 
                                key={index} 
                                subject={subject} 
                                index={index} 
                                isLast={index === 0 && subjects.length === 1}
                            />
                        ))}
                    </div>

                    {/* Add Subject Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleAddSubject}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Subject
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/Admin/subjects")}
                                className="flex-1 px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                disabled={loader}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {loader ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Subjects
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default SubjectForm;