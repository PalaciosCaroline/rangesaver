export default function getActionClass(action) {
    return `action-${action.replace(/\s+/g, "").toLowerCase()}`;
}