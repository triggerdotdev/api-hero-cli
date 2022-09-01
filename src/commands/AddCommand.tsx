import { Arg, Command, GlobalOptions } from "@boost/cli";
import { Box } from "ink";
import React from "react";
import { AddingAPI } from "../components/AddingAPI";
import { AuthDisplay } from "../components/AuthDisplay";
import { Logo } from "../components/Logo";
import { SearchResults } from "../components/SearchResults";
import { SelectProject } from "../components/SelectProject";
import { useAddCommand } from "../hooks/useAddCommand";

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
			{states.map((state) => {
				switch (state.type) {
					case "authenticating": {
						return <AuthDisplay key={state.type} onComplete={authToken => setCurrentState({ type: "searching", authToken })} />;
					}
					case "searching": {
						return <SearchResults key={state.type} query={query} onComplete={selectedApi => setCurrentState({ ...state, type: "selectingProject", api: selectedApi })} />;
					}
					case "selectingProject": {
						return <SelectProject key={state.type} authToken={state.authToken} onComplete={(project) => { setCurrentState({ ...state, type: "addingAPI", projectId: project.projectId, workspaceId: project.workspaceId }) }} />;
					}
					case "addingAPI": {
						return <AddingAPI key={state.type} authToken={state.authToken} projectId={state.projectId} workspaceId={state.workspaceId} api={state.api} />;
					}
					default:
						return <></>;
				}
			})}
		</Box>
	);
}