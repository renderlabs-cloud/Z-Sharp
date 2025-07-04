"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
var Feature;
(function (Feature_1) {
    class Feature {
        sequence;
        /**
         * Creates a new instance of the Feature class.
         * @param sequence The sequence of parts that make up the feature.
         */
        constructor(sequence) {
            this.sequence = sequence;
        }
        ;
        /**
         * Creates a feature within the given scope and position.
         * @param data - The input data required for feature creation.
         * @param scope - The scope in which the feature is to be created.
         * @param position - The position context for error handling.
         * @returns An object containing the updated scope and optionally the exported data.
         */
        create(data, scope, position) {
            return { scope, export: null }; // Should never happen
        }
        ;
        /**
         * Converts the given feature data into assembly text.
         * @param data The data to be converted into assembly text.
         * @param scope The scope in which the feature is being converted.
         * @returns The assembly text representation of the feature.
         */
        toAssemblyText(data, scope) {
            return '';
        }
        ;
        /**
         * Converts the given feature data into assembly data.
         * @param data The data to be converted into assembly data.
         * @param scope The scope in which the feature is being converted.
         * @returns The assembly data representation of the feature.
         */
        toAssemblyData(data, scope) {
            return '';
        }
        ;
        /**
         * Attempts to match the given parts against the feature sequence.
         * @param parts The parts to be matched against the feature sequence.
         * @param depth The current recursion depth. Used to prevent infinite recursion.
         * @returns An object containing the matched parts, the length of the matched parts, and any exported values.
         */
        match(parts, depth = 0) {
            let i = 0;
            let p = 0;
            let d = 0;
            if (depth++ > 5) {
                return null;
            }
            const matchedParts = [];
            const exports = {};
            while (i < this.sequence.length && p < parts.length) {
                const sequenceItem = this.sequence[i];
                const currentPart = parts[p];
                let matched = false;
                // 1. Match literal part
                if (sequenceItem.part) {
                    if (sequenceItem.part.type === currentPart.type && (sequenceItem.part.value === undefined || sequenceItem.part.value === currentPart.content)) {
                        matchedParts.push(currentPart);
                        matched = true;
                        p++;
                        i++;
                    }
                    ;
                    if (sequenceItem.export) {
                        exports[sequenceItem.export] = currentPart.content;
                    }
                    ;
                }
                // 2. Match sub-feature
                else if (sequenceItem.feature) {
                    const subFeature = new sequenceItem.feature.type();
                    const result = subFeature.match(parts.slice(p), depth - 1);
                    if (result) {
                        matchedParts.push(...result.parts);
                        p += result.length;
                        i++;
                        matched = true;
                        if (sequenceItem.export) {
                            exports[sequenceItem.export] = result.exports;
                        }
                        ;
                    }
                    ;
                }
                // 3. Match OR (any one of the sequences)
                else if (sequenceItem.or) {
                    for (const altSeq of sequenceItem.or) {
                        const altFeature = new Feature(altSeq);
                        const result = altFeature.match(parts.slice(p), depth);
                        if (result) {
                            matchedParts.push(...result.parts);
                            p += result.parts.length;
                            matched = true;
                            if (sequenceItem.export) {
                                exports[sequenceItem.export] = result.exports;
                            }
                            ;
                            break;
                        }
                        ;
                    }
                    ;
                    if (matched) {
                        i++;
                    }
                    ;
                }
                // 4. Match REPEAT (a pattern that can repeat)
                else if (sequenceItem.repeat) {
                    const repeatFeature = new Feature(sequenceItem.repeat);
                    let repeatMatched = true;
                    while (repeatMatched) {
                        const result = repeatFeature.match(parts.slice(p), depth);
                        if (result) {
                            matchedParts.push(...result.parts);
                            p += result.parts.length;
                            if (sequenceItem.export) {
                                if (!exports[sequenceItem.export]) {
                                    exports[sequenceItem.export] = [];
                                }
                                ;
                                exports[sequenceItem.export].push(result.exports);
                            }
                            ;
                        }
                        else {
                            repeatMatched = false;
                        }
                        ;
                    }
                    ;
                    matched = true;
                    i++;
                }
                // 5. Match BETWEEN (all features between to points)
                else if (sequenceItem.between) {
                    let balance = 0;
                    let j = 0;
                    for (const part of parts.slice(p)) {
                        if (part.type == sequenceItem.between.left.part?.type) {
                            balance++;
                        }
                        ;
                        if (part.type == sequenceItem.between.right.part?.type) {
                            balance--;
                        }
                        ;
                        j++;
                        p++;
                        if (balance == -1) {
                            p--;
                            j--;
                            break;
                        }
                        ;
                    }
                    ;
                    const between = parts.slice(p - j, p);
                    if (sequenceItem.export) {
                        exports[sequenceItem.export] = between;
                    }
                    ;
                    matched = true;
                    i++;
                }
                ;
                if (!matched) {
                    if (sequenceItem.required !== false) {
                        return null; // failed and required
                    }
                    else {
                        exports[sequenceItem.export || '?'] = null;
                        i++; // skip optional sequence
                    }
                    ;
                }
                ;
            }
            ;
            if (i === this.sequence.length) {
                return { parts: matchedParts, length: p, exports };
            }
            ;
            return null;
        }
        ;
    }
    Feature_1.Feature = Feature;
    ;
    /**
     * Generate a unique identifier in the given scope.
     * The identifier is base62 and will be at least 64 characters long.
     * The identifier is composed of the following parts:
     * - the label of the scope
     * - the label of the parent scope (if any)
     * - the label of the parent scope (if any)
     * - ...
     * - the label of the current scope
     * - the label of the feature
     * - a base62 random number
     * The identifier is guaranteed to be unique among all features of the same type in the same scope.
     * @param label the label of the feature
     * @param scope the scope to generate the identifier in
     * @returns a unique identifier
     */
    function generateId(label, scope) {
        const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        const size = 64;
        let n = size;
        let current = scope.parent;
        let id = scope.label + '_';
        while (current) {
            id += current.label + '_';
            current = current.parent;
        }
        ;
        id += `$${label}$`;
        while (n > 0) {
            id += base62[Math.floor(Math.random() * 62)];
            n--;
        }
        ;
        return id;
    }
    Feature_1.generateId = generateId;
    ;
    class Scope {
        importer;
        label;
        parent;
        /**
         * Creates a new scope.
         * @param importer the importer of this scope
         * @param label the label of this scope
         * @param parent the parent scope (optional)
         */
        constructor(importer, label, parent) {
            this.importer = importer;
            this.label = label;
            this.parent = parent;
            this._data = parent?._data || {};
            this._alias = parent?._alias || {};
            this.id = generateId(this.label, this);
        }
        ;
        /**
         * Sets a value in the scope.
         * @param name the name of the value to set
         * @param value the value to set
         */
        set(name, value) {
            this._data[name] = value;
        }
        ;
        /**
         * Gets a value from the scope.
         * @param name the name of the value to get
         * @returns the value associated with the given name
         */
        get(name) {
            return this._data[name];
        }
        ;
        /**
         * Creates an alias in the scope.
         * @param name the name of the value to alias
         * @returns the id of the alias
         */
        alias(name) {
            const id = generateId(name, this);
            this._alias[name] = id;
            return id;
        }
        ;
        /**
         * Resolves an alias in the scope.
         * @param name the name of the alias to resolve
         * @returns the id of the resolved alias
         */
        resolve(name) {
            return this._alias[name];
        }
        ; // add generic?
        /**
         * Flattens a path by joining it with a dot.
         * @param path the path to flatten
         * @returns the flattened path
         */
        flatten(path) {
            return path.join('.');
        }
        ;
        /**
         * Generates a random numeric identifier.
         * @returns A string representation of a random numeric identifier.
         */
        generateRandomId() {
            return String(Math.round(Math.random() * 10 ** 10));
        }
        ;
        /**
         * Adds a value to the return stack of the scope.
         * @param value The value to be added to the return stack.
         */
        pushReturn(value) {
            this._return.push(value);
        }
        ;
        _data;
        _alias;
        _return = [];
        id;
    }
    Feature_1.Scope = Scope;
    ;
})(Feature || (exports.Feature = Feature = {}));
;
