import {
	Anchor,
	Burger,
	Button,
	Card,
	Center,
	Container,
	Flex,
	Grid,
	Group,
	Menu,
	Select,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Link, json, useLoaderData, useSearchParams } from "@remix-run/react";
import { IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { graphql } from "gql";
import { useState } from "react";
import { graphqlClient } from "~/clients/graphql";
import { listProjects } from "./projects._index";

function readProject(id: string) {
	return graphqlClient.request(
		graphql(`
query ReadProject($id: String!) {
	project(id: $id) {
		id
		name
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
}`),
		{
			id,
		},
	);
}

export async function loader() {
	return json(await listProjects());
}

export default function ServiceList() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		searchParams.get("projectId"),
	);
	const initialData = useLoaderData<typeof loader>();

	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: listProjects,
		initialData,
	});

	const { data: project } = useQuery({
		queryKey: ["project", selectedProjectId],
		queryFn: () => (selectedProjectId ? readProject(selectedProjectId) : null),
	});

	function handleChangeProject(value: string | null) {
		setSelectedProjectId(value);

		if (value) {
			setSearchParams((prev) => {
				prev.set("projectId", value);
				return prev;
			});
		} else {
			setSearchParams((prev) => {
				prev.delete("projectId");
				return prev;
			});
		}
	}

	return (
		<Container>
			{selectedProjectId && (
				<Flex justify="space-between" mb="md">
					<Title order={1}>Services</Title>

					<Select
						value={selectedProjectId}
						data={projects.projects.edges.map((project) => ({
							label: project.node.name,
							value: project.node.id,
						}))}
						onChange={handleChangeProject}
					/>
				</Flex>
			)}

			{!selectedProjectId && (
				<Center my="xl">
					<Stack ta="center">
						<Text size="lg">
							Select a project to view all services within it.
						</Text>
						<div>
							{projects?.projects?.edges ? (
								<Select
									data={projects.projects.edges.map((project) => ({
										label: project.node.name,
										value: project.node.id,
									}))}
									onChange={handleChangeProject}
								/>
							) : (
								<Button component={Link} to="/projects/new">
									Create a project
								</Button>
							)}
						</div>
					</Stack>
				</Center>
			)}

			{selectedProjectId && project?.project.services.edges.length === 0 && (
				<Center my="xl">
					<Stack ta="center">
						<Title order={3}>No services available</Title>
						<Text size="lg">
							Spin up a new web application, database, and more to get started!
						</Text>
						<div>
							<Button component={Link} to="/services/new" size="lg">
								Create service
							</Button>
						</div>
					</Stack>
				</Center>
			)}

			{project && project.project.services.edges.length > 0 && (
				<Grid>
					{project.project.services.edges.map(({ node: service }) => (
						<Grid.Col key={service.id} span={4}>
							<Card>
								<Menu shadow="md">
									<Flex align="center" justify="space-between">
										{service.icon && (
											<div style={{ width: "1rem" }}>
												<img
													src={service.icon}
													alt=""
													style={{
														height: "1rem",
														width: "1rem",
														display: "block",
													}}
												/>
											</div>
										)}

										<Anchor
											href={`/project/${project.project.id}/service/${service.id}`}
											target="_blank"
										>
											{service.name || service.id}
										</Anchor>

										<div>
											<Menu.Target>
												<Burger size="xs" />
											</Menu.Target>
										</div>
									</Flex>

									<Menu.Dropdown>
										<Menu.Item
											color="red"
											leftSection={<IconTrash size="1rem" />}
										>
											Delete service
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							</Card>
						</Grid.Col>
					))}
				</Grid>
			)}
		</Container>
	);
}
