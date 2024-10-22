#!/usr/bin/env node
import { render } from "ink";
// import meow from "meow";
import React from "react";
import {App} from "./app.js";

/* const cli = meow(
	`
	Usage
	  $ polar-init

	Options
		--org  Your organization name

	Examples
	  $ polar-init --org=my-org
`,
	{
		importMeta: import.meta,
		flags: {
			org: {
				type: "string",
			},
		},
	},
); */

render(<App />);
