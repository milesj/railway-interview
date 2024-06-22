import { GraphQLClient } from "graphql-request";

declare global {
	interface Window {
		ENV: Record<string, string>;
	}
}

const TOKEN =
	typeof process === "undefined"
		? window.ENV.RAILWAY_TOKEN
		: process.env.RAILWAY_TOKEN;

export const graphqlClient = new GraphQLClient(
	"https://backboard.railway.app/graphql/v2",
	{
		credentials: "include",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			// CORS
			"Access-Control-Allow-Origin": "*",
		},
	},
);
