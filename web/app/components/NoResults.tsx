import { Center, Stack, Text, Title } from "@mantine/core";

export interface NoResultsProps {
	title?: React.ReactNode;
	description: React.ReactNode;
	children: React.ReactNode;
}

export function NoResults({ title, description, children }: NoResultsProps) {
	return (
		<Center my="xl">
			<Stack ta="center">
				{title && <Title order={3}>{title}</Title>}

				<Text size="lg">{description}</Text>

				<div>{children}</div>
			</Stack>
		</Center>
	);
}
