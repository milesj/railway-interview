import { graphql } from "gql";

export const CREATE_PROJECT = graphql(`
mutation CreateProject($input: ProjectCreateInput!) {
	projectCreate(input: $input) {
		id
		name
	}
}`);
