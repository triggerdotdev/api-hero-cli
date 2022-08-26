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
} & WithAuth;

type SelectingProject = {
	type: "selectingProject";
} & WithAuth &
	WithAPIIntegration;

type CreatingConnection = {
	type: "creatingConnection";
} & WithAuth &
	WithAPIIntegration &
	WithProjectIds;

type AddingAPIAuthentication = {
	type: "addingAPIAuthentication";
} & WithAuth &
	WithAPIIntegration &
	WithProjectIds &
	WithIntegrationId;

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

type WithAPIIntegration = {
	apiIntegrationId: string;
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
