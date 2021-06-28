"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRuntimeAndUnchangedProps = exports.updatePersistables = exports.objectWithPersistablesToObject = void 0;
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
// Todo: see if there's a better way to do this with Mobx
function objectWithPersistablesToObject(objWithPersistables, keysToSerialize = []) {
    const obj = mobx_1.toJS(objWithPersistables);
    const keysSet = new Set(keysToSerialize);
    Object.keys(obj).forEach((key) => {
        const val = objWithPersistables[key];
        const valIsPersistable = val && val.toObject;
        // Delete any keys we don't want to serialize, if a keep list is provided
        if (keysToSerialize.length && !keysSet.has(key)) {
            delete obj[key];
            return;
        }
        // Val is persistable, call toObject
        if (valIsPersistable)
            obj[key] = val.toObject();
        else if (Array.isArray(val))
            // Scan array for persistables and seriazile.
            obj[key] = val.map((item) => (item === null || item === void 0 ? void 0 : item.toObject) ? item.toObject() : item);
        else
            obj[key] = val;
    });
    return obj;
}
exports.objectWithPersistablesToObject = objectWithPersistablesToObject;
// Basically does an Object.assign, except if the target is a Persistable, will call updateFromObject on
// that Persistable. It does not recurse. Will only update top level Persistables.
function updatePersistables(target, obj) {
    if (obj === undefined)
        return;
    for (const key in target) {
        if (key in obj) {
            const currentVal = target[key];
            const currentValIsPersistableObject = currentVal === null || currentVal === void 0 ? void 0 : currentVal.updateFromObject;
            const newVal = obj[key];
            if (currentValIsPersistableObject)
                currentVal.updateFromObject(newVal);
            else
                target[key] = newVal;
        }
    }
}
exports.updatePersistables = updatePersistables;
// Don't persist properties that haven't changed from the defaults, and don't
// keep properties not on the comparable class
function deleteRuntimeAndUnchangedProps(changedObj, defaultObject) {
    const obj = changedObj;
    const defaultObj = defaultObject;
    const defaultKeys = new Set(Object.keys(defaultObj));
    Object.keys(obj).forEach((prop) => {
        const key = prop;
        if (!defaultKeys.has(key)) {
            // Don't persist any runtime props not in the persistable instance
            delete obj[key];
            return;
        }
        const currentValue = obj[key];
        const defaultValue = defaultObj[key];
        if (Util_1.isEqual(currentValue, defaultValue)) {
            // Don't persist any values that weren't changed from the default
            delete obj[key];
        }
    });
    return obj;
}
exports.deleteRuntimeAndUnchangedProps = deleteRuntimeAndUnchangedProps;
//# sourceMappingURL=Persistable.js.map