import { Box, Newline, Text } from "ink";
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
  const { allStates } = useAddAPI(authToken, api, { projectId, workspaceId: workspaceId });

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
            <Box flexDirection="column" key={status.type} marginTop={1}>
              <Text><Tick /><Text color="green"> Success:</Text> {api.name} has been added to your project</Text>
              <Box flexDirection="column" borderColor={"yellow"} borderStyle="double" padding={1}>
                <Text color="yellow" bold>Instructions</Text>
                <Text>1. Install the node or react package</Text>
                <Box flexDirection="column" marginLeft={4}>
                  <Text><Text color={"gray"}>React:</Text> npm install @apihero/react</Text>
                  <Text><Text color={"gray"}>Node:</Text> npm install @apihero/node</Text>
                </Box>
                <Text color={"red"}> TODO: Add your project environment variable</Text>
                <Text>2. View your project: <Text underline>{status.client.authenticationUrl}</Text></Text>
                <Text>3. View the documentation: <Text underline>https://docs.apihero.run</Text></Text>
              </Box>
            </Box>)
        case "error":
          return <Text key={status.type} color="red">Error: {JSON.stringify(status.error)}</Text>
        default:
          throw new Error(`Unknown status type: ${JSON.stringify(status)}`);
      }
    })}
  </Box>;
}