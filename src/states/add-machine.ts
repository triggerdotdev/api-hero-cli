import { createMachine } from "xstate";
import { APIResult, AuthToken } from "../api/types";
import { loadAuthToken } from "../common/auth";
import { API } from "../api/api";
import invariant from "tiny-invariant";
import { authMachine } from "./auth-machine";

const api = new API();

type APISelection = { type: "new" } | (APIResult & { type: "existing" });

type Context = {
	searchQuery: string;
	authToken: AuthToken | undefined;
	apiResults: APIResult[];
	selectedAPI: APISelection | undefined;
	error: any;
};

export function createAddMachine(searchQuery: string) {
	/** @xstate-layout N4IgpgJg5mDOIC5QEMIQHQwC4EECuWAFgCoD2A1mAHYDEEpVY6AllQG4VPb5FmVWJQAB1KxmWZg0EgAHogCMAVgDM6ABzyALAAYA7ADY1AJiNr9R7coA0IAJ6Jlu+ennLtATg1rlZxX4C+-jaoGNwEJJy0YABO0aTR6EIANshYAGbxALaYYLjhfNTSImISUkiyCirqWnqGJmYW1naIJs76bu7t+to6ZtqKgcFo6MjhdAxMrByUI8OjRAhTpADGqZJUANraALpFouLr0nIIKrro7sru2mrXupqeZjb2CK3o7R5dPdfdA0EgIYkYhlopkAMpgZDRZaEcaMFjsTizDBCIFZcGQ6GLBGrUqbHZ7EqHcrHC76dBGRTafoeNTuCl0p4KdroZSs5Q6TQ3byaZRGQb-YYo6LAsEQqEwmJxBLJVIipGA4VosWYpY49ZbXblYoHMqgEmKIxvSlGeRae4adyKRkndxnK6KO53dzyO6KTT8gHROB4JJYWCwyYImae72+2BYjhqhgagk6gTEhRuM5qHkGOmaAzaU3WrRk7yszkZimmRwe4Ze2A+v00SXxRIpdJZeUVqvh1VraP4rX7XFHROm9SGfTuTTDxRqXQGa2aIyqFOWG4qIyT3RqMsYWBgJJgZZYAAKcQAVjusAH4dMmADN9vdwfSMfdxGVh28ZrhD2iXqmbp3OhU5zdEpRQR15HNnRZNkDT0TRNHkMx9HXdBrxPO8H1PWtpQbOUry3FCjxPJ8o1fWNewTBB5H0H8-0cACgJAoxrVnX82VZa4qUAmdfj+KhSAgOBpABMJeEiEjPwqBAAFoKRZB0bjg51x10ZQtEYvQXA6QxLW0fRYPcRD5kIUTdXE5Rx3QAxdAsE0fkuBjmnIq43g6dklKMQweT5P4ASFEV0XFIz4y-BBALOPQNEs5dORpVTf3zZTeVtLxDEQlswwCvtyPkUw3icWl+lZJQ4LA1QWPuGc6UXZREJ4gAlUM-XSsjTWyyj5Py5TFCK+yMzUapRx8fQ4OUl0qq84ZGAAdxwPcAElGqCpQqXJfQ3R0e0rlnRjPHMnRTVM64sv6d0xo3XDb3w3d5vExbtGWxRugnZ17h8HMDHUSC7gsW1NACE6kLOrBIFQk8ruOIbbpqFabjpZRKJzNRFHe1k-HMKkjBHRCMNBhRvGTTlYZWla6QdacBycGdTKMe57oo9dsck+4ZNXLNaSUCdlM0a07iRtwoK+VwEMCfwgA */
	return createMachine({
		context: {
			authToken: undefined,
			searchQuery: searchQuery,
			apiResults: [],
			error: null,
			selectedAPI: undefined,
		},
		schema: { context: {} as Context },
		predictableActionArguments: true,
		id: "add",
		initial: "getAuthToken",
		states: {
			getAuthToken: {
				invoke: {
					src: async (ctx) => {
						const token = await loadAuthToken();
						if (!token) {
							throw new Error("No auth token found");
						}

						ctx.authToken = token;
						return token;
					},
					id: "getAuthToken",
					onDone: [
						{
							actions: "hasAuthToken",
							target: "performSearch",
						},
					],
					onError: [
						{
							actions: "noAuthToken",
							target: "auth",
						},
					],
				},
			},
			auth: {
				invoke: {
					src: () => authMachine,
					onDone: [
						{
							target: "performSearch",
						},
					],
				},
			},
			performSearch: {
				invoke: {
					src: async (ctx) => {
						if (!ctx.authToken) {
							throw new Error("No auth token found");
						}

						// ux.action.start(`Searching for ${ctx.searchQuery}`);
						ctx.apiResults = await api.searchAPIs(
							ctx.searchQuery,
							ctx.authToken
						);
						// ux.action.stop();

						return ctx.apiResults;
					},
					onDone: [
						{
							actions: "hasResults",
							cond: (ctx) => ctx.apiResults.length > 0,
							target: "results",
						},
						{
							actions: "noResults",
							cond: (ctx) => ctx.apiResults.length === 0,
							target: "noResults",
						},
					],
					onError: [
						{
							target: "error",
						},
					],
				},
			},
			results: {
				invoke: {
					src: async (ctx) => {
						//prompt(`Found ${ctx.apiResults.length} results`);

						invariant(ctx.apiResults.length > 0, "No results found");

						try {
							// const selected = await inquirer.prompt<{ api: APISelection }>({
							//   type: "list",
							//   name: "api",
							//   message: "Which API would you like to add?",
							//   choices: [
							//     ...ctx.apiResults.map((result) => ({
							//       name: `${result.name} ${terminalLink(
							//         "Documentation",
							//         result.url
							//       )}`,
							//       value: { ...result, type: "existing" },
							//     })),
							//     // new inquirer.Separator(),
							//     // {
							//     //   name: "Add an API using an Open API Spec",
							//     //   value: {
							//     //     type: "new",
							//     //   },
							//     // },
							//   ],
							// });

							// const result = await new Select({
							// 	name: "api",
							// 	message: "Which FUCKING API would you like to add?",
							// 	choices: [
							// 		...ctx.apiResults.map((result) => ({
							// 			name: `${result.name} ${result.url}`,
							// 			value: result.name,
							// 		})),
							// 	],
							// }).run();

							// console.log(result);

							//prompt(`You selected ${JSON.stringify(result)}`);

							// const selectedAPI = ctx.apiResults.find(a => a.name === result.value);

							// ctx.selectedAPI = selected.api;
							ctx.selectedAPI = undefined;

							return ctx.selectedAPI;
						} catch (error) {
							ctx.error = error;
							//prompt(`Inquirer error: ${error}`);
							return ctx.error;
						}
					},
					onDone: [
						{
							cond: (ctx) => ctx.selectedAPI?.type === "existing",
							target: "selectProject",
						},
						{
							cond: (ctx) => ctx.selectedAPI?.type === "new",
							target: "newAPI",
						},
					],
					onError: [
						{
							target: "error",
						},
					],
				},
			},
			noResults: {
				invoke: {
					src: async () => {
						//prompt(`Found no results`);
					},
				},
			},
			newAPI: {
				invoke: {
					src: async () => {
						// return inquirer.//prompt({
						//   type: "input",
						//   name: "name",
						//   message: "What would you like to call this API?",
						// });
					},
				},
			},
			selectProject: {
				invoke: {
					src: async (ctx) => {
						invariant(ctx.selectedAPI, "No API selected");
						invariant(ctx.selectedAPI.type === "existing", "API must exist");

						//prompt(`Selected ${ctx.selectedAPI.name}`);
					},
					onDone: [
						{
							target: "selectedProject",
						},
					],
					onError: [
						{
							target: "error",
						},
					],
				},
			},
			selectedProject: {},
			error: {
				invoke: {
					src: async (_ctx) => {
						//prompt(`Error: ${ctx.error}`);
					},
				},
				type: "final",
			},
		},
	});
}
