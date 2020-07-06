const React = require("react");
const { useEffect, useReducer } = require("react");
const { Text, Color, Box } = require("ink");
const axios = require("axios");
const Spinner = require("ink-spinner");

const instance = axios.default.create({
	baseURL: "https://api.github.com/repos",
	headers: {
		Accept: "application/vnd.github.baptiste-preview+json",
	},
});

const reducer = (state, action) => {
	switch (action.type) {
		case "request": {
			return {
				...state,
				loading: true,
				err: null,
			};
		}
		case "success": {
			return {
				...state,
				loading: false,
				res: action.payload.res,
			};
		}
		case "failure": {
			return {
				...state,
				loading: false,
				err: action.payload.err,
			};
		}
		default:
			return state;
	}
};

const App = ({ repo }) => {
	const [state, dispatch] = useReducer(reducer, {
		res: null,
		loading: false,
		err: null,
	});
	const [owner, repoName] = repo.split("/");

	useEffect(() => {
		if (!owner || !repoName) {
			dispatch({
				type: "failure",
				payload: { err: "Missing owner or repository name." },
			});

			return;
		}

		dispatch({ type: "request" });

		instance
			.get(`/${owner}/${repoName}`)
			.then((res) => {
				dispatch({ type: "success", payload: { res: res.data } });
			})
			.catch(() => {
				dispatch({
					type: "failure",
					payload: {
						err:
							"Something went wrong. Hint: double-check whether the repository exists.",
					},
				});
			});
	}, []);

	return (
		<Box marginTop={2} paddingLeft={1} paddingBottom={1} flexDirection="column">
			<Box>
				<Text>⚡️ Querying repo info ⚡️</Text>
				{state.loading && (
					<Color blue>
						<Spinner type="dots" />
					</Color>
				)}
			</Box>

			<Box marginTop={2} flexDirection="column">
				<Text>
					Owner: <Color blue>{owner}</Color>
				</Text>
				<Text>
					Repository name: <Color blue>{repoName}</Color>
				</Text>
				<Text>
					<Color blueBright>---------------------------------</Color>
				</Text>
			</Box>

			<Box marginTop={2}>
				{state.err && (
					<Text>
						<Color red>{state.err}</Color>
					</Text>
				)}

				{state.res && (
					<Box flexDirection="column">
						<Box marginBottom={2}>
							<Color green>✓ Success!</Color>
						</Box>
						<Text>Url: {state.res.html_url}</Text>
						<Text>Created at: {state.res.created_at}</Text>
						<Text>Open issues: {state.res.open_issues_count}</Text>
						<Text>Stars: {state.res.stargazers_count}</Text>
						<Text>Forks: {state.res.forks_count}</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
};

module.exports = App;
