export default function handleAction(action, heroPosition, villainSpot, heroHand, setFeedback, VILLAIN_DECISIONS, RANGES) {
    if (!heroPosition || !villainSpot || !heroHand) {
        console.error("🚨 Erreur : Données manquantes pour vérifier l'action !");
        return;
    }

    const villainRangeKey = VILLAIN_DECISIONS[heroPosition]?.[villainSpot];
    if (!villainRangeKey) {
        console.warn(`⚠️ Clé du Villain non trouvée pour ${heroPosition} contre ${villainSpot}`);
        return;
    }

    const heroRanges = RANGES[heroPosition]?.[villainRangeKey];
    if (!heroRanges) {
        console.warn(`⚠️ Aucune range trouvée pour ${heroPosition} contre ${villainSpot}`);
        return;
    }

    let allValidHands = new Set();
    Object.values(heroRanges).forEach(handList => {
        if (typeof handList === "string") {
            handList = handList.split(" ");
        }
        if (Array.isArray(handList)) {
            handList.forEach(hand => allValidHands.add(hand));
        }
    });

    if (action === "Fold") {
        if (!allValidHands.has(heroHand)) {
            setFeedback("✅ Bonne décision, cette main doit être fold !");
            return true; 
        } else {
            setFeedback("❌ Mauvaise décision, cette main peut être jouée.");
            return false; 
        }
    } else {
        const validHandsForAction = new Set(
            typeof heroRanges[action] === "string" ? heroRanges[action].split(" ") : heroRanges[action] || []
        );

        console.log(`Mains valides pour l'action ${action}:`, Array.from(validHandsForAction));

        if (validHandsForAction.has(heroHand)) {
            setFeedback("✅ Bonne décision !");
            return true;
        } else {
            setFeedback("❌ Mauvaise décision, cette main ne correspond pas.");
            return false;
        }
    }
}
