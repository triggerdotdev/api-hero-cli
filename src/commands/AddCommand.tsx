import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Box, Text } from "ink";
import React from "react";
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
	const { statuses } = useAuth();

	return (
		<Box flexDirection="column">
			<Logo />

			{statuses.map((status) => (
				<Text key={status.type}>{status.type}</Text>
			))}
			<Text>{query}</Text>
		</Box>
	);
}
