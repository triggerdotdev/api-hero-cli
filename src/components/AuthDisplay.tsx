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
			return <Text>You need to login here: {status.url}</Text>
		case "savingAuthToken":
			return <></>
		case "authenticated":
			return <Text>Authenticated</Text>
		case "error":
			return <Text>Error: {JSON.stringify(status.error)}</Text>
	}
}

