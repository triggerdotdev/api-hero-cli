import { useEffect, useState } from "react";
import { API } from "../api/api";
import { APIResult, AuthToken, ProjectConfig } from "../api/types";
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
	_authToken: AuthToken,
	api: APIResult,
	_project: ProjectConfig
): AddAPIReturn {
	const [states, setStates] = useState<AddAPIState[]>([
		{ type: "installingPackage" },
	]);

	useEffect(() => {
		async function run() {
			try {
				await promiseSpawn("npm", ["install", api.packageName]);
				setStates((s) => [...s, { type: "linkingAPIToProject" }]);
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
