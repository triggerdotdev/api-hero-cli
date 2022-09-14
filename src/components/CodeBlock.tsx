import { Box, Text } from "ink";
import React from "react";

type CodeBlockProps = {
  children: React.ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <Text bold>{children}</Text>
  )
}