import { GraphQLClient } from "graphql-request";

export const graphqlClient =
	typeof process === "undefined"
		? // Client
			new GraphQLClient(`${location.origin}/graphql`, {
				credentials: "include",
			})
		: // Server
			new GraphQLClient("https://backboard.railway.app/graphql/v2", {
				headers: {
					Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
					// CORS
					"Access-Control-Allow-Origin": "*",
				},
			});
