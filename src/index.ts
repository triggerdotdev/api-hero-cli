import { Program } from "@boost/cli";
import { PostHog } from "posthog-node";
import AddCommand from "./commands/AddCommand";

export const postHogClient = new PostHog(
	"phc_sbTCuwyQ0vh4ICohbirIFhcKMWLM58kFlkEPy0umZhA",
	{ host: "https://app.posthog.com" }
);

const program = new Program({
	bin: "apihero",
	footer: "Documentation: https://docs.apihero.run",
	name: "API Hero CLI",
	version: "0.0.0",
});

program.register(new AddCommand()).runAndExit(process.argv);
