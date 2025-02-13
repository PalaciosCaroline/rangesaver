//components/handMatrixCell;
import React from "react";

function HandMatrixCell({ combo, color, handleComboSelection, readOnly, onMouseDown, onMouseEnter, onTouchStart, onTouchMove }) {


  return (
    <div
      className={`hand-matrix-cell ${readOnly ? "read-only" : ""}`}
      style={{ background: color }}
      onMouseDown={() => !readOnly && onMouseDown(combo)}
      onMouseEnter={() => !readOnly && onMouseEnter(combo)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      data-combo={combo} // ✅ Permet de gérer la sélection sur mobile
    >
      {combo}
    </div>
  );
}

export default HandMatrixCell;
