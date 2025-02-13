//components/handMatrix;
"use client";
import React, { useState, useEffect, useRef } from "react";
import { COMBOS } from "@/data/combos";
import { actions } from "@/data/actions";
import { chunk } from "../utils/chunk";
import HandMatrixCell from "./handMatrixCell"; 
import "./../styles/handMatrix.css"; 


function HandMatrix({ rangeData, setRangeData, selectedAction, readOnly = false }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const matrixRef = useRef(null);

  /** ✅ Sélectionne une case avec l'action choisie */
  const handleComboSelection = (combo) => {
    if (readOnly) return;
    setRangeData((prev) => ({
      ...prev,
      handColors: {
        ...prev.handColors,
        [combo]: selectedAction,
      },
    }));
  };

  /** ✅ Débute la sélection multiple avec la souris */
  const handleMouseDown = (combo) => {
    setIsMouseDown(true);
    handleComboSelection(combo);
  };

  /** ✅ Continue la sélection en glissant */
  const handleMouseEnter = (combo) => {
    if (isMouseDown) handleComboSelection(combo);
  };

  /** ✅ Arrête la sélection avec la souris */
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  /** ✅ Débute la sélection tactile */
  const handleTouchStart = (event) => {
    setIsTouching(true);
    const combo = event.target.dataset.combo;
    if (combo) {
      handleComboSelection(combo);
    }
  };

  /** ✅ Continue la sélection tactile */
  const handleTouchMove = (event) => {
    if (!isTouching) return;
    const touch = event.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target?.dataset?.combo) {
      handleComboSelection(target.dataset.combo);
    }
  };

  /** ✅ Arrête la sélection tactile */
  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  /** ✅ Empêche le scroll mobile pendant la sélection tactile */
  useEffect(() => {
    const preventScroll = (event) => event.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);


  return (
    <div className="hand-matrix-container">
      <div
        className="hand-matrix"
        ref={matrixRef}
        onMouseDown={(e) => e.preventDefault()} // ✅ Empêche la sélection de texte
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        {chunk(COMBOS, 13).map((row, rowIndex) => (
          <div key={rowIndex} className="hand-matrix-row">
            {row.map((combo) => (
              <HandMatrixCell
                key={combo}
                combo={combo}
                color={actions[rangeData.handColors[combo]] || "#F5F5F5"}
                handleComboSelection={handleComboSelection}
                readOnly={readOnly}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              />
            ))}
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default HandMatrix;
