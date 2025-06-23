import fs from 'fs';
import path from 'path';
import Path from 'path';
import TOML from 'toml';
import Zod from 'zod';

import { Errors } from '~/error';
import { Util } from '~/util';
import { Module } from '~/module';

export namespace Project {
	const name = Zod.union([
		Zod.string(),
		Zod.array(Zod.string()).min(1).max(3),
	]);
	export const ConfigurationSchema = Zod.object(
		{
			'Project': Zod.object({
				'name': Zod.string().optional(),
				'version': Zod.tuple([
					Zod.number().int(),
					Zod.number().int(),
					Zod.number().int()
				]).optional(),
				'description': Zod.string().optional(),
				'Author': Zod.object({
					'name': name
				}).strict(),
				'Contributors': Zod.object({
					'names': Zod.array(name).min(1)
				}),
				'repository': Zod.string().optional(),
				'license': Zod.string().default('MIT'),
			}).strict().optional(),
			'Mods': Zod.array(Zod.object({
				source: Zod.string(),
				config: Zod.string().optional()
			}).strict()).optional(),
			'base': Zod.string().optional()
		}
	).strict();

	export type Configuration = Zod.infer<typeof ConfigurationSchema>;

	/**
	 * Convert a Zod error into a {@link Errors.Project.Invalid} error.
	 *
	 * @param err - the Zod error to convert
	 * @returns the converted error
	 */
	export function error(err: Zod.ZodError) {
		return new Errors.Project.Invalid(`${err.errors.map(err => err.message).join(',\n')}`);
	};


	/**
	 * Validate a project configuration object.
	 *
	 * @param data - the object to validate
	 * @returns a validated project configuration object
	 * @throws {Project.Invalid} if the object is invalid
	 */
	export function validate(data: any) {
		try {
			return ConfigurationSchema.parse(data) || {};
		} catch (_err) {
			const err = _err as Zod.ZodError;
			Util.error(Project.error(err));
		};
		return {}; // This should never happen
	};

	/**
	 * Creates a project configuration by validating the provided data.
	 * @param data The data to be validated and used for creating the project configuration.
	 * @returns The validated project configuration.
	 */
	export function create(data: any) {
		return Project.validate(data);
	};

	/**
	 * Attempts to read the nearest .zsharp.toml file, which stores the project's configuration.
	 * @param path The path to start searching from.
	 * @returns The parsed project configuration, or an empty object if none could be found.
	 */
	export function get(path: string): Configuration {
		try {
			const data = TOML.parse(fs.readFileSync(Path.resolve(path + '/.zsharp.toml')).toString());
			const config: Configuration = Project.create(data);
			config.base = path;
			return config;
		} catch (err) {
			if (path == Path.resolve(path)) {
				return {};
			};
			return Project.get(Path.resolve(path + '/../'));
		};
	};
};