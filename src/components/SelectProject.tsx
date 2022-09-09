import { Input, Select } from "@boost/cli/react";
import { Box, Text } from "ink";
import React, { useEffect } from "react";
import { AuthToken, ProjectConfig } from "../api/types";
import { useSelectProject } from "../hooks/useSelectProject";
import { TaskDisplay } from "./TaskDisplay";

type SelectProjectProps = {
  authToken: AuthToken;
  onComplete: (projectConfig: ProjectConfig) => void;
}

export function SelectProject({ authToken, onComplete }: SelectProjectProps) {
  const { currentState, allStates, selectedProject, selectedWorkspace, createWorkspace, createProject } = useSelectProject(authToken);

  useEffect(() => {
    if (currentState.type === "complete") {
      onComplete(currentState);
    }
  }, [currentState]);

  return <Box flexDirection="column">
    {allStates.map((status, index) => {
      const isComplete = index < allStates.length - 1;
      switch (status.type) {
        case "checking":
          return <TaskDisplay key={status.type} isComplete={isComplete}>Checking for linked project</TaskDisplay>
        case "fetchingProjects":
          return (
            <Box key={status.type} flexDirection="column">
              <TaskDisplay isComplete={isComplete}>No linked project, fetching your projects…</TaskDisplay>
            </Box>)
        case "selectProject":
          if (status.projects.length === 0) {
            return <Text key={status.type}>No projects found, let’s create one</Text>
          } else {
            if (isComplete) {
              return <React.Fragment key="selectProjectComplete"></React.Fragment>
            } else {
              return (
                <Box key={status.type} flexDirection="column">
                  <Select
                    label="Which API Hero project would you like to add this API to?"
                    onSubmit={(value) => {
                      const project = status.projects.find(r => r.id === value);
                      selectedProject(project);
                    }}
                    options={[
                      ...status.projects.map(r => (
                        {
                          label:
                            <Text>{r.workspace.title}/<Text>{r.title}</Text></Text>,
                          value: r.id
                        }
                      )),
                      { label: "Create a new project", value: "" }]}
                  />
                </Box>)
            }
          }
        case "selectWorkspace":
          if (isComplete) {
            return <React.Fragment key="selectWorkspaceComplete"></React.Fragment>
          } else {
            return (
              <Box key={status.type} flexDirection="column">
                <Select
                  label="Select an API Hero workspace to create a project in"
                  onSubmit={(value) => {
                    const workspace = status.workspaces.find(r => r.id === value);
                    selectedWorkspace(workspace);
                  }}
                  options={[
                    ...status.workspaces.map(r => (
                      {
                        label:
                          <Text>{r.title}</Text>,
                        value: r.id
                      }
                    )),
                    { label: "Create a new workspace", value: "" }]}
                />
              </Box>)
          }
        case "createWorkspace":
          if (isComplete) {
            return <React.Fragment key={status.type}></React.Fragment>
          } else {
            return <Input
              key={status.type}
              label="What would you like to call your new workspace?"
              placeholder="<workspace name>"
              onSubmit={createWorkspace}
            />
          }
        case "creatingWorkspace":
          return (
            <TaskDisplay key={status.type} isComplete={isComplete}>
              {isComplete ?
                <Text>Created workspace <Text color="green">{status.name}</Text></Text>
                : `Creating workspace ${status.name}`}
            </TaskDisplay>
          )
        case "createProject":
          if (isComplete) {
            return <React.Fragment key={status.type}></React.Fragment>
          } else {
            return <Input
              key={status.type}
              label="What would you like to call your new project?"
              placeholder="<project name>"
              onSubmit={(name) => createProject({ id: status.workspaceId, title: status.workspaceName }, name)}
            />
          }
        case "creatingProject":
          return (
            <TaskDisplay key={status.type} isComplete={isComplete}>
              {isComplete ?
                <Text>Created project <Text color="green">{status.name}</Text></Text>
                : `Creating project ${status.name}`}
            </TaskDisplay>
          )
        case "savingProject":
          return (
            <TaskDisplay key={status.type} isComplete={isComplete}>Saving project</TaskDisplay>
          )
        case "complete":
          return <TaskDisplay key={status.type} isComplete={true}>API Hero project linked <Text color="green">{status.workspaceName && status.projectName ? `${status.workspaceName}/${status.projectName}` : ""}</Text></TaskDisplay>
        case "error":
          return <Text key={status.type}>Error: {status.error}</Text>
        default:
          throw new Error(`Unknown status: ${JSON.stringify(status)}`);
      }
    })}
  </Box>;
}