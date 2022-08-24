import { Select } from "@boost/cli/react";
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
      <Status key={status.type} query={query} status={status} isComplete={index < allStates.length - 1} onSelected={() => { }} />
    ))}
  </Box>
}

function Status({ query, status, isComplete, onSelected }: { query: string, status: APISearchStatus, isComplete: boolean, onSelected: (value: string) => void }) {
  switch (status.type) {
    case "waiting":
      return <></>
    case "searching":
      return <TaskDisplay isComplete={isComplete}>Searching for <Text color="yellow">{query}</Text></TaskDisplay>;
    case "results":
      return <Box flexDirection="column"><Text>Found {status.results.length} results</Text><Select
        label="Which API would you like to install"
        onSubmit={onSelected}
        options={[...status.results.map(r => ({ label: <Text>{r.name} – <Text underline>{r.documentationUrl}</Text></Text>, value: r.name })), { label: "None of these", value: "" }]}
      /></Box>
    case "noResults":
      return <Text>Found no results</Text>
    case "error":
      return <Text color="red">Error: {JSON.stringify(status.error)}</Text>
  }
}