import { Parts } from '~/parts';
import { Syntax } from '~/syntax';
import { Feature } from '~/feature';
import ora from 'ora';
export var Z;
(function (Z) {
    function toAssembly(content, importer, path) {
        let spinner = ora('');
        spinner.color = 'blue';
        spinner.text = 'Parting';
        const parts = Parts.toParts(content, path);
        spinner.text = 'Applying syntax';
        const parsed = Syntax.toFeatures(parts, new Feature.Scope(importer));
        spinner.stop();
        return ""; // REPLACE!
    }
    Z.toAssembly = toAssembly;
    ;
})(Z || (Z = {}));
;
