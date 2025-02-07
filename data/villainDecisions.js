import { RANGES } from "./ranges";

export const VILLAIN_DECISIONS = {
  "LJ": {
    "vs_HJ_3Bet": RANGES["LJ"]["vs_HJ_3Bet"],
    "vs_CO_3Bet": RANGES["LJ"]["vs_CO_3Bet"],
    "vs_BTN_3Bet": RANGES["LJ"]["vs_BTN_3Bet"],
    "vs_SB_3Bet": RANGES["LJ"]["vs_SB_3Bet"],
    "vs_BB_3Bet": RANGES["LJ"]["vs_BB_3Bet"]
  },
  "HJ": {
    "vs_LJ_RFI": RANGES["HJ"]["vs_LJ_RFI"],
    "vs_CO_3Bet": RANGES["HJ"]["vs_CO_3Bet"],
    "vs_BTN_3Bet": RANGES["HJ"]["vs_BTN_3Bet"],
    "vs_SB_3Bet": RANGES["HJ"]["vs_SB_3Bet"],
    "vs_BB_3Bet": RANGES["HJ"]["vs_BB_3Bet"]
  },
  "CO": {
    "vs_LJ_RFI": RANGES["CO"]["vs_LJ_RFI"],
    "vs_HJ_RFI": RANGES["CO"]["vs_HJ_RFI"],
    "vs_BTN_3Bet": RANGES["CO"]["vs_BTN_3Bet"],
    "vs_SB_3Bet": RANGES["CO"]["vs_SB_3Bet"],
    "vs_BB_3Bet": RANGES["CO"]["vs_BB_3Bet"]
  },
  "BTN": {
    "vs_LJ_RFI": RANGES["BTN"]["vs_LJ_RFI"],
    "vs_HJ_RFI": RANGES["BTN"]["vs_HJ_RFI"],
    "vs_CO_RFI": RANGES["BTN"]["vs_CO_RFI"],
    "vs_SB_3Bet": RANGES["BTN"]["vs_SB_3Bet"],
    "vs_BB_3Bet": RANGES["BTN"]["vs_BB_3Bet"]
  },
  "SB": {
    "vs_LJ_RFI": RANGES["SB"]["vs_LJ_RFI"],
    "vs_HJ_RFI": RANGES["SB"]["vs_HJ_RFI"],
    "vs_CO_RFI": RANGES["SB"]["vs_CO_RFI"],
    "vs_BTN_RFI": RANGES["SB"]["vs_BTN_RFI"],
    "vs_BB_3Bet": RANGES["SB"]["vs_BB_3Bet"],
    "vs_BB_Raise": RANGES["SB"]["vs_BB_Raise"]
  },
  "BB": {
    "vs_LJ_RFI": RANGES["BB"]["vs_LJ_RFI"],
    "vs_HJ_RFI": RANGES["BB"]["vs_HJ_RFI"],
    "vs_CO_RFI": RANGES["BB"]["vs_CO_RFI"],
    "vs_BTN_RFI": RANGES["BB"]["vs_BTN_RFI"],
    "vs_SB_Limp": RANGES["BB"]["vs_SB_Limp"],
    "vs_SB_Raise": RANGES["BB"]["vs_SB_Raise"]
  }
};