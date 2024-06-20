import { useQuery } from "@tanstack/react-query";
import { graphql } from "gql";
import { request } from "graphql-request";

const READ_PROJECT = graphql(`
  query readProject($id: String!) {
    project(id: $id) {
      createdAt
      deletedAt
      description
      id
    }
  }
`);

export function ReadProject() {
	const { data } = useQuery({
		queryKey: ["project"],
		queryFn: async () =>
			request("https://backboard.railway.app/graphql/v2", READ_PROJECT),
	});

	return null;
}
