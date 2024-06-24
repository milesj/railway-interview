import { Button, Container, Table, Title } from "@mantine/core";
import { Link, json, useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "~/clients/graphql";
import { NoResults } from "~/components/NoResults";
import { ProjectRow } from "~/components/projects/ProjectRow";
import { LIST_PROJECTS } from "~/queries";

function listProjects() {
	return graphqlClient.request(LIST_PROJECTS);
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
				<NoResults
					title="No projects available"
					description="A project is required to house services and environments."
				>
					<Button component={Link} to="/projects/new" size="lg">
						Create project
					</Button>
				</NoResults>
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
