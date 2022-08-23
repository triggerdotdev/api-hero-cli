import { Box, Text } from "ink";
import React from "react";
import { AuthStatus, useAuth } from "../hooks/useAuth";
import { TaskDisplay } from "./TaskDisplay";

export function AuthDisplay() {
	const { statuses } = useAuth();

	return (
		<Box flexDirection="column">
			{statuses.map((status, index) => (
				<Status key={status.type} status={status} isComplete={index < statuses.length - 1} />
			))}
		</Box>
	);
}

function Status({ status, isComplete }: { status: AuthStatus, isComplete: boolean }) {
	switch (status.type) {
		case "checking":
			return <></>
		case "creatingRequestToken":
			return <TaskDisplay isComplete={isComplete}>Creating request token</TaskDisplay>;
		case "waitingForLogin":
			return <TaskDisplay isComplete={isComplete}>You need to login here: <Text color="yellow" underline={true}>{status.url}</Text></TaskDisplay>
		case "savingAuthToken":
			return <></>
		case "authenticated":
			return <TaskDisplay isComplete={true}>Authenticated</TaskDisplay>
		case "error":
			return <Text>Error: {JSON.stringify(status.error)}</Text>
	}
}

