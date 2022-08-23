import React from "react";
import { Box, Text } from "ink";

export function Logo() {
	return (
		<Box flexDirection="column" marginBottom={1}>
			<Text>    _   ___ ___   _  _</Text>
			<Text>   /_\ | _ \_ _| | || |___ _ _ ___</Text>
			<Text>  / _ \|  _/| |  | __ / -_) '_/ _ \</Text>
			<Text> /_/ \_\_| |___| |_||_\___|_| \___/</Text>
		</Box>
	);
}
