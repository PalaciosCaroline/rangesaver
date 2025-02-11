export default function handleAction(action, heroPosition, villainSpot, heroHand, setFeedback, VILLAIN_DECISIONS, RANGES) {
    console.log(`🔍 Vérification de l'action : ${action} pour ${heroPosition} contre ${villainSpot ?? "RFI (Aucun villain encore)"} avec la main ${heroHand}`);

    if (!heroPosition || !heroHand) {
        console.error("🚨 Erreur : Données manquantes pour vérifier l'action !");
        setFeedback("❌ Impossible de vérifier l'action.");
        return false;
    }

    let villainRangeKey;
let heroRanges;

// 1️⃣ Cas où le héros est en RFI (Raise First In)
if (!villainSpot) {
    console.log(`💡 Héros en Open-Raise (RFI) → Aucun villain encore défini.`);
    villainRangeKey = "RFI";
    heroRanges = RANGES[heroPosition]?.["RFI"];
} else {
    // 2️⃣ Cas où un villain existe
    villainRangeKey = VILLAIN_DECISIONS[heroPosition]?.[villainSpot];

    if (!villainRangeKey) {
        console.warn(`⚠️ Clé du Villain non trouvée pour ${heroPosition} contre ${villainSpot}`);
        setFeedback("❌ Erreur : Situation non trouvée.");
        return false;
    }

    heroRanges = RANGES[heroPosition]?.[villainRangeKey];

    if (!heroRanges) {
        console.warn(`⚠️ Aucune range trouvée pour ${heroPosition} contre ${villainSpot}`);
        setFeedback("❌ Impossible de trouver une range.");
        return false;
    }
}

    // 3️⃣ Récupération de toutes les mains jouables
    let allValidHands = new Set();
    Object.values(heroRanges).forEach(handList => {
        if (typeof handList === "string") {
            handList = handList.split(" ");
        }
        if (Array.isArray(handList)) {
            handList.forEach(hand => allValidHands.add(hand));
        }
    });

    console.log(`🎯 Mains jouables pour ${heroPosition} (${villainSpot ?? "RFI"}):`, Array.from(allValidHands));

    // 4️⃣ Vérification de l'action "Fold"
    if (action === "Fold") {
        if (!allValidHands.has(heroHand)) {
            setFeedback("✅ Bonne décision, cette main doit être fold !");
            return true;
        } else {
            setFeedback("❌ Mauvaise décision, cette main peut être jouée.");
            return false;
        }
    }

    // 5️⃣ Vérification des actions autres que "Fold"
    const validHandsForAction = new Set(
        typeof heroRanges[action] === "string" ? heroRanges[action].split(" ") : heroRanges[action] || []
    );

    console.log(`🃏 Mains valides pour l'action ${action}:`, Array.from(validHandsForAction));

    if (validHandsForAction.has(heroHand)) {
        setFeedback("✅ Bonne décision !");
        return true;
    } else {
        setFeedback("❌ Mauvaise décision, cette main ne correspond pas.");
        return false;
    }
}
