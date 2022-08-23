import React from "react";
import { Text } from "ink"
import InkSpinner from 'ink-spinner'
import { Props } from "ink/build/components/Text";

type SpinnerProps = Pick<Props, "color">;

export function Spinner({ color }: SpinnerProps) {
	return <Text color={color}><InkSpinner /></Text>;
}
