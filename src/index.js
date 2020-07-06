#!/usr/bin/env node
"use strict";
const React = require("react");
const importJsx = require("import-jsx");
const { render } = require("ink");
const meow = require("meow");

const ui = importJsx("./ui");

const cli = meow(
	`
	Usage
	  $ repo-info-cli

	Options
		--repo, -r Owner and repo name (separated by a slash)

	Examples
	  $ repo-info-cli --repo=vadimdemedes/ink
`,
	{
		flags: {
			repo: {
				type: "string",
				alias: "r",
				isRequired: true,
			},
		},
	}
);

render(React.createElement(ui, cli.flags));
