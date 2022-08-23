import { useEffect, useState } from "react";
import { API } from "../api/api";
import { AuthToken } from "../api/types";
import { loadAuthToken } from "../common/auth";
import { resolveAfter } from "../common/common";

type AuthStatus =
	| Checking
	| CreatingRequestToken
	| WaitingForLogin
	| Authenticated
	| Error;

type Checking = {
	type: "checking";
};

type CreatingRequestToken = {
	type: "creatingRequestToken";
};

type WaitingForLogin = {
	type: "waitingForLogin";
};

type Authenticated = {
	type: "authenticated";
	token: AuthToken;
};

type Error = {
	type: "error";
	error: any;
};

const api = new API();

export function useAuth(): AuthStatus {
	const [status, setStatus] = useState<AuthStatus>({ type: "checking" });

	useEffect(() => {
		async function auth() {
			try {
				const token = await loadAuthToken();
				if (token) {
					setStatus({ type: "authenticated", token });
					return;
				}

				setStatus({ type: "creatingRequestToken" });
				const requestToken = await api.createRequestToken();

				setStatus({ type: "waitingForLogin" });
				const authToken = await Promise.race<AuthToken | undefined>([
					pollForAuthenticated(requestToken),
					resolveAfter(60 * 15).then(),
				]);

				if (authToken != null) {
					setStatus({ type: "authenticated", token: authToken });
					return;
				}

				setStatus({ type: "error", error: new Error("Timeout") });
			} catch (error) {
				setStatus({ type: "error", error });
			}
		}
		auth();
	}, []);

	return status;
}

async function pollForAuthenticated(requestToken: string): Promise<AuthToken> {
	return new Promise((resolve) => {
		const pollDelay = 2000;
		let authToken: AuthToken | undefined;
		const interval = setInterval(async () => {
			authToken = await api.isAuthenticated(requestToken);
			if (authToken) {
				clearInterval(interval);
				resolve(authToken);
			}
		}, pollDelay);
	});
}
