import { Feature } from '~/feature';

export namespace BuiltIn {
	export function inject(scope: Feature.Scope) {
		scope.set(`type.${scope.alias('byte')}`, {
			'name': 'byte',
			'typeRef': {
				'type': {
					'alias': {
						'path': ['byte']
					}
				}
			}
		});
		scope.set(`type.${scope.alias('void')}`, {
			'name': 'void',
			'typeRef': {
				'type': {
					'alias': {
						'path': ['void']
					}
				}
			}
		});
		scope.set(`type.${scope.alias('never')}`, {
			'name': 'never',
			'typeRef': {
				'type': {
					'alias': {
						'path': ['never']
					}
				}
			}
		});
		return scope;
	};
};