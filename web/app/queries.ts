import { graphql } from "gql";

export const LIST_PROJECTS = graphql(`
query ListProjects {
	projects {
		edges {
			cursor
			node {
				createdAt
				deletedAt
				description
				id
				isPublic
				isTempProject
				name
				subscriptionPlanLimit
				subscriptionType
				team {
					id
					name
				}
				teamId
			}
		}
		pageInfo {
			endCursor
			startCursor
			hasNextPage
			hasPreviousPage
		}
	}
}`);

export const READ_PROJECT = graphql(`
query ReadProject($id: String!) {
	project(id: $id) {
		id
		name
		environments {
			edges {
				cursor
				node {
					id
					name
				}
			}
			pageInfo {
				endCursor
				startCursor
				hasNextPage
				hasPreviousPage
			}
		}
		services {
			edges {
				cursor
				node {
					createdAt
					icon
					id
					name
				}
			}
			pageInfo {
				endCursor
				startCursor
				hasNextPage
				hasPreviousPage
			}
		}
	}
}`);
