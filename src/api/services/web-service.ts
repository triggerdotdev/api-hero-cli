import {
	APIResult,
	APIService,
	AuthToken,
	ProjectDefinition,
	ProjectWorkspaceResponse,
	WorkspaceDefinition,
} from "../types";

export class WebService implements APIService {
	authUrl: string;

	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		this.authUrl = `${baseUrl}/auth/cli`;
	}

	async createRequestToken(): Promise<string> {
		try {
			const response = await fetch(`${this.baseUrl}/api/auth/requestTokens`, {
				method: "POST",
			});

			if (response.ok && response.status === 200) {
				const data = await response.json();
				return data.token;
			}

			throw new Error(`${response.status} ${response.statusText}`);
		} catch (error) {
			throw error;
		}
	}

	async isAuthenticated(requestToken: string): Promise<AuthToken | undefined> {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/auth/requestTokens/${requestToken}`,
				{
					method: "GET",
				}
			);

			if (response.ok && response.status === 200) {
				const data = await response.json();
				if (data.authToken) {
					return { tokenId: data.authToken };
				}
			}

			return undefined;
		} catch (error) {
			throw error;
		}
	}

	async searchAPIs(query: string, authToken: AuthToken): Promise<APIResult[]> {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/integrations?query=${query}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${authToken.tokenId}`,
					},
				}
			);

			if (response.ok && response.status === 200) {
				const data = await response.json();
				return data;
			}

			throw `${response.status} ${response.statusText}`;
		} catch (error) {
			throw error;
		}
	}

	getWorkspaces(_authToken: AuthToken): Promise<ProjectWorkspaceResponse[]> {
		throw new Error("Method not implemented.");
	}

	createWorkspace(
		_name: string,
		_authToken: AuthToken
	): Promise<WorkspaceDefinition> {
		throw new Error("Method not implemented.");
	}
	createProject(
		_name: string,
		_workspaceId: string,
		_authToken: AuthToken
	): Promise<ProjectDefinition> {
		throw new Error("Method not implemented.");
	}
}
