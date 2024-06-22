import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
	"https://backboard.railway.app/graphql/v2",
	{
		credentials: "include",
		headers: {
			Authorization: `Bearer ${process.env.RAILWAY_TOKEN}`,
			// CORS
			"Access-Control-Allow-Origin": "*",
		},
	},
);
