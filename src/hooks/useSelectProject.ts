import { useCallback, useEffect, useState } from "react";
import { API } from "../api/api";
import {
	AuthToken,
	ProjectDefinition,
	ProjectWithWorkspace,
	WorkspaceDefinition,
} from "../api/types";
import { loadProject, saveProject } from "../common/project";

export type SelectProjectState =
	| Checking
	| FetchingProjects
	| SelectProject
	| SelectWorkspace
	| CreateWorkspace
	| CreatingWorkspace
	| CreateProject
	| CreatingProject
	| SavingProject
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
	workspaces: WorkspaceDefinition[];
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

type SavingProject = {
	type: "savingProject";
	project: ProjectWithWorkspace;
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
	selectedWorkspace: (
		selectedWorkspace: WorkspaceDefinition | undefined
	) => void;
	createWorkspace: (name: string) => void;
	createProject: (workspace: WorkspaceDefinition, name: string) => void;
};

const api = new API();

export function useSelectProject(authToken: AuthToken): SelectProjectReturn {
	const [statuses, setStatuses] = useState<SelectProjectState[]>([
		{ type: "checking" },
	]);
	const [workspaces, setWorkspaces] = useState<WorkspaceDefinition[]>([]);

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
				setWorkspaces(workspaces);

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
					if (workspaces.length === 0) {
						setStatuses((s) => [...s, { type: "createWorkspace" }]);
					} else {
						setStatuses((s) => [
							...s,
							{ type: "selectWorkspace", workspaces: workspaces },
						]);
					}
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
				if (workspaces.length === 0) {
					setStatuses((s) => [...s, { type: "createWorkspace" }]);
				} else {
					setStatuses((s) => [
						...s,
						{ type: "selectWorkspace", workspaces: workspaces },
					]);
				}
				return;
			}

			async function save(proj: ProjectWithWorkspace) {
				setStatuses((s) => [
					...s,
					{
						type: "savingProject",
						project: {
							id: proj.id,
							name: proj.name,
							workspace: {
								id: proj.workspace.id,
								name: proj.workspace.name,
							},
						},
					},
				]);

				await saveProject(proj.workspace.id, proj.id);
				setStatuses((s) => [
					...s,
					{
						type: "complete",
						projectId: proj.id,
						projectName: proj.name,
						workspaceId: proj.workspace.id,
						workspaceName: proj.workspace.name,
					},
				]);
			}
			save(project);
		},
		[workspaces]
	);

	const selectWorkspace = useCallback(
		(workspace: WorkspaceDefinition | undefined) => {
			if (workspace === undefined) {
				setStatuses((s) => [...s, { type: "createWorkspace" }]);
			} else {
				setStatuses((s) => [
					...s,
					{
						type: "createProject",
						workspaceId: workspace.id,
						workspaceName: workspace.name,
					},
				]);
			}
		},
		[]
	);

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
							type: "savingProject",
							project: {
								id: project.id,
								name: project.name,
								workspace: {
									id: workspace.id,
									name: workspace.name,
								},
							},
						},
					]);

					await saveProject(workspace.id, project.id);

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
