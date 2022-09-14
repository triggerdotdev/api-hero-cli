import { useCallback, useEffect, useMemo, useState } from "react";
import { API } from "../api/api";
import { APIResult, AuthToken, HTTPClient, ProjectConfig } from "../api/types";
const promiseSpawn = require("@npmcli/promise-spawn");

export type AddAPIState =
	| InstallingMainPackage
	| CheckingFrameworkPackages
	| SelectFrameworkPackage
	| InstallingFrameworkPackage
	| LinkingAPIToProject
	| Complete
	| Error;

type InstallingMainPackage = {
	type: "installingPackage";
};

type CheckingFrameworkPackages = {
	type: "checkingFrameworkPackage";
};

type SelectFrameworkPackage = {
	type: "selectFrameworkPackage";
};

type InstallingFrameworkPackage = {
	type: "installingFrameworkPackage";
	package: "react" | "node";
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
	selectFrameworkPackage: (pkg: "react" | "node") => void;
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

	const currentState = useMemo(() => {
		return states[states.length - 1]!;
	}, [states]);

	useEffect(() => {
		async function run() {
			try {
				switch (currentState.type) {
					case "installingPackage": {
						await promiseSpawn("npm", ["install", selectedApi.packageName]);
						setStates((s) => [...s, { type: "checkingFrameworkPackage" }]);
						break;
					}
					case "checkingFrameworkPackage": {
						const hasFrameworkPackages = await checkingFrameworkPackage();

						if (hasFrameworkPackages) {
							setStates((s) => [...s, { type: "linkingAPIToProject" }]);
						} else {
							setStates((s) => [...s, { type: "selectFrameworkPackage" }]);
						}
						break;
					}
					case "selectFrameworkPackage": {
						break;
					}
					case "installingFrameworkPackage": {
						await promiseSpawn("npm", [
							"install",
							`@apihero/${currentState.package}`,
						]);
						setStates((s) => [...s, { type: "linkingAPIToProject" }]);
						break;
					}
					case "linkingAPIToProject": {
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
						break;
					}
				}
			} catch (error) {
				setStates((s) => [...s, { type: "error", error }]);
			}
		}

		run();
	}, [currentState]);

	const selectFrameworkPackage = useCallback((pkg: "react" | "node") => {
		setStates((s) => [
			...s,
			{ type: "installingFrameworkPackage", package: pkg },
		]);
	}, []);

	return {
		currentState,
		allStates: states,
		selectFrameworkPackage,
	};
}

async function checkingFrameworkPackage(): Promise<boolean> {
	const hasReactPackage = await hasPackage("@apihero/react");
	const hasNodePackage = await hasPackage("@apihero/node");

	return hasReactPackage || hasNodePackage;
}

async function hasPackage(name: string) {
	try {
		const results = await promiseSpawn("npm", ["ls", name]);
		return true;
	} catch (error) {
		return false;
	}
}
