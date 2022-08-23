/* eslint-disable unicorn/no-useless-undefined */
import os from "node:os";
import fs from "node:fs";
import { AuthToken } from "../api/types";

export function loadAuthToken(): Promise<AuthToken | undefined> {
  const path = authTokenpath();

  return new Promise((resolve) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        resolve(undefined);
        return;
      }

      const json = JSON.parse(data.toString());

      if ("tokenId" in json) {
        resolve(json);
      } else {
        resolve(undefined);
      }
    });
  });
}

export function saveAuthToken(authToken: AuthToken): Promise<void> {
  const path = authTokenpath();
  const stringified = JSON.stringify(authToken);

  return new Promise((resolve, reject) => {
    fs.writeFile(path, stringified, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function authTokenpath(): string {
  const homeDirectory = os.homedir();
  return `${homeDirectory}/.apihero.auth`;
}
