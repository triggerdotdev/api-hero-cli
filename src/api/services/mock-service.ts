import { resolveAfter } from "../../common/common";
import { APIResult, APIService, AuthToken, Project } from "../types";

export class MockAPIService implements APIService {
  authUrl = "http://localhost:3000/cli/auth";

  private willAuthenticate: boolean;
  private searchResults: APIResult[];
  private projects: Project[];

  constructor(
    willAuthenticate = true,
    searchResults: APIResult[] = [],
    projects: Project[] = []
  ) {
    this.willAuthenticate = willAuthenticate;
    this.searchResults = searchResults;
    this.projects = projects;
  }

  async createRequestToken(): Promise<string> {
    await resolveAfter(1);
    return Promise.resolve("token");
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

  async getProjects(_authToken: AuthToken): Promise<Project[]> {
    await resolveAfter(2);
    return Promise.resolve(this.projects);
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
        },
        {
          name: "GitLab",
          description: "The world's most popular source code hosting service.",
          documentationUrl:
            "https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api",
          url: "https://docs.github.com/en/rest",
        },
      ];
      break;
  }

  let projectsItems: Project[] = [];
  switch (projects) {
    case "none":
      break;
    case "one":
      projectsItems = [
        {
          name: "Travel app",
          id: "travel-app",
          workspace: {
            id: "my-company",
            name: "My company",
          },
        },
      ];
      break;
    case "many":
      projectsItems = [
        {
          name: "Travel app",
          id: "travel-app",
          workspace: {
            id: "my-company",
            name: "My company",
          },
        },
        {
          name: "Movie app",
          id: "movie-app",
          workspace: {
            id: "my-other-company",
            name: "My other company",
          },
        },
      ];
      break;
    default:
      throw new Error(`Unknown projects type: ${projects}`);
  }

  return new MockAPIService(willAuthenticate, searchItems, projectsItems);
}
