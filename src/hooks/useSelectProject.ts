import { useCallback, useEffect, useState } from "react";
import { API } from "../api/api";
import {
	AuthToken,
	ProjectDefinition,
	ProjectWithWorkspace,
	WorkspaceDefinition,
} from "../api/types";
import { loadProject } from "../common/project";

export type SelectProjectState =
	| Checking
	| FetchingProjects
	| SelectProject
	| SelectWorkspace
	| CreateWorkspace
	| CreatingWorkspace
	| CreateProject
	| CreatingProject
	| Complete
	| Error;

type Checking = {
	type: "checking";
};

type FetchingProjects = {
	type: "fetchingProjects";
};

type SelectProject = {
	type: "selectProject";
	projects: ProjectWithWorkspace[];
};

type SelectWorkspace = {
	type: "selectWorkspace";
};

type CreateWorkspace = {
	type: "createWorkspace";
};

type CreatingWorkspace = {
	type: "creatingWorkspace";
	name: string;
};

type CreateProject = {
	type: "createProject";
	workspaceName: string;
	workspaceId: string;
};

type CreatingProject = {
	type: "creatingProject";
	name: string;
};

type Complete = {
	type: "complete";
	projectId: string;
	workspaceId: string;
	projectName?: string;
	workspaceName?: string;
};

type Error = {
	type: "error";
	error: any;
};

type SelectProjectReturn = {
	currentState: SelectProjectState;
	allStates: SelectProjectState[];
	selectedProject: (project: ProjectWithWorkspace | undefined) => void;
	selectedWorkspace: (selectedWorkspace: WorkspaceDefinition) => void;
	createWorkspace: (createWorkspace: string) => void;
	createProject: (
		workspace: WorkspaceDefinition,
		createProject: string
	) => void;
};

const api = new API();

export function useSelectProject(authToken: AuthToken): SelectProjectReturn {
	const [statuses, setStatuses] = useState<SelectProjectState[]>([
		{ type: "checking" },
	]);

	useEffect(() => {
		async function selectProject() {
			try {
				const loadedProjectConfig = await loadProject();
				if (loadedProjectConfig) {
					setStatuses((s) => [
						...s,
						{
							type: "complete",
							...loadedProjectConfig,
						},
					]);
					return;
				}

				setStatuses((s) => [...s, { type: "fetchingProjects" }]);
				const workspaces = await api.getWorkspaces(authToken);
				const projects: ProjectWithWorkspace[] = workspaces.flatMap(
					(workspace) => {
						return workspace.projects.map((project) => {
							return {
								...project,
								workspace: {
									id: workspace.id,
									name: workspace.name,
								},
							};
						});
					}
				);

				setStatuses((s) => [...s, { type: "selectProject", projects }]);

				if (projects.length === 0) {
					setStatuses((s) => [...s, { type: "createWorkspace" }]);
				}
			} catch (error) {
				setStatuses((s) => [...s, { type: "error", error }]);
			}
		}
		selectProject();
	}, []);

	const selectProject = useCallback(
		(project: ProjectWithWorkspace | undefined) => {
			if (project === undefined) {
				setStatuses((s) => [...s, { type: "selectWorkspace" }]);
				return;
			}

			setStatuses((s) => [
				...s,
				{
					type: "complete",
					projectId: project.id,
					projectName: project.name,
					workspaceId: project.workspace.id,
					workspaceName: project.workspace.name,
				},
			]);
		},
		[]
	);

	const selectWorkspace = useCallback((workspace: WorkspaceDefinition) => {
		setStatuses((s) => [
			...s,
			{
				type: "createProject",
				workspaceId: workspace.id,
				workspaceName: workspace.name,
			},
		]);
	}, []);

	const createWorkspace = useCallback((name: string) => {
		setStatuses((s) => [
			...s,
			{
				type: "creatingWorkspace",
				name,
			},
		]);

		async function create(name: string) {
			try {
				const workspace = await api.createWorkspace(name, authToken);
				setStatuses((s) => [
					...s,
					{
						type: "createProject",
						workspaceId: workspace.id,
						workspaceName: workspace.name,
					},
				]);
			} catch (error) {
				setStatuses((s) => [...s, { type: "error", error }]);
			}
		}
		create(name);
	}, []);

	const createProject = useCallback(
		(workspace: WorkspaceDefinition, name: string) => {
			setStatuses((s) => [
				...s,
				{
					type: "creatingProject",
					name,
				},
			]);

			async function create(name: string) {
				try {
					const project = await api.createProject(
						name,
						workspace.id,
						authToken
					);
					setStatuses((s) => [
						...s,
						{
							type: "complete",
							workspaceId: workspace.id,
							workspaceName: workspace.name,
							projectId: project.id,
							projectName: project.name,
						},
					]);
				} catch (error) {
					setStatuses((s) => [...s, { type: "error", error }]);
				}
			}
			create(name);
		},
		[]
	);

	return {
		currentState: statuses[statuses.length - 1]!,
		allStates: statuses,
		selectedProject: selectProject,
		selectedWorkspace: selectWorkspace,
		createWorkspace: createWorkspace,
		createProject: createProject,
	};
}
