import React from "react";
import { Box } from "ink";
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';

export function Logo() {
	return (
		<Box flexDirection="column" marginBottom={0}>
			<Gradient name="instagram">
				<BigText text="API Hero" font="tiny" lineHeight={0} />
			</Gradient>
		</Box>
	);
}
