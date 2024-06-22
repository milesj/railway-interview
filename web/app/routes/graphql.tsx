import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { ClientError } from "graphql-request";
import { graphqlClient } from "~/clients/graphql";

export async function action({ request }: ActionFunctionArgs) {
	const { query, variables } = await request.json();

	try {
		const result = await graphqlClient.rawRequest(query, variables);

		return json(result);
	} catch (error) {
		if (error instanceof ClientError) {
			return json({ data: error.response.data, errors: error.response.errors });
		}

		throw error;
	}
}
