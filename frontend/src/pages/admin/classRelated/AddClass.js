import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from "../../../components/Popup";
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  BookOpen, 
  GraduationCap,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";

const AddClass = () => {
    const [sclassName, setSclassName] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error, tempDetails } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const fields = {
        sclassName,
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    const handleInputChange = (event) => {
        setSclassName(event.target.value);
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 500);
    };

    useEffect(() => {
        if (status === 'added' && tempDetails) {
            navigate("/Admin/classes/class/" + tempDetails._id)
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch, tempDetails]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
                            <p className="text-sm text-gray-600">Set up a new class to organize your students and subjects</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side - Illustration & Benefits */}
                    <div className="space-y-8">
                        {/* Hero Illustration */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <GraduationCap className="w-16 h-16 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Welcome to Class Creation
                                </h3>
                                <p className="text-gray-600">
                                    Build an organized learning environment for your students
                                </p>
                            </div>
                            
                            {/* Floating Elements */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Benefits List */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                What you can do after creating a class:
                            </h4>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">Add and manage students</span>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">Create subjects and curriculum</span>
                                </div>
                                
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-gray-700">Track attendance and progress</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="lg:pl-8">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Details</h2>
                                <p className="text-gray-600">Enter the basic information for your new class</p>
                            </div>

                            <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="className" className="block text-sm font-medium text-gray-700">
                        Class Name *
                      </label>
                      <div className="relative">
                        <input
                          id="className"
                          type="text"
                          value={sclassName}
                          onChange={handleInputChange}
                          placeholder="e.g., Grade 10-A, Science Class..."
                          required
                          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            isTyping ? 'ring-2 ring-blue-200' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">

                    </div>
                  </form>
                        </div>
                    </div>
                </div>
            </div>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
    );
};

export default AddClass;