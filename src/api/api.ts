import { createMockService } from "./services/mock-service";
import {
	APIService,
	APIResult,
	ProjectConfig,
	AuthToken,
	ProjectWorkspaceResponse,
	ProjectDefinition,
	WorkspaceDefinition,
} from "./types";

export class API implements APIService {
	static currentAPI: APIService = createMockService({
		willAuthenticate: true,
		searchResults: "many",
		projects: "one",
	});

	authUrl: string = API.currentAPI.authUrl;

	createRequestToken(): Promise<string> {
		return API.currentAPI.createRequestToken();
	}

	isAuthenticated(requestToken: string): Promise<AuthToken | undefined> {
		return API.currentAPI.isAuthenticated(requestToken);
	}

	searchAPIs(query: string, authToken: AuthToken): Promise<APIResult[]> {
		return API.currentAPI.searchAPIs(query, authToken);
	}

	getWorkspaces(authToken: AuthToken): Promise<ProjectWorkspaceResponse[]> {
		return API.currentAPI.getWorkspaces(authToken);
	}

	createWorkspace(
		name: string,
		authToken: AuthToken
	): Promise<WorkspaceDefinition> {
		return API.currentAPI.createWorkspace(name, authToken);
	}
	createProject(
		name: string,
		workspaceId: string,
		authToken: AuthToken
	): Promise<ProjectDefinition> {
		return API.currentAPI.createProject(name, workspaceId, authToken);
	}
}
