import { useCallback, useEffect, useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { API } from "../api/api";
import { APIResult, AuthToken, HTTPClient, ProjectConfig } from "../api/types";
import { detect, PM } from "detect-package-manager";
const promiseSpawn = require("@npmcli/promise-spawn");

export type AddAPIState =
	| InstallingMainPackage
	| CheckingFrameworkPackages
	| SelectFrameworkPackage
	| InstallingFrameworkPackage
	| LinkingAPIToProject
	| Complete
	| Error;

type LinkingAPIToProject = {
	type: "linkingAPIToProject";
};

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
	const [client, setClient] = useState<HTTPClient | undefined>(undefined);
	const [packageManager, setPackageManager] = useState<PM | undefined>(
		undefined
	);
	const [states, setStates] = useState<AddAPIState[]>([
		{ type: "linkingAPIToProject" },
	]);

	const currentState = useMemo(() => {
		return states[states.length - 1]!;
	}, [states]);

	useEffect(() => {
		async function run() {
			try {
				switch (currentState.type) {
					case "linkingAPIToProject": {
						const response = await api.linkToApi(
							project.workspaceId,
							project.projectId,
							selectedApi.id,
							authToken
						);

						if (response.success) {
							setClient(response);
							setStates((s) => [...s, { type: "installingPackage" }]);
						} else {
							throw new Error(response.error);
						}
						break;
					}
					case "installingPackage": {
						const packageManager = await detect();
						setPackageManager(packageManager);
						await installPackage(packageManager, selectedApi.packageName);
						setStates((s) => [...s, { type: "checkingFrameworkPackage" }]);
						break;
					}
					case "checkingFrameworkPackage": {
						invariant(packageManager, "Package manager is not set");
						const hasFrameworkPackages = await checkingFrameworkPackage(
							packageManager
						);

						if (hasFrameworkPackages) {
							invariant(client, "Client is not set");
							setStates((s) => [...s, { type: "complete", client: client }]);
						} else {
							setStates((s) => [...s, { type: "selectFrameworkPackage" }]);
						}
						break;
					}
					case "selectFrameworkPackage": {
						break;
					}
					case "installingFrameworkPackage": {
						invariant(packageManager, "Package manager is not set");
						await installPackage(
							packageManager,
							`@apihero/${currentState.package}`
						);
						invariant(client, "Client should be defined");
						setStates((s) => [...s, { type: "complete", client: client }]);
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

async function checkingFrameworkPackage(packageManager: PM): Promise<boolean> {
	const hasReactPackage = await hasPackage(packageManager, "@apihero/react");
	const hasNodePackage = await hasPackage(packageManager, "@apihero/node");

	return hasReactPackage || hasNodePackage;
}

async function hasPackage(packageManager: PM, packageName: string) {
	try {
		switch (packageManager) {
			case "npm": {
				await promiseSpawn("npm", ["list", packageName]);
				return true;
			}
			case "yarn": {
				await promiseSpawn("yarn", ["list", packageName]);
				return true;
			}
			case "pnpm": {
				const result = await promiseSpawn("pnpm", [
					"--json",
					"list",
					packageName,
				]);

				const resultText = result.stdout?.toString();

				if (!resultText) {
					return false;
				}

				const json = JSON.parse(resultText);

				for (const project of json) {
					if (
						project.dependencies !== undefined &&
						project.dependencies[packageName] !== undefined
					) {
						return true;
					}
				}

				return false;
			}
		}
	} catch (error) {
		return false;
	}
}

async function installPackage(packageManager: PM, packageName: string) {
	switch (packageManager) {
		case "npm":
			await promiseSpawn("npm", ["install", packageName]);
			break;
		case "yarn":
			await promiseSpawn("yarn", ["add", packageName]);
			break;
		case "pnpm":
			await promiseSpawn("pnpm", ["add", packageName]);
			break;
	}
}
