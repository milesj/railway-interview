import { ActionIcon, Anchor, Card, Flex, Menu } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import type { ReadProjectQuery } from "gql/graphql";

export interface ServiceCardProps {
	projectId: string;
	service: ReadProjectQuery["project"]["services"]["edges"][number]["node"];
}

export function ServiceCard({ service, projectId }: ServiceCardProps) {
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
							href={`/project/${projectId}/service/${service.id}`}
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
					<Menu.Item color="red" leftSection={<IconTrash size="1rem" />}>
						Delete service
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</Card>
	);
}
