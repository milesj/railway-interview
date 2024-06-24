import { ActionIcon, Anchor, Badge, Menu, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ListProjectsQuery } from "gql/graphql";
import { graphqlClient } from "~/clients/graphql";
import { DELETE_PROJECT } from "~/mutations";

function deleteProject(id: string) {
	return graphqlClient.request(DELETE_PROJECT, { id });
}

export interface ProjectRowProps {
	project: Partial<ListProjectsQuery["projects"]["edges"][number]["node"]>;
}

export function ProjectRow({ project }: ProjectRowProps) {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: deleteProject,
		onSuccess() {
			notifications.show({
				message: "Project has been deleted!",
				color: "green",
				autoClose: 3000,
			});

			// Clear projects list cache
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError(error) {
			// TODO: handle error state
			console.error(error);
		},
	});

	function handleDelete() {
		return modals.openConfirmModal({
			title: "Delete project?",
			children: (
				<Text size="sm">
					Are you sure you want to delete project{" "}
					<strong>{project.name}</strong>? This will delete all environments and
					services associated with it.
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				mutate(project.id as string);
			},
		});
	}

	return (
		<Table.Tr>
			<Table.Td>
				<Anchor
					href={`https://railway.app/project/${project.id}`}
					target="_blank"
				>
					{project.name}
				</Anchor>
				<br />
				{project.description}
			</Table.Td>
			<Table.Td>
				{project.isPublic ? (
					<Badge color="blue">Public</Badge>
				) : (
					<Badge color="pink">Private</Badge>
				)}
			</Table.Td>
			<Table.Td>{project.team ? project.team.name : "N/A"}</Table.Td>
			<Table.Td>
				<Badge>{project.subscriptionType}</Badge>
			</Table.Td>
			<Table.Td>
				{project.createdAt ? new Date(project.createdAt).toLocaleString() : ""}
			</Table.Td>
			<Table.Td align="right">
				<Menu>
					<Menu.Target>
						<ActionIcon variant="subtle">
							<IconDotsVertical size="1rem" />
						</ActionIcon>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item
							color="red"
							leftSection={<IconTrash size="1rem" />}
							onClick={handleDelete}
						>
							Delete project
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Table.Td>
		</Table.Tr>
	);
}
