import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Style } from "@boost/cli/react";
import { Box, Text } from "ink";
import React from "react";

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
		return (
			<Box>
				<Text>
					Searching for <Style type="success">{query}</Style>
				</Text>
			</Box>
		);
	}
}
