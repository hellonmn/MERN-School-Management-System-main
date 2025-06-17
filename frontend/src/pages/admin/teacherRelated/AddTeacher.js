import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { 
    GraduationCap, 
    User, 
    Mail, 
    Lock, 
    BookOpen, 
    School, 
    ArrowLeft,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Save
} from 'lucide-react';

const AddTeacher = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const subjectID = params.id;

    const { status, response, error } = useSelector(state => state.user);
    const { subjectDetails } = useSelector((state) => state.sclass);

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
    }, [dispatch, subjectID]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const role = "Teacher";
    const school = subjectDetails && subjectDetails.school;
    const teachSubject = subjectDetails && subjectDetails._id;
    const teachSclass = subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id;

    const validateForm = () => {
        const newErrors = {};
        
        if (!name.trim()) {
            newErrors.name = 'Teacher name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        // Clear error when user starts typing
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }

        switch (field) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const fields = { name, email, password, role, school, teachSubject, teachSclass };

    const submitHandler = (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            setMessage("Please fix the errors below before submitting.");
            setShowPopup(true);
            return;
        }
        
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate("/Admin/teachers");
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

    const LoadingState = () => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-pulse space-y-8 w-full max-w-2xl mx-auto p-8">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );

    if (!subjectDetails) {
        return <LoadingState />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate("/Admin/teachers")}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
                            <p className="text-gray-600 mt-1">Create a new teacher account and assign to subject</p>
                        </div>
                    </div>
                </div>

                {/* Subject Assignment Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Assignment Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-700">Subject</p>
                                <p className="text-blue-900 font-semibold">{subjectDetails.subName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <School className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-700">Class</p>
                                <p className="text-blue-900 font-semibold">
                                    {subjectDetails.sclassName?.sclassName || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Teacher Information</h2>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter teacher's full name"
                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.name 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    autoComplete="name"
                                />
                                {name && !errors.name && (
                                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                                )}
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter teacher's email address"
                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.email 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    autoComplete="email"
                                />
                                {email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Enter a secure password"
                                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.password 
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password}
                                </p>
                            )}
                            {password && !errors.password && (
                                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Password meets requirements
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    At least 6 characters long
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Contains uppercase letter (recommended)
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Contains number (recommended)
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/Admin/teachers")}
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
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Create Teacher Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Summary Card */}
                <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        What happens next?
                    </h3>
                    <ul className="text-green-800 space-y-2">
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                            The teacher account will be created with the provided credentials
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                            They will be automatically assigned to teach <strong>{subjectDetails.subName}</strong>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                            The teacher can login and start managing their assigned class
                        </li>
                    </ul>
                </div>
            </div>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddTeacher;