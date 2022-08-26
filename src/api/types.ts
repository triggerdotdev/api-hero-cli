import { z } from "zod";

// auth flow
// 1. create request token
// 2. take request token and append to the url
// 3. user logs in
//  a. database table for auth tokens gets a new entry added, linked to the user id
//  b. the request token db entry is marked as used (can't be reused)
// 4. polling the isAuthenticated in the CLI
// 5. save the auth token to a file in the user directory (.apihero)
// ... every request uses the token (first looks in an .env variable, then in the .apihero file)

// project id flow
// if trying to add an API and there isn't a project id, then the user is prompted to select a project, or create a new one if there aren't any
// creates the apihero.json file in the project
// apihero.json
// {
//   "projects": {
//     "travel-app": "abcdef",
//   },
//   "defaultProject": "travel-app"
// }

export interface APIService {
	authUrl: string;
	createRequestToken(): Promise<string>;
	isAuthenticated(requestToken: string): Promise<AuthToken | undefined>;
	searchAPIs(query: string, authToken: AuthToken): Promise<APIResult[]>;
	getWorkspaces(authToken: AuthToken): Promise<ProjectWorkspaceResponse[]>;
	createWorkspace(
		name: string,
		authToken: AuthToken
	): Promise<WorkspaceDefinition>;
	createProject(
		name: string,
		workspaceId: string,
		authToken: AuthToken
	): Promise<ProjectDefinition>;
}

export type AuthToken = {
	tokenId: string;
};

export type APIResult = {
	name: string;
	description: string;
	documentationUrl: string;
	url: string;
	integrationId: string;
};

export type WorkspaceDefinition = {
	id: string;
	name: string;
};

export type ProjectDefinition = {
	id: string;
	name: string;
};

export type ProjectWithWorkspace = ProjectDefinition & {
	workspace: WorkspaceDefinition;
};

export type ProjectWorkspaceResponse = WorkspaceDefinition & {
	projects: ProjectDefinition[];
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
