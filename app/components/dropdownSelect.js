import React, { useState, useEffect, useRef } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function DropdownSelect({ label, options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleOptionClick(option) {
    onChange(option); // Met à jour la valeur sélectionnée
    setIsOpen(false); // Ferme le menu après sélection
  }

  function toggleDropdown() {
    setIsOpen((prev) => !prev);
  }

  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="input-container" ref={dropdownRef}>
      <label>{label}</label>
      <button type="button" className="dropdownToggle" onClick={toggleDropdown}>
        <span className={value ? "selected-text" : "placeholder-text"}>
          {value || placeholder}
        </span>
        <span className="arrow">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>
      {isOpen && (
        <ul className="dropdownMenu">
          {options.map((option) => (
            <li key={option} className="dropdownOption" onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
