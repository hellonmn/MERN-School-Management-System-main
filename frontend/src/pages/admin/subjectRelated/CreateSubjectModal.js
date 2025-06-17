import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Loader2,
  Plus,
  Trash2,
  BookOpen,
  Hash,
  Clock,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { addStuff } from "../../../redux/userRelated/userHandle";

const CreateSubjectModal = ({ showModal, onClose, onSuccess, onError }) => {
  const dispatch = useDispatch();
  const { currentUser, status, response } = useSelector((state) => state.user);
  const { sclassesList, loading: classesLoading } = useSelector(
    (state) => state.sclass
  );

  const [step, setStep] = useState(1); // 1: Select Class, 2: Add Subjects
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([
    { subName: "", subCode: "", sessions: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [modalLoader, setModalLoader] = useState(false);

  // Load classes when modal opens
  useEffect(() => {
    if (showModal && currentUser) {
      dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }
  }, [showModal, currentUser, dispatch]);

  // Handle form submission status
  useEffect(() => {
    if (status === "added") {
      handleModalClose();
      setModalLoader(false);
      if (onSuccess) onSuccess();
    } else if (status === "failed") {
      setModalLoader(false);
      if (onError) onError(response);
    } else if (status === "error") {
      setModalLoader(false);
      if (onError) onError("Network Error");
    }
  }, [status, response, onSuccess, onError]);

  const handleModalClose = () => {
    setStep(1);
    setSelectedClass(null);
    setSubjects([{ subName: "", subCode: "", sessions: "" }]);
    setErrors({});
    setSearchTerm("");
    setModalLoader(false);
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};

    subjects.forEach((subject, index) => {
      if (!subject.subName.trim()) {
        newErrors[`subName_${index}`] = "Subject name is required";
      }
      if (!subject.subCode.trim()) {
        newErrors[`subCode_${index}`] = "Subject code is required";
      }
      if (!subject.sessions || parseInt(subject.sessions) <= 0) {
        newErrors[`sessions_${index}`] = "Sessions must be greater than 0";
      }
    });

    // Check for duplicate subject codes
    const codes = subjects.map((s) => s.subCode).filter(Boolean);
    const duplicateCodes = codes.filter(
      (code, index) => codes.indexOf(code) !== index
    );

    if (duplicateCodes.length > 0) {
      subjects.forEach((subject, index) => {
        if (duplicateCodes.includes(subject.subCode)) {
          newErrors[`subCode_${index}`] = "Subject code must be unique";
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

      const newErrors = { ...errors };
      delete newErrors[`subName_${index}`];
      delete newErrors[`subCode_${index}`];
      delete newErrors[`sessions_${index}`];
      setErrors(newErrors);
    }
  };

  const handleCreateSubjects = () => {
    if (!validateForm()) {
      return;
    }

    setModalLoader(true);

    const fields = {
      sclassName: selectedClass._id,
      subjects: subjects.map((subject) => ({
        subName: subject.subName.trim(),
        subCode: subject.subCode.trim(),
        sessions: parseInt(subject.sessions),
      })),
      adminID: currentUser._id,
    };

    dispatch(addStuff(fields, "Subject"));
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        handleModalClose();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showModal]);

  // Filter classes based on search term
  const filteredClasses =
    sclassesList?.filter((sclass) =>
      sclass.sclassName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0000004a] transition-opacity"
        onClick={handleModalClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Select Class" : "Add Subjects"}
            </h2>
            <p className="text-sm text-gray-600">
              {step === 1
                ? "Choose a class to add subjects to"
                : `Adding subjects to ${selectedClass?.sclassName}`}
            </p>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Class Selection
            <div className="flex flex-col gap-6">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Classes List */}
              <div className="max-h-96 overflow-y-auto">
                {classesLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-2">Loading classes...</p>
                  </div>
                ) : filteredClasses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredClasses.map((sclass) => (
                      <button
                        key={sclass._id}
                        onClick={() => {
                          setSelectedClass(sclass);
                          setStep(2);
                        }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {sclass.sclassName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Class ID: {sclass._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No classes found</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Step 2: Subject Creation
            <div className="flex flex-col gap-6">
              {/* Back Button */}
              <button
                onClick={() => setStep(1)}
                className="flex group items-center gap-1 text-indigo-600 hover:text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-xl p-3 w-fit font-medium"
              >
                <ChevronRight className="size-5 rotate-180 group-hover:-translate-x-0.5 transition-all" />
                Change Class
              </button>

              {/* Subject Forms */}
              <div className="flex flex-col gap-6">
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 bg-gray-50 rounded-xl p-6 border border-gray-200"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Subject {index + 1}
                      </h3>
                      {subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={handleRemoveSubject(index)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                      {/* Subject Name */}
                      <div className="flex flex-col gap-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Name *
                        </label>
                        <input
                          type="text"
                          value={subject.subName}
                          onChange={handleSubjectNameChange(index)}
                          placeholder="Enter subject name"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                            errors[`subName_${index}`]
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                        />
                        {errors[`subName_${index}`] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors[`subName_${index}`]}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-4 w-full">
                        <div className="flex flex-col gap-1 w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Code *
                          </label>
                          <input
                            type="text"
                            value={subject.subCode}
                            onChange={handleSubjectCodeChange(index)}
                            placeholder="CODE"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors uppercase ${
                              errors[`subCode_${index}`]
                                ? "border-red-300"
                                : "border-gray-200"
                            }`}
                          />
                          {errors[`subCode_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`subCode_${index}`]}
                            </p>
                          )}
                        </div>

                        {/* Sessions */}
                        <div className="flex flex-col gap-1 w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Sessions *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={subject.sessions}
                            onChange={handleSessionsChange(index)}
                            placeholder="Enter number of sessions"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                              errors[`sessions_${index}`]
                                ? "border-red-300"
                                : "border-gray-200"
                            }`}
                          />
                          {errors[`sessions_${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`sessions_${index}`]}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Subject Code */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Subject Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-500 rounded-xl hover:bg-indigo-200 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 py-3 px-6 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateSubjects}
                  disabled={modalLoader}
                  className="flex-1 py-3 px-6 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {modalLoader ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create Subjects"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSubjectModal;
