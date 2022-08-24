import { Select } from "@boost/cli/react";
import { Box, Text } from "ink";
import React from "react";
import { APISearchStatus, useAPISearch } from "../hooks/useAPISearch"
import { Cross } from "./Cross";
import { TaskDisplay } from "./TaskDisplay";
import { Tick } from "./Tick";

type SearchResultsProps = {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [_state, allStates, selectedApi, setSelectedApi] = useAPISearch(query);

  return <Box flexDirection="column">
    {allStates.map((status, index) => {
      if (status.type === "results") {
        switch (selectedApi.type) {
          case "waiting": {
            return <Box key="search-waiting" flexDirection="column"><Text>Found {status.results.length} results</Text><Select
              label="Which API would you like to install"
              onSubmit={(value) => {
                const api = status.results.find(r => r.name === value);

                if (api) {
                  setSelectedApi({ type: "api", ...api })
                  return
                }
                setSelectedApi({ type: "none" })

              }}
              options={[...status.results.map(r => ({ label: <Text>{r.name} – <Text underline>{r.documentationUrl}</Text></Text>, value: r.name })), { label: "None of these", value: "" }]}
            /></Box>
          }
          case "api": {
            return <Text key="selected-api"><Tick /> You selected <Text color="green">{selectedApi.name} – <Text underline>{selectedApi.documentationUrl}</Text></Text></Text>
          }
          case "none": {
            return <Text key="no-selected-api"><Cross /> You selected no API</Text>
          }
        }
      }

      return <Status key={status.type} query={query} status={status} isComplete={index < allStates.length - 1} />
    })}
  </Box>
}

function Status({ query, status, isComplete }: { query: string, status: APISearchStatus, isComplete: boolean }) {
  switch (status.type) {
    case "waiting":
      return <></>
    case "searching":
      return <TaskDisplay isComplete={isComplete}>Searching for "<Text color="yellow">{query}</Text>"</TaskDisplay>;
    case "noResults":
      return <Text>Found no results</Text>
    case "error":
      return <Text color="red">Error: {JSON.stringify(status.error)}</Text>
    default:
      return <></>
  }
}