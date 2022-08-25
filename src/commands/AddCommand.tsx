import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Box } from "ink";
import React from "react";
import { AuthDisplay } from "../components/AuthDisplay";
import { Logo } from "../components/Logo";
import { SearchResults } from "../components/SearchResults";
import { SelectProject } from "../components/SelectProject";
import { AddCommandState, useAddCommand } from "../hooks/useAddCommand";

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
	const { states, setCurrentState } = useAddCommand();

	return (
		<Box flexDirection="column">
			<Logo />
			{states.map((state, index) => (<State key={index} state={state} query={query} setCurrentState={setCurrentState} />))}
		</Box>
	);
}

function State({ state, query, setCurrentState }: { state: AddCommandState, query: string, setCurrentState: (state: AddCommandState) => void }) {
	switch (state.type) {
		case "authenticating": {
			return <AuthDisplay onComplete={authToken => setCurrentState({ type: "searching", query: query, authToken })} />;
		}
		case "searching": {
			return <SearchResults query={query} />;
		}
		case "selectingProject": {
			return <SelectProject />;
		}
		default:
			return <></>;
	}
}