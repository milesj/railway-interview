import "dotenv/config";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: [
		// https://docs.railway.app/reference/public-api#authentication
		{
			"https://backboard.railway.app/graphql/v2": {
				headers: {
					Authorization: process.env.RAILWAY_TOKEN as string,
				},
			},
		},
	],
	documents: "app/**/*.tsx",
	generates: {
		"./gql/": {
			preset: "client",
			plugins: [],
		},
		// "./graphql.schema.json": {
		//   plugins: ["introspection"],
		// },
	},
};

export default config;
