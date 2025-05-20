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
        toAssembly(feature) {
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
    class Scope {
        importer;
        parent;
        constructor(importer, parent) {
            this.importer = importer;
            this.parent = parent;
            this._data = parent?._data || {};
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
        _data;
    }
    Feature_1.Scope = Scope;
    ;
})(Feature || (exports.Feature = Feature = {}));
;
