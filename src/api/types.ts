import { z } from "zod";

export interface APIService {
	authUrl: string;
	createRequestToken(): Promise<string>;
	isAuthenticated(requestToken: string): Promise<AuthToken | undefined>;
	searchAPIs(query: string, authToken: AuthToken): Promise<APIResult[]>;
	// GET api/workspaces
	getWorkspaces(authToken: AuthToken): Promise<ProjectWorkspaceResponse[]>;
	// POST api/workspaces
	createWorkspace(
		name: string,
		authToken: AuthToken
	): Promise<WorkspaceDefinition>;
	// POST api/workspaces/$workspaceId/projects
	createProject(
		name: string,
		workspaceId: string,
		authToken: AuthToken
	): Promise<ProjectDefinition>;
	// POST api/workspaces/$workspaceId/projects/$projectId/clients
	linkToApi(
		workspaceId: string,
		projectId: string,
		integrationId: string,
		authToken: AuthToken
	): Promise<HTTPClientResponse>;
}

export type AuthToken = {
	tokenId: string;
	userId: string;
};

export type APIResult = {
	id: string;
	name: string;
	description: string;
	officialDocumentation: string | null;
	packageName: string;
};

export type WorkspaceDefinition = {
	id: string;
	title: string;
};

export type ProjectDefinition = {
	id: string;
	title: string;
};

export type ProjectWithWorkspace = ProjectDefinition & {
	workspace: WorkspaceDefinition;
};

export type ProjectWorkspaceResponse = WorkspaceDefinition & {
	projects: ProjectDefinition[];
};

export type HTTPClientResponse = HTTPClientSuccess | HTTPClientError;

export type HTTPClient = {
	id: string;
	authenticationUrl: string;
};

type HTTPClientSuccess = {
	success: true;
} & HTTPClient;

type HTTPClientError = {
	success: false;
	error: string;
};

export const projectConfigSchema = z.object({
	workspaceId: z.string(),
	projectId: z.string(),
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

export type Errors = AuthenticationError;

type AuthenticationError = {
	code: "AUTH";
};
