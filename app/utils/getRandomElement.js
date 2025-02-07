
 // Fonction pour obtenir un élément aléatoire d'un tableau
export default function getRandomElement(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}