import { createMockService } from "./services/mock-service";
import {
	APIService,
	APIResult,
	ProjectConfig,
	AuthToken,
	ProjectWorkspaceResponse,
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

	getProjects(authToken: AuthToken): Promise<ProjectWorkspaceResponse[]> {
		return API.currentAPI.getProjects(authToken);
	}
}
