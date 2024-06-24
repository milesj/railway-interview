import { Alert, List } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import type { GraphQLError } from "graphql";

export interface FormErrorsProps {
	errors?: GraphQLError[];
}

export function FormErrors({ errors }: FormErrorsProps) {
	if (!errors || errors.length === 0) {
		return null;
	}

	return (
		<Alert color="red" my="md" icon={<IconInfoCircle />}>
			<List>
				{errors.map((error) => (
					<List.Item key={error.message}>{error.message}</List.Item>
				))}
			</List>
		</Alert>
	);
}
