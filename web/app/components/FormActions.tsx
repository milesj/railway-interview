import { Flex } from "@mantine/core";

export interface FormActionsProps {
	children: React.ReactNode;
}

export function FormActions({ children }: FormActionsProps) {
	return (
		<Flex justify="center" mt="xl">
			{children}
		</Flex>
	);
}
