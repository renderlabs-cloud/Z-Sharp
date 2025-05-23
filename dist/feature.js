"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feature = void 0;
var Feature;
(function (Feature_1) {
    class Feature {
        sequence;
        constructor(sequence) {
            this.sequence = sequence;
        }
        ;
        create(data, scope, position) {
            return { scope };
        }
        ;
        toAssembly(feature, scope) {
            return '';
        }
        ;
        match(parts) {
            let i = 0;
            let p = 0;
            let d = 0;
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
                    const result = subFeature.match(parts.slice(p));
                    if (result) {
                        matchedParts.push(...result.parts);
                        p += result.parts.length;
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
                        const result = altFeature.match(parts.slice(p));
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
                    if (matched)
                        i++;
                }
                // 4. Match REPEAT (a pattern that can repeat)
                else if (sequenceItem.repeat) {
                    const repeatFeature = new Feature(sequenceItem.repeat);
                    let repeatMatched = true;
                    while (repeatMatched) {
                        const result = repeatFeature.match(parts.slice(p));
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
                return { parts: matchedParts, exports };
            }
            ;
            return null;
        }
        ;
    }
    Feature_1.Feature = Feature;
    ;
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
        constructor(importer, label, parent) {
            this.importer = importer;
            this.label = label;
            this.parent = parent;
            this._data = parent?._data || {};
            this._alias = parent?._alias || {};
            this.id = generateId(this.label, this);
        }
        ;
        set(name, value) {
            this._data[name] = value;
        }
        ;
        get(name) {
            return this._data[name];
        }
        ;
        alias(name) {
            const id = generateId(name, this);
            this._alias[name] = id;
            return id;
        }
        ;
        resolve(name) {
            return this._alias[name];
        }
        ;
        _data;
        _alias;
        id;
    }
    Feature_1.Scope = Scope;
    ;
})(Feature || (exports.Feature = Feature = {}));
;
