import { Feature } from '~/feature';
import { Parts } from '~/parts';
import { Errors } from '~/error';
export declare namespace Syntax {
    type SyntaxData = {
        export: any;
        scope: Feature.Scope;
        feature: Feature.Feature<any>;
    };
    /**
     * Converts an array of {@link Parts.Part} into an array of {@link SyntaxData}.
     *
     * @param parts The array of parts to convert.
     * @param scope The scope to use when creating features.
     * @param position The position to use when creating features.
     * @param _features The array of features to use when creating features. Defaults to {@link official}.
     * @param path The path of the file being converted. Used for error reporting.
     * @returns An array of {@link SyntaxData} representing the features found in the parts.
     */
    function toFeatures(parts: Parts.Part[], scope: Feature.Scope, position: Errors.Position, _features?: (any)[], path?: string): SyntaxData[];
}
