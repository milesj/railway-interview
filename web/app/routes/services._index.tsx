import {
	Anchor,
	Burger,
	Button,
	Card,
	Center,
	Container,
	Flex,
	Grid,
	Menu,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Link, useSearchParams } from "@remix-run/react";
import { IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { graphqlClient } from "~/clients/graphql";
import { NoResults } from "~/components/NoResults";
import { ProjectsSelector } from "~/components/services/ProjectsSelector";
import { ServiceCard } from "~/components/services/ServiceCard";
import { READ_PROJECT } from "~/queries";

function readProject(id: string) {
	return graphqlClient.request(READ_PROJECT, {
		id,
	});
}

export default function ServiceList() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
		searchParams.get("projectId"),
	);

	const { data } = useQuery({
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
			{!selectedProjectId && (
				<NoResults description="Select a project to view all services within it.">
					<ProjectsSelector
						selected={selectedProjectId}
						onChange={handleChangeProject}
					/>
				</NoResults>
			)}

			{selectedProjectId && (
				<>
					{data?.project.services.edges.length === 0 ? (
						<NoResults
							title="No services available"
							description="Spin up a new web application, database, and more to get started!"
						>
							<Button component={Link} to="/services/new" size="lg">
								Create service
							</Button>
						</NoResults>
					) : (
						<>
							<Flex justify="space-between" mb="md">
								<Title order={1}>Services</Title>

								<ProjectsSelector
									selected={selectedProjectId}
									onChange={handleChangeProject}
								/>
							</Flex>

							<Grid>
								{data?.project.services.edges.map(({ node: service }) => (
									<Grid.Col key={service.id} span={4}>
										<ServiceCard
											projectId={selectedProjectId}
											service={service}
										/>
									</Grid.Col>
								))}
							</Grid>
						</>
					)}
				</>
			)}
		</Container>
	);
}
