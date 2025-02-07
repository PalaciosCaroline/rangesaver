  
  export const SCENARIOS = {
    RFI: {
      LJ: ["HJ", "CO", "BTN", "SB", "BB"],
      HJ: ["LJ", "CO", "BTN", "SB", "BB"],
      CO: ["LJ", "HJ", "BTN", "SB", "BB"],
      BTN: ["LJ", "HJ", "CO", "SB", "BB"],
      SB: ["LJ", "HJ", "CO", "BTN", "BB"]
    },
    vs_RFI: {
      "HJ vs LJ": ["3Bet", "Call", "Fold"],
      "CO vs LJ": ["3Bet", "Call", "Fold"],
      "CO vs HJ": ["3Bet", "Call", "Fold"],
      "BTN vs CO": ["3Bet", "Call", "Fold"],
      "BTN vs HJ": ["3Bet", "Call", "Fold"],
      "BTN vs LJ": ["3Bet", "Call", "Fold"],
      "SB vs BTN": ["3Bet", "Call", "Fold"],
      "SB vs CO": ["3Bet", "Call", "Fold"],
      "SB vs HJ": ["3Bet", "Call", "Fold"],
      "SB vs LJ": ["3Bet", "Call", "Fold"],
      "BB vs SB": ["3Bet", "Call", "Fold"]
    },
    vs_3Bet: {
      "LJ vs HJ 3Bet": ["4Bet for Value", "4Bet as Bluff", "Call", "Fold"],
      "HJ vs CO 3Bet": ["4Bet for Value", "4Bet as Bluff", "Call", "Fold"],
      "CO vs BTN 3Bet": ["4Bet for Value", "4Bet as Bluff", "Call", "Fold"],
      "BTN vs SB 3Bet": ["4Bet for Value", "4Bet as Bluff", "Call", "Fold"],
      "SB vs BB 3Bet": ["4Bet for Value", "4Bet as Bluff", "Call", "Fold"]
    }
  };

  