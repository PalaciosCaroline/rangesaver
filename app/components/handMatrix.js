"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, saveRangeToFirebase, getDoc } from "@/lib/firebase"; 
import PropTypes from "prop-types";
import "./../styles/handMatrix.css";
import { doc } from "firebase/firestore";
import { combos } from "./../utils/combos";
import Modal from "react-modal";


// 🎯 Actions et couleurs pour la matrice
const actions = {
  allin: "#c72727",
  "3bet": "#FFD700",
  raise: "#ea3b3b",
  call: "#5dd85d",
  fold: "#F5F5F5",
};

// 📌 Positions et blinds
const positions = ["UTG", "MP", "CO", "BTN", "SB", "BB"];
const blindsOptions = [5, 20, 50, 100];

// 📌 Spots possibles
const spotOptions = ["Open", "Single Action", "3bet", "Overcall & Squeeze"];

// 📌 Fonction pour découper la liste en lignes de 13 colonnes
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

function HandMatrix({ rangeId }) {
  const [rangeName, setRangeName] = useState(""); 
  const [handColors, setHandColors] = useState({});
  const [selectedAction, setSelectedAction] = useState("fold");
  const [heroPosition, setHeroPosition] = useState(positions[0]);
  const [spot, setSpot] = useState(""); 
  const [villainPosition, setVillainPosition] = useState("");
  const [villainAction, setVillainAction] = useState(""); 
  const [blinds, setBlinds] = useState(20);
  const [isTouching, setIsTouching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentRangeId, setCurrentRangeId] = useState(uuidv4());

  const [isMouseDown, setIsMouseDown] = useState(false);
  const matrixRef = useRef(null);
  
  useEffect(() => {
    console.log("📌 Nouvelle range créée avec ID :", currentRangeId);
  }, [currentRangeId]);

  
  useEffect(() => {
    if (!rangeId || rangeId === "default-range") return; 
  
    const fetchRange = async () => {
      try {
        const docRef = doc(db, "ranges", rangeId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("📌 Données chargées depuis Firebase :", data);
  
          setRangeName(data.rangeName || ""); 
          setBlinds(data.blinds || 20);
          setHeroPosition(data.heroPosition || positions[0]); // ✅ Ne pas mettre "" si vide
          setSpot(data.spot || spotOptions[0]); // ✅ Valeur par défaut si vide
          setVillainPosition(data.villainPosition || "");
          setHandColors(data.handColors || {});
        }
      } catch (error) {
        console.error("🚨 Erreur lors du chargement de la range :", error);
      }
    };
  
    fetchRange();
  }, [rangeId]); // Déclenche seulement si `rangeId` change

    
  

  const handleComboSelection = (combo) => {
    setHandColors((prev) => ({
      ...prev,
      [combo]: selectedAction
    }));
  };

  useEffect(() => {
    const preventTouchScroll = (event) => event.preventDefault();
    document.addEventListener("touchmove", preventTouchScroll, { passive: false });
  
    return () => {
      document.removeEventListener("touchmove", preventTouchScroll);
    };
  }, []);

  const handleSave = async () => {
    try {
      await saveRangeToFirebase(currentRangeId, rangeName, blinds, heroPosition, spot, villainPosition, handColors);
      setIsModalOpen(false);
      window.location.reload(); // 🔄 Rafraîchit la page après l'enregistrement
    } catch (error) {
      console.error("🚨 Erreur lors de l'enregistrement :", error);
    }
  };
  

  // ✅ Permet de sélectionner plusieurs cases en maintenant le clic de la souris
  const handleMouseDown = (combo) => {
    setIsMouseDown(true);
    handleComboSelection(combo);
  };

  const handleMouseEnter = (combo) => {
    if (isMouseDown) {
      handleComboSelection(combo);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // ✅ Permet de sélectionner plusieurs cases en maintenant le toucher sur mobile
const handleTouchStart = (combo) => {
  setIsTouching(true);
  handleComboSelection(combo);
};

const handleTouchMove = (event) => {
  event.preventDefault(); // ✅ Bloque le scroll mobile
  if (!isTouching) return;

  const touch = event.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  if (target?.dataset?.combo) {
    handleComboSelection(target.dataset.combo);
  }
};

const handleTouchEnd = () => {
  setIsTouching(false);
};

  // ✅ Réinitialisation de la matrice
  const handleReset = async () => {
    setHandColors({}); // Reset en mémoire

    try {
      await saveRangeToFirebase(currentRangeId, rangeName, blinds, heroPosition, spot, villainPosition, {}); 
      console.log("🔄 Range réinitialisée !");
    } catch (error) {
      console.error("🚨 Erreur lors du reset :", error);
    }
  };

  return (
    <div>
      <div className="selectors">
        {/* 📌 Nom de la range */}
        <div className="row">
          <label>Nom :</label>
          <input
            type="text"
            value={rangeName}
            onChange={(e) => setRangeName(e.target.value)}
            placeholder="Nom de la range"
            className="range-input"
          />
        </div>

        {/* 📌 Sélection des Blinds et de la Position du Héros */}
        <div className="row">
          <div className="column">
            <label>BB :</label>
            <select value={blinds} onChange={(e) => setBlinds(Number(e.target.value))}>
              {blindsOptions.map((blind) => (
                <option key={blind} value={blind}>{blind} BB</option>
              ))}
            </select>
          </div>

          <select value={heroPosition} onChange={(e) => {
    setHeroPosition(e.target.value);
}}>
  {positions.map((pos) => (
    <option key={pos} value={pos}>{pos}</option>
  ))}
</select>
        </div>

        {/* 📌 Sélection du Spot et Villain sur la même ligne */}
        <div className="row">
          <div className="column">
            <label>Spot :</label>
            <select value={spot} onChange={(e) => setSpot(e.target.value)}>
              <option value="">Sélectionner un spot</option>
              {spotOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 📌 Sélection de la position du Villain seulement si nécessaire */}
          {(spot === "3bet" || spot === "Overcall & Squeeze" || spot === "Single Action") && (
            <div className="column">
              <label>Villain :</label>
              <select value={villainPosition} onChange={(e) => setVillainPosition(e.target.value)}>
                {positions
                  .filter(pos => pos !== heroPosition)
                  .map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        {/* 📌 Ajout de "Action du Villain" si Spot = "Single Action" */}
{spot === "Single Action" && (
  <div className="row">
    <label>Action du Villain :</label>
    <select value={villainAction} onChange={(e) => setVillainAction(e.target.value)}>
      <option value="">Sélectionner une action</option>
      <option value="Limp">Limp</option>
      <option value="Raise">Raise</option>
      <option value="Allin">Allin</option>
    </select>
  </div>
)}
      </div>

      <div className="save-container">
      <button className="btn buttonTraining save-btn" onClick={() => setIsModalOpen(true)}>
  Enregistrer la range
</button>
</div>
<Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Confirmation de l'enregistrement"
  className="modal-content"
  overlayClassName="modal-overlay"
  ariaHideApp={false}
>
  <h2>Confirmer l&apos;enregistrement</h2>
  <p>Voulez-vous enregistrer cette range ?</p>
  <div className="modal-buttons">
    <button className="confirm-btn" onClick={handleSave}>
      Enregistrer
    </button>
    <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
      Annuler
    </button>
  </div>
</Modal>

      {/* 📌 Matrice des actions */}
      <div className="actions">
        {Object.keys(actions).map((action) => (
          <button
            key={action}
            className={`action-btn ${selectedAction === action ? "selected" : ""}`}
            style={{ backgroundColor: actions[action] }}
            onClick={() => setSelectedAction(action)}
          >
            {action.toUpperCase()}
          </button>
        ))}
       
      </div>
     
      {/* 📌 Matrice des mains */}
      <div 
        className="hand-matrix"
        ref={matrixRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {chunk(combos, 13).map((row, rowIndex) => (
          <div key={rowIndex} className="hand-matrix-row">
            {row.map((combo) => (
              <div
                key={combo}
                className="hand-matrix-cell"
                style={{ backgroundColor: actions[handColors[combo]] || "#F5F5F5" }}
                onMouseDown={() => handleMouseDown(combo)}
                onMouseEnter={() => handleMouseEnter(combo)}
                onTouchStart={() => handleTouchStart(combo)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                data-combo={combo} // Permet d'identifier la case touchée
              >
                {combo}
              </div>
            ))}
          </div>
        ))}
      </div>
     

      <button className="action-btn reset-btn" onClick={handleReset}>
          RESET
        </button>

    </div>
  );
}

HandMatrix.propTypes = {
  rangeId: PropTypes.string,
};

export default HandMatrix;
