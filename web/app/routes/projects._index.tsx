import {
	Anchor,
	Badge,
	Button,
	Center,
	Container,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { Link, json, useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "gql";
import { graphqlClient } from "~/clients/graphql";
import { ProjectRow } from "~/components/projects/ProjectRow";

export function listProjects() {
	return graphqlClient.request(
		graphql(`
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
}`),
	);
}

export async function loader() {
	return json(await listProjects());
}

export default function ProjectList() {
	const initialData = useLoaderData<typeof loader>();

	const { data } = useQuery({
		queryKey: ["projects"],
		queryFn: listProjects,
		initialData,
	});

	return (
		<Container>
			{data.projects.edges.length === 0 && (
				<Center my="xl">
					<Stack ta="center">
						<Title order={3}>No projects available</Title>
						<Text size="lg">
							A project is required to house services and environments.
						</Text>
						<div>
							<Button component={Link} to="/projects/new" size="lg">
								Create project
							</Button>
						</div>
					</Stack>
				</Center>
			)}

			{data.projects.edges.length !== 0 && (
				<>
					<Title order={1} mb="md">
						Projects
					</Title>

					<Table>
						<Table.Thead>
							<Table.Tr>
								<Table.Th> </Table.Th>
								<Table.Th>Private</Table.Th>
								<Table.Th>Team</Table.Th>
								<Table.Th>Subscription</Table.Th>
								<Table.Th>Created at</Table.Th>
							</Table.Tr>
						</Table.Thead>

						<Table.Tbody>
							{data.projects.edges.map(({ cursor, node: project }) => (
								<ProjectRow key={cursor} project={project} />
							))}
						</Table.Tbody>
					</Table>
				</>
			)}
		</Container>
	);
}
