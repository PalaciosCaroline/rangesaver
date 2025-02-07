import { useState } from "react";
import { POSITIONS } from "../data/positions";
import { ACTIONS } from "../data/actions";
import { SCENARIOS } from "../data/scenarios";
import { RANGES } from "../data/ranges";

const TrainingSession = () => {
  const [hero, setHero] = useState(null);
  const [villain, setVillain] = useState(null);
  const [situation, setSituation] = useState(null);
  const [possibleActions, setPossibleActions] = useState([]);

  const startSession = () => {
    const heroPosition = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    let villainPosition;
    do {
      villainPosition = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    } while (villainPosition === heroPosition);

    const scenario = SCENARIOS.RFI[heroPosition] ? "RFI" : "vs_RFI";
    const actions = ACTIONS[scenario];

    setHero(heroPosition);
    setVillain(villainPosition);
    setSituation(scenario);
    setPossibleActions(actions);
  };

  return (
    <div>
      <button onClick={startSession}>Démarrer une session</button>
      {hero && villain && (
        <div>
          <p>Héros : {hero}</p>
          <p>Villain : {villain}</p>
          <p>Situation : {situation}</p>
          <p>Actions possibles : {possibleActions.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default TrainingSession;
