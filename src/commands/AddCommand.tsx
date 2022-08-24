import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Box } from "ink";
import React from "react";
import { AuthDisplay } from "../components/AuthDisplay";
import { Logo } from "../components/Logo";
import { SearchResults } from "../components/SearchResults";

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
		await this.render(<Add query={query} />);
	}
}

function Add({ query }: { query: string }) {

	return (
		<Box flexDirection="column">
			<Logo />

			<AuthDisplay />
			<SearchResults query={query} />
		</Box>
	);
}
