import { useState } from "react";
import { AuthToken } from "../api/types";

export type AddCommandState =
	| Authenticating
	| Searching
	| SelectingProject
	| CreatingConnection
	| AddingAPIAuthentication
	| Complete
	| Error;

type Authenticating = {
	type: "authenticating";
};

type Searching = {
	type: "searching";
	query: string;
} & WithAuth;

type SelectingProject = {
	type: "selectingProject";
} & WithAuth;

type CreatingConnection = {
	type: "creatingConnection";
} & WithAuth &
	WithProjectIds;

type AddingAPIAuthentication = {
	type: "addingAPIAuthentication";
} & WithAuth &
	WithProjectIds &
	WithIntegrationId;

type Error = {
	type: "error";
	error: any;
};

type Complete = {
	type: "complete";
} & WithAuth &
	WithProjectIds &
	WithIntegrationId;

type WithAuth = {
	authToken: AuthToken;
};

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
