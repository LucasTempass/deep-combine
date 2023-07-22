export function combine(original, ...objects) {
    return objects.reduce((acc, obj) => {
        return combineRecursive(acc, obj);
    }, original);
}
function combineRecursive(original, toBeCombined) {
    const result = Object.assign({}, original);
    const keys = Object.keys(toBeCombined).map((k) => k);
    keys.forEach((key) => {
        const newValue = toBeCombined[key];
        const originalValue = key in original ? original[key] : undefined;
        if (originalValue === undefined || originalValue === null) {
            Object.assign(result, { [key]: newValue });
            return;
        }
        if (newValue === null ||
            typeof newValue !== "object" ||
            Array.isArray(newValue)) {
            Object.assign(result, { [key]: newValue });
        }
        else {
            Object.assign(result, {
                [key]: combineRecursive(originalValue, newValue),
            });
        }
    });
    return result;
}
