import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CgClose } from "react-icons/cg";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }} 
      onClick={handleOverlayClick}
    >
      <div
        className="rounded-lg shadow-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-7 right-7 text-gray-900 hover:text-gray-700 cursor-pointer"
        >
          <CgClose size={25}/>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
