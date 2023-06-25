"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine = void 0;
function combine(original, ...objects) {
    return objects.reduce((acc, obj) => {
        return combineRecursive(acc, obj);
    }, original);
}
exports.combine = combine;
function combineRecursive(original, toBeCombined) {
    const result = Object.assign({}, original);
    const keys = Object.keys(toBeCombined).map((k) => k);
    keys.forEach((key) => {
        const newValue = toBeCombined[key];
        const originalValue = original[key];
        if (originalValue === undefined || originalValue === null) {
            result[key] = newValue;
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
