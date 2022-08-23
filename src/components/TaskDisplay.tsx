import { Text } from "ink";
import React from "react";
import { Spinner } from "./Spinner";
import { Tick } from "./Tick";

type TaskDisplayProps = {
  isComplete: boolean;
  children: React.ReactNode;
}

export function TaskDisplay({ isComplete, children }: TaskDisplayProps) {
  return <Text>{isComplete ? <Tick /> : <Spinner color={"yellow"} />} {children}</Text>
}