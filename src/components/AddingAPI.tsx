import { Select } from "@boost/cli/react";
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
  const { allStates, selectFrameworkPackage } = useAddAPI(authToken, api, { projectId, workspaceId: workspaceId });

  return <Box flexDirection="column">
    {allStates.map((status, index) => {
      const isComplete = index < allStates.length - 1;
      switch (status.type) {
        case "installingPackage":
          return <TaskDisplay key={status.type} isComplete={isComplete}>Installing package <Text color="green">{api.packageName}</Text></TaskDisplay>
        case "checkingFrameworkPackage":
          return <React.Fragment key={status.type}></React.Fragment>
        case "selectFrameworkPackage":
          if (isComplete) {
            return <React.Fragment key={status.type}></React.Fragment>
          } else {
            return (
              <Box key={status.type} flexDirection="column">
                <Select
                  label="Which API Hero framework would you like to install?"
                  onSubmit={(value) => {
                    selectFrameworkPackage(value === "react" ? "react" : "node");
                  }}
                  options={[{ label: "React", value: "react" }, { label: "Node", value: "node" }]}
                />
              </Box>)
          }
        case "installingFrameworkPackage":
          return <TaskDisplay key={status.type} isComplete={isComplete}>Installing {status.package} framework package</TaskDisplay>
        case "linkingAPIToProject":
          return <TaskDisplay key={status.type} isComplete={isComplete}>Connecting {api.name} to project</TaskDisplay>
        case "complete":
          return (
            <Box flexDirection="column" key={status.type} marginTop={1}>
              <Text><Tick /><Text color="green"> Success:</Text> {api.name} has been added to your project</Text>
              <Box flexDirection="column" borderColor={"yellow"} borderStyle="double" padding={1} marginTop={1}>
                <Text color="yellow" bold>Instructions</Text>
                <Text>1. View your project: <Text underline>{status.client.authenticationUrl}</Text></Text>
                <Text>2. View our getting started guide: <Text underline>https://docs.apihero.run</Text></Text>
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