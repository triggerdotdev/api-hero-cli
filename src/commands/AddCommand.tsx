import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Box, Text } from "ink";
import React from "react";
import { Logo } from "../components/Logo";
import { createAddMachine } from "../states/add-machine";
import { useMachine } from "@xstate/react";
import { AuthToken } from "../api/types";

type CustomParams = [string];

export default class AddCommand extends Command<GlobalOptions, CustomParams> {
	static override path: string = "add";
	static override description: string = "Add a new API to your project";

	static override params = Arg.params<CustomParams>({
		description: "The API you wish you to add",
		label: "query",
		required: true,
		type: "string",
	});

	async run(query: string) {
		await this.render(<Component query={query} />);
	}
}

function Component({ query }: { query: string }) {
	useMachine(createAddMachine(query), {
		actions: {
			hasAuthToken: (context) => {
				setAuthToken(context.authToken);
			},
			"auth.waiting": () => {
				// setAuthToken(context.authToken);
			},
			"auth.authenticated": (context) => {
				setAuthToken(context.authToken);
			},
		},
	});

	const [authToken, setAuthToken] = React.useState<AuthToken | undefined>(
		undefined
	);

	return (
		<Box flexDirection="column">
			<Logo />
			{authToken === undefined ? (
				<Text>Fetching auth token…</Text>
			) : (
				<Text>Has auth token</Text>
			)}
		</Box>
	);
}
