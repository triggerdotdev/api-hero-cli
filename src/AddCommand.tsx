import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Text } from "ink";
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
		await this.render(<Component query={query} />);
	}
}

function Component({ query }: { query: string }) {
	return (
		<>
			<Text>More text here</Text>
			<Text>Yet More text here {query}</Text>
			{/* <Confirm label="Do you want to continue?" onSubmit={() => {}} /> */}
		</>
	);
}
