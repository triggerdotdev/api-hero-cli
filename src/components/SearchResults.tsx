import { Box, Text } from "ink";
import React from "react";
import { APISearchStatus, useAPISearch } from "../hooks/useAPISearch"
import { TaskDisplay } from "./TaskDisplay";

type SearchResultsProps = {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [_state, allStates] = useAPISearch(query);

  return <Box flexDirection="column">
    {allStates.map((status, index) => (
      <Status key={status.type} query={query} status={status} isComplete={index < allStates.length - 1} />
    ))}
  </Box>
}

function Status({ query, status, isComplete }: { query: string, status: APISearchStatus, isComplete: boolean }) {
  switch (status.type) {
    case "waiting":
      return <></>
    case "searching":
      return <TaskDisplay isComplete={isComplete}>Searching for <Text color="yellow">{query}</Text></TaskDisplay>;
    case "results":
      return <Text>Found {status.results.length} results</Text>
    case "noResults":
      return <Text>Found no results</Text>
    case "error":
      return <Text color="red">Error: {JSON.stringify(status.error)}</Text>
  }
}