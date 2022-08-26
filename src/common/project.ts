/* eslint-disable unicorn/no-useless-undefined */
import fs from "node:fs";
import {
	ProjectConfig,
	projectConfigSchema,
	ProjectDefinition,
	WorkspaceDefinition,
} from "../api/types";

const workspaceEnvName = "APIHERO_WORKSPACE_ID";
const projectEnvName = "APIHERO_PROJECT_ID";
const projectFileName = "apihero.json";

export function loadProject(): Promise<ProjectConfig | undefined> {
	const envProject = loadProjectFromEnvironment();
	if (envProject) {
		return Promise.resolve(envProject);
	}

	return new Promise((resolve) => {
		fs.readFile(`./${projectFileName}`, (error, data) => {
			if (error) {
				resolve(undefined);
				return;
			}

			const json = JSON.parse(data.toString());
			const parsed = projectConfigSchema.safeParse(json);
			if (parsed.success) {
				resolve(parsed.data);
			} else {
				resolve(undefined);
			}
		});
	});
}

export function saveProject(
	workspaceId: string,
	projectId: string
): Promise<void> {
	return new Promise((resolve) => {
		const data: ProjectConfig = { workspaceId, projectId };

		fs.writeFile(`./${projectFileName}`, JSON.stringify(data), (error) => {
			if (error) {
				throw error;
			}

			resolve();
		});
	});
}

if (process.env["NODE_ENV"] !== "production") {
	require("dotenv").config();
}

function loadProjectFromEnvironment(): ProjectConfig | undefined {
	const workspaceId = process.env[workspaceEnvName];
	const projectId = process.env[projectEnvName];
	if (workspaceId && projectId) {
		return {
			workspaceId,
			projectId,
		};
	}

	return undefined;
}
