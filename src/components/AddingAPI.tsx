import { Box, Text } from "ink";
import React from "react";
import { APIResult, AuthToken } from "../api/types";
import { useAddAPI } from "../hooks/useAddAPI";
import { TaskDisplay } from "./TaskDisplay";

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
          return <TaskDisplay key={status.type} isComplete={isComplete}>Installing package {api.packageName}</TaskDisplay>
        default:
          throw new Error(`Unknown status: ${JSON.stringify(status)}`);
      }
    })}
  </Box>;
}