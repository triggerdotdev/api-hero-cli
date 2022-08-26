import { resolveAfter } from "../../common/common";
import { API } from "../api";
import {
	APIResult,
	APIService,
	AuthToken,
	ProjectConfig,
	ProjectDefinition,
	ProjectWorkspaceResponse,
	WorkspaceDefinition,
} from "../types";

export class MockAPIService implements APIService {
	authUrl = "http://localhost:3000/auth/cli";

	private willAuthenticate: boolean;
	private searchResults: APIResult[];
	private projects: ProjectWorkspaceResponse[];

	constructor(
		willAuthenticate = true,
		searchResults: APIResult[] = [],
		projects: ProjectWorkspaceResponse[] = []
	) {
		this.willAuthenticate = willAuthenticate;
		this.searchResults = searchResults;
		this.projects = projects;
	}

	async createRequestToken(): Promise<string> {
		await resolveAfter(1);
		return Promise.resolve("123456");
	}

	async isAuthenticated(_requestToken: string): Promise<AuthToken | undefined> {
		await resolveAfter(1);
		return this.willAuthenticate
			? Promise.resolve({ tokenId: "abcdefgh" })
			: // eslint-disable-next-line unicorn/no-useless-undefined
			  Promise.resolve(undefined);
	}

	async searchAPIs(
		_query: string,
		_authToken: AuthToken
	): Promise<APIResult[]> {
		await resolveAfter(2);
		return Promise.resolve(this.searchResults);
	}

	async getWorkspaces(
		_authToken: AuthToken
	): Promise<ProjectWorkspaceResponse[]> {
		await resolveAfter(2);
		return Promise.resolve(this.projects);
	}

	async createWorkspace(
		name: string,
		_authToken: AuthToken
	): Promise<WorkspaceDefinition> {
		await resolveAfter(2);
		return Promise.resolve({ id: "workspaceId", name });
	}
	async createProject(
		name: string,
		_workspaceId: string,
		_authToken: AuthToken
	): Promise<ProjectDefinition> {
		await resolveAfter(2);
		return Promise.resolve({ id: "projectId", name });
	}
}

type FactoryProps = {
	willAuthenticate: boolean;
	searchResults: "none" | "one" | "many";
	projects: "none" | "one" | "many";
};

export function createMockService({
	willAuthenticate,
	searchResults,
	projects,
}: FactoryProps): MockAPIService {
	let searchItems: APIResult[] = [];
	switch (searchResults) {
		case "none":
			break;
		case "one":
			searchItems = [
				{
					name: "GitHub",
					description: "The world's most popular source code hosting service.",
					documentationUrl:
						"https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api",
					url: "https://docs.github.com/en/rest",
					integrationId: "github",
				},
			];
			break;
		case "many":
			searchItems = [
				{
					name: "GitHub",
					description: "The world's most popular source code hosting service.",
					documentationUrl:
						"https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api",
					url: "https://docs.github.com/en/rest",
					integrationId: "github",
				},
				{
					name: "GitLab",
					description: "The world's most popular source code hosting service.",
					documentationUrl:
						"https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api",
					url: "https://docs.github.com/en/rest",
					integrationId: "gitlab",
				},
			];
			break;
	}

	let projectsItems: ProjectWorkspaceResponse[] = [];
	switch (projects) {
		case "none":
			break;
		case "one":
			projectsItems = [
				{
					id: "my-company",
					name: "My company",

					projects: [
						{
							name: "Travel app",
							id: "travel-app",
						},
					],
				},
			];
			break;
		case "many":
			projectsItems = [
				{
					id: "my-company",
					name: "My company",

					projects: [
						{
							name: "Travel app",
							id: "travel-app",
						},
					],
				},
				{
					id: "my-other-company",
					name: "My other company",
					projects: [
						{
							name: "Movie app",
							id: "movie-app",
						},
					],
				},
			];
			break;
		default:
			throw new Error(`Unknown projects type: ${projects}`);
	}

	return new MockAPIService(willAuthenticate, searchItems, projectsItems);
}
