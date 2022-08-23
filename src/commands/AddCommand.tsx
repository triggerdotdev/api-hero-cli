import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Box, Text } from "ink";
import React from "react";
import { AuthDisplay } from "../components/AuthDisplay";
import { Logo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";

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
	const { currentStatus } = useAuth();

	return (
		<Box flexDirection="column">
			<Logo />

			<AuthDisplay />

			{currentStatus.type === "authenticated" && <Text>{query}</Text>}
		</Box>
	);
}
