import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Confirm, Select } from "@boost/cli/react";
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
		await this.render(<Component query={query} />);
	}
}

function Component({ query }: { query: string }) {
	return (
		<Box flexDirection="column">
			<Text>More text here</Text>
			<Text>Yet More text here {query}</Text>
			<Select
				label="What is your favorite fruit?"
				onSubmit={() => {}}
				options={[
					{ label: "🍎 Apple", value: "apple" },
					{ label: "🍌 Banana", value: "banana" },
					{ label: "🥥 Coconut", value: "coconut" },
					{ label: "🍇 Grapes", value: "grapes" },
					{ label: "🥝 Kiwi", value: "kiwi" },
					{ label: "🍋 Lemon", value: "lemon" },
					{ label: "🍈 Melon", value: "melon" },
					{ label: "🍊 Orange", value: "orange" },
					{ label: "🍑 Peach", value: "peach" },
					{ label: "🍐 Pear", value: "pear" },
					{ label: "🍍 Pineapple", value: "pineapple" },
					{ label: "🍓 Strawberry", value: "strawberry" },
					{ label: "🍉 Watermelon", value: "watermelon" },
				]}
			/>
			<Confirm label="Do you want to continue?" onSubmit={() => {}} />
		</Box>
	);
}
