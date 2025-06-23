import Zod from 'zod';
import fs from 'fs';
import path from 'path';
import NodeModule from 'module';
import TOML from 'toml';

import * as _ from '@zsharp/module';

import { Util } from '~/util';
import { Feature } from '~/feature';
import { Errors } from '~/error';
import { Project } from '~/project';
import { Z } from '~/zs';

export namespace Module {
	export const ConfigurationSchema = Zod.object({
		name: Zod.string(),
		description: Zod.string().optional(),
		version: Zod.tuple([Zod.number().int(), Zod.number().int(), Zod.number().int()]),
		source: Zod.string(),
		configuration: Zod.string().optional(),
	}).strict();
	export type Configuration = Zod.infer<typeof ConfigurationSchema>;

	/**
	 * Reads and parses a module configuration file from the specified path.
	 *
	 * @param path - The path to the module configuration file.
	 * @returns The parsed module configuration.
	 * @throws {Errors.Project.Invalid} If the file content is invalid.
	 */
	export function get(_path: string, projectPath: string) {
		_path = Util.modPath(_path);
		try {
			const data = TOML.parse(fs.readFileSync(_path).toString());
			const configuration: Configuration = ConfigurationSchema.parse(data);
			const modPath = _path.slice(0, _path.lastIndexOf('/'));
			try {
				const evaluated = require(path.join(modPath, configuration.source)).default(
					configuration.configuration
						? TOML.parse(fs.readFileSync(path.resolve(projectPath, configuration.configuration)).toString())
						: ''
				);
				const module = _.Module.ModuleDataSchema.parse(evaluated);
				return module;
			} catch (err) {
				if (err instanceof Zod.ZodError) {
					Util.error(Project.error(err as Zod.ZodError));
				} else {
					Util.error(new Errors.Project.Invalid((err as Error).message as string));
				};
			} finally {
				return null;
			};
		} catch (err) {
			if (err instanceof Zod.ZodError) {
				Util.error(Project.error(err as Zod.ZodError));
			} else {
				Util.error(new Errors.Project.Invalid((err as Error).message as string));
			};
		};
	};
};