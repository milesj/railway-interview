import { Button, Select } from "@mantine/core";
import { Link } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "~/clients/graphql";
import { LIST_PROJECTS } from "~/queries";

function listProjects() {
	return graphqlClient.request(LIST_PROJECTS);
}

export interface ProjectsSelectorProps {
	selected: string | null;
	onChange: (value: string | null) => void;
}

export function ProjectsSelector({
	selected,
	onChange,
}: ProjectsSelectorProps) {
	const { data } = useQuery({
		queryKey: ["projects"],
		queryFn: listProjects,
	});
	const hasResults = data && data.projects.edges.length > 0;

	if (!hasResults) {
		return (
			<Button component={Link} to="/projects/new">
				Create a project
			</Button>
		);
	}

	return (
		<Select
			value={selected}
			data={data?.projects.edges.map((project) => ({
				label: project.node.name,
				value: project.node.id,
			}))}
			onChange={onChange}
		/>
	);
}
