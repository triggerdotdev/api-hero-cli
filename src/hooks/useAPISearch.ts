import { useEffect, useState } from "react";
import { API } from "../api/api";
import { APIResult, AuthToken } from "../api/types";
import { useAuth } from "./useAuth";

export type APISearchStatus = Waiting | Searching | Results | NoResults | Error;

type Waiting = {
	type: "waiting";
};

type Searching = {
	type: "searching";
};

type Results = {
	type: "results";
	results: APIResult[];
};

type NoResults = {
	type: "noResults";
};

type Error = {
	type: "error";
	error: any;
};

type SelectedAPI = WaitingForResult | NoneResult | APISelection;

type APISelection = {
	type: "api";
} & APIResult;

type NoneResult = {
	type: "none";
};

type WaitingForResult = {
	type: "waiting";
};

type APISearchReturn = [
	APISearchStatus,
	APISearchStatus[],
	SelectedAPI,
	(selectedApi: SelectedAPI) => void
];

const api = new API();

export function useAPISearch(query: string): APISearchReturn {
	const { currentStatus } = useAuth();
	const [statuses, setStatuses] = useState<APISearchStatus[]>([
		{ type: "waiting" },
	]);
	const [selectedApi, setSelectedApi] = useState<SelectedAPI>({
		type: "waiting",
	});

	useEffect(() => {
		if (currentStatus.type !== "authenticated") {
			return;
		}

		async function search(authToken: AuthToken) {
			try {
				setStatuses((s) => [...s, { type: "searching" }]);
				const results = await api.searchAPIs(query, authToken);

				if (results.length === 0) {
					setStatuses((s) => [...s, { type: "noResults" }]);
					return;
				}

				setStatuses((s) => [...s, { type: "results", results }]);
			} catch (error) {
				setStatuses((s) => [...s, { type: "error", error }]);
			}
		}

		search(currentStatus.token);
	}, [currentStatus]);

	return [
		statuses[statuses.length - 1]!,
		statuses,
		selectedApi,
		setSelectedApi,
	];
}
