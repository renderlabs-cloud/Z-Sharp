import { Feature } from '~/feature';

export namespace BuiltIn {
	export function inject(scope: Feature.Scope) {
		scope.set(`type.${scope.alias('byte')}`, { 
			'name': 'byte',
			'typeRef': {
				'type': {
					'alias': {
						'path': [ 'byte' ]
					}
				}
			}
		});
		return scope;
	};
};