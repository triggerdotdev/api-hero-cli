import { Program } from "@boost/cli";
import AddCommand from "./AddCommand";

const program = new Program({
	bin: "apihero",
	footer: "Documentation: https://docs.apihero.run",
	name: "API Hero CLI",
	version: "0.0.0",
});

program.register(new AddCommand()).runAndExit(process.argv);
