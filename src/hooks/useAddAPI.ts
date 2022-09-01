import { useEffect, useState } from "react";
import { API } from "../api/api";
import { APIResult, AuthToken, HTTPClient, ProjectConfig } from "../api/types";
const promiseSpawn = require("@npmcli/promise-spawn");

export type AddAPIState =
	| InstallingPackage
	| LinkingAPIToProject
	| Complete
	| Error;

type InstallingPackage = {
	type: "installingPackage";
};

type LinkingAPIToProject = {
	type: "linkingAPIToProject";
};

type Complete = {
	type: "complete";
	client: HTTPClient;
};

type Error = {
	type: "error";
	error: any;
};

type AddAPIReturn = {
	currentState: AddAPIState;
	allStates: AddAPIState[];
};

const api = new API();

export function useAddAPI(
	authToken: AuthToken,
	selectedApi: APIResult,
	project: ProjectConfig
): AddAPIReturn {
	const [states, setStates] = useState<AddAPIState[]>([
		{ type: "installingPackage" },
	]);

	useEffect(() => {
		async function run() {
			try {
				await promiseSpawn("npm", ["install", selectedApi.packageName]);
				setStates((s) => [...s, { type: "linkingAPIToProject" }]);

				const response = await api.linkToApi(
					project.workspaceId,
					project.projectId,
					selectedApi.id,
					authToken
				);

				if (response.success) {
					setStates((s) => [...s, { type: "complete", client: response }]);
				} else {
					throw new Error(response.error);
				}
			} catch (error) {
				setStates((s) => [...s, { type: "error", error }]);
			}
		}

		run();
	}, []);

	return {
		currentState: states[states.length - 1]!,
		allStates: states,
	};
}
