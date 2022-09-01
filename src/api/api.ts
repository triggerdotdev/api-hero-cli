import { createMockService } from "./services/mock-service";
import { WebService } from "./services/web-service";
import {
	APIService,
	APIResult,
	ProjectConfig,
	AuthToken,
	ProjectWorkspaceResponse,
	ProjectDefinition,
	WorkspaceDefinition,
	HTTPClientResponse,
} from "./types";

export class API implements APIService {
	// static currentAPI: APIService = createMockService({
	// 	willAuthenticate: true,
	// 	searchResults: "many",
	// 	projects: "one",
	// });

	static currentAPI: APIService = new WebService("http://localhost:3000");

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

	linkToApi(
		workspaceId: string,
		projectId: string,
		integrationId: string,
		authToken: AuthToken
	): Promise<HTTPClientResponse> {
		return API.currentAPI.linkToApi(
			workspaceId,
			projectId,
			integrationId,
			authToken
		);
	}
}
