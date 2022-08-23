import { createMachine } from "xstate";
import { API } from "../api/api";
import { AuthToken } from "../api/types";
import { saveAuthToken } from "../common/auth";
import { resolveAfter } from "../common/common";

const api = new API();

type Context = {
	requestToken: string;
	authToken: string;
};

export const authMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgMYCcxl0wAlMAR1TnQBUB7AazADsBiCelsbASxYBuTHgSIlyVGg2YtEoAA71YvdLy5yQAD0QAmACwAGbAFYAbDuMBGHadOXLADh0BmYwBoQAT0SWDpkwaBlgCcxno6FsEA7DoAvrEeaFh4hMRklNSwdMLsYPj49PjY8gA2xABmhQC2KWLpklnSrBqKyqrqSFqIzjrYMcF6UaE2zpZRpu5euobYlhOBOmPBwRau8YkYOADuyCoAYoUAgpscXDz8QszYSdu76Af4x1gIF-S4xGosANoGALotShUnw02gQUXC2AMxn0DmMUThzj0Tg83gQvn8YXBowcA2hDlMUXWIBu2B2+yOJzyBSKpQq1Wum1JdweT0wL0Ebw+XB+-06rSBHVAoOMo2wOKiUQcDkGBKcphR0yMc2MCyWKxFcQSxMZWUKYFZrFU73a7E43D4HKuJN1hANLCNXJY7KExs+PIBbWBnVBvhx2D0Isl8Oc4yilgVaJskMGehD8wi9gcROt6D1dodJrYVMKxTK6Eq+BqKbTm0NvFdXGdnJN7r5gJNIMQwXs2GC+Njjmlkp6EZcwT61kMYwlkochKJLHoEDgGhJojSEky2RkHoFsm9iAhgT0hmcUtClmhzgjoUhgQMlj06J0Bnxmo2yTJ9wpWFXDY3CD0zewpgvZmbUIOIix5TAgp7ngYERRAY8LGCKyaMtm+Bvl6QqINBxj+nCQy-qYsbOKYwQRoiljYDoGHhBKMH3tqyQ2vqpb2uWjooYKXQIDivSBgm0LBIR4wnnoJgxs4BjBH44wikmWokjcZbGpArHrmhaJ+P2Kywi45gSvYxFmCYwQ9PM8ILOOD6YEpjYcX0OgDEM0KmKM4yDL2XExhMtl6BMX7jvEQA */
	createMachine(
		{
			context: { requestToken: "", authToken: "" },
			tsTypes: {} as import("./auth-machine.typegen").Typegen0,
			schema: { context: {} as Context },
			predictableActionArguments: true,
			id: "auth",
			initial: "createRequestToken",
			states: {
				createRequestToken: {
					invoke: {
						src: () => startAuthentication(),
						id: "createRequestToken",
						onDone: [
							{
								actions: "setRequestToken",
								target: "waitForAuth",
							},
						],
						onError: [
							{
								target: "error",
							},
						],
					},
				},
				waitForAuth: {
					entry: "auth.waiting",
					invoke: {
						src: (ctx) => waitForAuthentication(ctx),
						onDone: [
							{
								actions: "setAuthToken",
								target: "storeAuthentication",
							},
						],
						onError: [
							{
								target: "error",
							},
						],
					},
				},
				error: {
					entry: "auth.error",
				},
				storeAuthentication: {
					invoke: {
						src: (ctx) => {
							if (!ctx.authToken) {
								throw new Error("No auth token");
							}

							return saveAuthToken({ tokenId: ctx.authToken });
						},
						onDone: [
							{
								target: "authenticated",
							},
						],
						onError: [
							{
								target: "error",
							},
						],
					},
				},
				authenticated: {
					entry: "auth.authenticated",
					type: "final",
				},
			},
		},
		{
			actions: {
				setRequestToken,
				setAuthToken,
			},
		}
	);

async function startAuthentication() {
	//prompt("Creating request token");
	const requestToken = await api.createRequestToken();
	//prompt("Created request token");
	return requestToken;
}

function setRequestToken(
	ctx: Context,
	event: { type: "done.invoke.createRequestToken"; data: unknown }
) {
	ctx.requestToken = event.data as string;
}

function setAuthToken(ctx: Context, event: { type: string; data: unknown }) {
	ctx.authToken = event.data as string;
}

async function waitForAuthentication(ctx: Context) {
	if (!ctx.requestToken) throw new Error("No request token");

	//prompt(`Login to API Hero: ${api.authUrl}/${ctx.requestToken}`);

	const authToken = await Promise.race<AuthToken | undefined>([
		pollForAuthenticated(ctx.requestToken),
		resolveAfter(60 * 15).then(),
	]);

	if (!authToken) {
		//prompt("Failed to authenticate in time");
		throw new Error("Failed to authenticate in time");
	}

	//prompt("Successfully authenticated");
	return authToken.tokenId;
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
