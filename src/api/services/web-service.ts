import {
	APIResult,
	APIService,
	AuthToken,
	HTTPClientResponse,
	ProjectDefinition,
	ProjectWorkspaceResponse,
	WorkspaceDefinition,
} from "../types";
var fetch = require("node-fetch-polyfill");

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

	async getWorkspaces(
		authToken: AuthToken
	): Promise<ProjectWorkspaceResponse[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/workspaces`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${authToken.tokenId}`,
				},
			});

			if (response.ok && response.status === 200) {
				const data = await response.json();
				return data;
			}

			throw `${response.status} ${response.statusText}`;
		} catch (error) {
			throw error;
		}
	}

	async createWorkspace(
		name: string,
		authToken: AuthToken
	): Promise<WorkspaceDefinition> {
		try {
			const response = await fetch(`${this.baseUrl}/api/workspaces`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${authToken.tokenId}`,
				},
				body: JSON.stringify({
					name,
				}),
			});

			if (response.ok && response.status === 200) {
				const data = await response.json();
				return data;
			}

			throw `${response.status} ${response.statusText}`;
		} catch (error) {
			throw error;
		}
	}

	async createProject(
		name: string,
		workspaceId: string,
		authToken: AuthToken
	): Promise<ProjectDefinition> {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/workspaces/${workspaceId}/projects`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${authToken.tokenId}`,
					},
					body: JSON.stringify({
						name,
					}),
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

	async linkToApi(
		workspaceId: string,
		projectId: string,
		integrationId: string,
		authToken: AuthToken
	): Promise<HTTPClientResponse> {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/workspaces/${workspaceId}/projects/${projectId}/clients`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${authToken.tokenId}`,
					},
					body: JSON.stringify({
						integrationId,
					}),
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
}
