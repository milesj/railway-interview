import { ActionIcon, Anchor, Card, Flex, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReadProjectQuery } from "gql/graphql";
import { graphqlClient } from "~/clients/graphql";
import { DELETE_SERVICE } from "~/mutations";

function deleteService(id: string) {
	return graphqlClient.request(DELETE_SERVICE, { id });
}

export interface ServiceCardProps {
	projectId: string;
	service: ReadProjectQuery["project"]["services"]["edges"][number]["node"];
}

export function ServiceCard({ service, projectId }: ServiceCardProps) {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: deleteService,
		onSuccess() {
			notifications.show({
				message: "Project has been deleted!",
				color: "green",
				autoClose: 3000,
			});

			// Clear projects list cache
			queryClient.invalidateQueries({ queryKey: ["project", projectId] });
		},
		onError(error) {
			// TODO: handle error state
			console.error(error);
		},
	});

	function handleDelete() {
		return modals.openConfirmModal({
			title: "Delete service?",
			children: (
				<Text size="sm">
					Are you sure you want to delete service{" "}
					<strong>{service.name}</strong>?
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				mutate(service.id);
			},
		});
	}

	return (
		<Card>
			<Menu shadow="md">
				<Flex align="center" justify="space-between">
					{service.icon && (
						<Flex flex="0" w="1rem" mr="1rem">
							<img
								src={service.icon}
								alt=""
								style={{
									height: "1rem",
									width: "1rem",
									display: "block",
								}}
							/>
						</Flex>
					)}

					<Flex flex="1">
						<Anchor
							href={`https://railway.app/project/${projectId}/service/${service.id}`}
							target="_blank"
						>
							{service.name || service.id}
						</Anchor>
					</Flex>

					<Flex flex="0">
						<Menu.Target>
							<ActionIcon variant="subtle">
								<IconDotsVertical size="1rem" />
							</ActionIcon>
						</Menu.Target>
					</Flex>
				</Flex>

				<Menu.Dropdown>
					<Menu.Item
						color="red"
						leftSection={<IconTrash size="1rem" />}
						onClick={handleDelete}
					>
						Delete service
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</Card>
	);
}
