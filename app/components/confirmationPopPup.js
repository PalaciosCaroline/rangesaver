import React from "react";
import { motion } from "framer-motion";
import "../styles/confirmationPopup.css"; // Ajoute un fichier CSS pour le style

const ConfirmationPopup = ({ message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="popup-box"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <p>{message}</p>
        <div className="popup-actions">
          <button className="popup-confirm" onClick={onConfirm}>Confirmer</button>
          <button className="popup-cancel" onClick={onCancel}>Annuler</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationPopup;
