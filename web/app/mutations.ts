import { graphql } from "gql";

export const CREATE_PROJECT = graphql(`
mutation CreateProject($input: ProjectCreateInput!) {
	projectCreate(input: $input) {
		id
		name
	}
}`);

export const DELETE_PROJECT = graphql(`
mutation DeleteProject($id: String!) {
		projectDelete(id: $id)
}`);

export const CREATE_SERVICE = graphql(`
mutation CreateService($input: ServiceCreateInput!) {
	serviceCreate(input: $input) {
		id
		projectId
		name
	}
}`);

export const DELETE_SERVICE = graphql(`
mutation DeleteService($id: String!) {
		serviceDelete(id: $id)
}`);
