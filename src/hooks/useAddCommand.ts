import { useState } from "react";
import { APIResult, AuthToken } from "../api/types";

export type AddCommandState =
	| Authenticating
	| Searching
	| SelectingProject
	| AddingAPI
	| Complete
	| Error;

type Authenticating = {
	type: "authenticating";
};

type Searching = {
	type: "searching";
} & WithAuth;

type SelectingProject = {
	type: "selectingProject";
} & WithAuth &
	WithAPIIntegration;

type AddingAPI = {
	type: "addingAPI";
} & WithAuth &
	WithAPIIntegration &
	WithProjectIds;

type Error = {
	type: "error";
	error: any;
};

type Complete = {
	type: "complete";
} & WithAuth &
	WithAPIIntegration &
	WithProjectIds &
	WithIntegrationId;

type WithAuth = {
	authToken: AuthToken;
};

type WithAPIIntegration = { api: APIResult };

type WithProjectIds = {
	workspaceId: string;
	projectId: string;
};

type WithIntegrationId = {
	integrationId: string;
};

type AddCommandReturn = {
	currentState: AddCommandState;
	states: AddCommandState[];
	setCurrentState: (state: AddCommandState) => void;
};

export function useAddCommand(): AddCommandReturn {
	const [states, setStates] = useState<AddCommandState[]>([
		{ type: "authenticating" },
	]);

	const setCurrentState = (state: AddCommandState) => {
		setStates((s) => [...s, state]);
	};

	return {
		currentState: states[states.length - 1]!,
		states,
		setCurrentState,
	};
}
