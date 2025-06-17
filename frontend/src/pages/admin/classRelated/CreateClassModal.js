import { useState, useRef, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";

const CreateClassModal = ({ showModal, onClose, onSuccess, onError }) => {
  const dispatch = useDispatch();
  const { currentUser, status, response } = useSelector((state) => state.user);
  
  const [sclassName, setSclassName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);

  // Add ref for the input to maintain focus
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (showModal && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [showModal]);

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
    setSclassName("");
    setIsTyping(false);
    setModalLoader(false);
    // Clear any pending timers
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    onClose();
  };

  // Fixed handleInputChange function
  const handleInputChange = (event) => {
    setSclassName(event.target.value);
    setIsTyping(true);
    
    // Clear existing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Set new timer
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const handleCreateClass = (event) => {
    event.preventDefault();
    setModalLoader(true);
    const fields = {
      sclassName,
      adminID: currentUser._id,
    };
    dispatch(addStuff(fields, "Sclass"));
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

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#0000004a] transition-opacity"
        onClick={handleModalClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-fit max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Class
            </h2>
            <p className="text-sm text-gray-600">
              Create new class to organize your students and subjects
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
        <div>
          <div className="flex w-full">
            {/* Form */}
            <div className="w-full">
              <div className="bg-gray-50 rounded-xl w-full p-6 pt-4">
                <form onSubmit={handleCreateClass} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="className"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Class Name *
                    </label>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        id="className"
                        type="text"
                        value={sclassName}
                        onChange={handleInputChange}
                        placeholder="e.g., Grade 10-A, Science Class..."
                        required
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          isTyping ? "ring-2 ring-blue-200" : ""
                        }`}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Choose a descriptive name for your class
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={modalLoader || !sclassName.trim()}
                      className="w-full py-3 px-6 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                      {modalLoader ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating Class...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          Create
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="w-full py-3 px-6 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClassModal;