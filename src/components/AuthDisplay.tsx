import { Box, Text } from "ink";
import React, { useEffect } from "react";
import { AuthToken } from "../api/types";
import { AuthStatus, useAuth } from "../hooks/useAuth";
import { Link } from "./Link";
import { TaskDisplay } from "./TaskDisplay";

type AuthDisplayProps = {
	onComplete: (authToken: AuthToken) => void;
}

export function AuthDisplay({ onComplete }: AuthDisplayProps) {
	const { statuses, currentStatus } = useAuth();

	useEffect(() => {
		if (currentStatus.type === "authenticated") {
			onComplete(currentStatus.token);
		}
	}, [currentStatus])

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
			if (isComplete) {
				return <></>
			} else {
				return (
					<Box flexDirection="column">
						<Text><Text color="yellow">→</Text> <Text>You need to login here: </Text><Text color="yellow" underline>{status.url}</Text></Text>
					</Box>)
			}
		case "savingAuthToken":
			return <></>
		case "authenticated":
			return <TaskDisplay isComplete={true}>Authenticated</TaskDisplay>
		case "error":
			return <Text color="red">Error: {JSON.stringify(status.error)}</Text>
	}
}

