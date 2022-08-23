// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.auth.storeAuthentication:invocation[0]": {
      type: "done.invoke.auth.storeAuthentication:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.auth.waitForAuth:invocation[0]": {
      type: "done.invoke.auth.waitForAuth:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.createRequestToken": {
      type: "done.invoke.createRequestToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.auth.storeAuthentication:invocation[0]": {
      type: "error.platform.auth.storeAuthentication:invocation[0]";
      data: unknown;
    };
    "error.platform.auth.waitForAuth:invocation[0]": {
      type: "error.platform.auth.waitForAuth:invocation[0]";
      data: unknown;
    };
    "error.platform.createRequestToken": {
      type: "error.platform.createRequestToken";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "auth.waiting" | "auth.error" | "auth.authenticated";
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "auth.authenticated": "done.invoke.auth.storeAuthentication:invocation[0]";
    "auth.error":
      | "error.platform.auth.storeAuthentication:invocation[0]"
      | "error.platform.auth.waitForAuth:invocation[0]"
      | "error.platform.createRequestToken";
    "auth.waiting": "done.invoke.createRequestToken";
    setAuthToken: "done.invoke.auth.waitForAuth:invocation[0]";
    setRequestToken: "done.invoke.createRequestToken";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "authenticated"
    | "createRequestToken"
    | "error"
    | "storeAuthentication"
    | "waitForAuth";
  tags: never;
}
