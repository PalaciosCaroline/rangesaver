export const POSITIONS = ["LJ", "HJ", "CO", "BTN", "SB", "BB"];

 // Ordre fixe des positions visuelles sur la table
export const TABLE_POSITIONS = ["bottom", "left-bottom", "left-top", "top", "right-top", "right-bottom"];

export const POSITIONS_BY_SEATS = {
    6: ["LJ", "HJ", "CO", "BTN", "SB", "BB"],
    8: ["UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
    9: ["UTG", "UTG+1", "UTG+2", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
  };

  // ✅ Nouveau tableau pour le Villain
export const VILLAIN_POSITIONS_BY_SEATS = {
  6: ["Aucun", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
  8: ["Aucun", "UTG", "UTG+1", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
  9: ["Aucun", "UTG", "UTG+1", "UTG+2", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
};

export const CONTEXT_OPTIONS = ["MTT", "Cash Game", "SNG", "Expresso", "Home Game"];