import { Box, Text } from "ink";
import React from "react";
import { APIResult, AuthToken } from "../api/types";
import { useAddAPI } from "../hooks/useAddAPI";
import { TaskDisplay } from "./TaskDisplay";
import { Tick } from "./Tick";

type AddingAPIProps = {
  authToken: AuthToken;
  projectId: string;
  workspaceId: string;
  api: APIResult;
}

export function AddingAPI({ authToken, projectId, workspaceId, api }: AddingAPIProps) {
  const { currentState, allStates } = useAddAPI(authToken, api, { projectId, workspaceId: workspaceId });

  return <Box flexDirection="column">
    {allStates.map((status, index) => {
      const isComplete = index < allStates.length - 1;
      switch (status.type) {
        case "installingPackage":
          return <TaskDisplay key={status.type} isComplete={isComplete}>Installing package <Text color="green">{api.packageName}</Text></TaskDisplay>
        case "linkingAPIToProject":
          return <TaskDisplay key={status.type} isComplete={isComplete}>Connecting {api.name} to project</TaskDisplay>
        case "complete":
          return (
            <Box flexDirection="column" key={status.type}>
              <Text color="green"><Tick /> {api.name} has been added to your project</Text>
              <Text>Add authentication here: <Text color="gray" underline>{status.client.authenticationUrl}</Text></Text>
            </Box>)
        case "error":
          return <Text key={status.type} color="red">Error: {JSON.stringify(status.error)}</Text>
        default:
          throw new Error(`Unknown status type: ${JSON.stringify(status)}`);
      }
    })}
  </Box>;
}