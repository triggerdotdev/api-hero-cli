import { Box, Text } from "ink";
import React from "react";
import { useAPISearch } from "../hooks/useAPISearch";

export function SelectProject({ query }: { query: string }) {
  const [_state, _states, selectedApi] = useAPISearch(query);

  return <>{selectedApi.type === "api" ? <Box flexDirection="column"><Text>Now select a project to add this API to</Text></Box> : <Text>Test</Text>}</>;
}