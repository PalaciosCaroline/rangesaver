//components/actionsSelector;
import React from "react";
import { actions } from "@/data/actions";

function ActionsSelector({ selectedAction, setSelectedAction }) {
  return (
    <div className="actions-selector">
      <div className="actions">
        {Object.keys(actions).map((action) => (
          <button
            key={action}
            className={`action-btn ${selectedAction === action ? "selected" : ""}`}
            style={{ background: actions[action] }}
            onClick={() => setSelectedAction(action)}
          >
            {action.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActionsSelector;
