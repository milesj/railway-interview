import {
	Alert,
	Button,
	Container,
	Flex,
	List,
	Select,
	Stack,
	Switch,
	TextInput,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@remix-run/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { graphql } from "gql";
import type { ProjectCreateInput } from "gql/graphql";
import type { GraphQLError } from "graphql";
import { ClientError } from "graphql-request";
import { type FormEvent, useState } from "react";
import * as v from "valibot";
import { graphqlClient } from "~/clients/graphql";
import { ENVIRONMENTS } from "~/utils/data";
import { getCheckedFieldProps, getValueFieldProps } from "~/utils/form";

function createProject(input: ProjectCreateInput) {
	return graphqlClient.request(
		graphql(`
mutation CreateProject($input: ProjectCreateInput!) {
	projectCreate(input: $input) {
		id
		name
	}
}`),
		{ input },
	);
}

export default function ProjectCreate() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [errors, setErrors] = useState<GraphQLError[]>();
	const { mutate, isPending } = useMutation({
		mutationFn: createProject,
		onSuccess(data) {
			notifications.show({
				message: `Project ${data.projectCreate.name} has been created! Will redirect in 3 seconds.`,
				color: "green",
				autoClose: 3000,
			});

			// Clear projects list cache
			queryClient.invalidateQueries({ queryKey: ["projects"] });

			// Then redirect to the list
			setTimeout(() => {
				navigate("/projects");
			}, 3000);
		},
		onError(error) {
			if (error instanceof ClientError) {
				if (error.response.errors) {
					setErrors(error.response.errors);
					return;
				}
			}

			notifications.show({
				message: "Failed to create project, please try again later.",
				color: "red",
			});
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			description: "",
			environment: "production",
			private: false,
		},
		validatorAdapter: valibotValidator(),
		async onSubmit({ value }) {
			setErrors([]);

			await mutate({
				name: value.name,
				description: value.description,
				defaultEnvironmentName: value.environment,
				isPublic: !value.private,
			});
		},
	});

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		event.stopPropagation();
		form.handleSubmit();
	}

	return (
		<Container>
			<Title order={1}>Create project</Title>

			<form onSubmit={handleSubmit}>
				<Stack py="md">
					<div>
						<form.Field
							name="name"
							validators={{
								onChange: v.pipe(v.string(), v.trim(), v.nonEmpty()),
							}}
						>
							{(field) => (
								<TextInput
									required
									name={field.name}
									label="Name"
									description="Name of your project."
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									{...getValueFieldProps(field.state)}
								/>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="description">
							{(field) => (
								<TextInput
									name={field.name}
									label="Description"
									description="Description of the project."
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									{...getValueFieldProps(field.state)}
								/>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field
							name="environment"
							validators={{
								onChange: v.picklist(ENVIRONMENTS.map((env) => env.value)),
							}}
						>
							{(field) => (
								<Select
									name={field.name}
									label="Environment"
									description="Default environment to create."
									data={ENVIRONMENTS}
									onBlur={field.handleBlur}
									onChange={(value) => value && field.handleChange(value)}
									{...getValueFieldProps(field.state)}
								/>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="private">
							{(field) => (
								<Switch
									pt="xs"
									name={field.name}
									label="Private?"
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.checked)}
									{...getCheckedFieldProps(field.state)}
								/>
							)}
						</form.Field>
					</div>
				</Stack>

				{errors && errors.length > 0 && (
					<Alert color="red" mt="md" icon={<IconInfoCircle />}>
						<List>
							{errors.map((error) => (
								<List.Item key={error.message}>{error.message}</List.Item>
							))}
						</List>
					</Alert>
				)}

				<Flex justify="center" mt="xl">
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								size="lg"
								disabled={!canSubmit}
								loading={isSubmitting || isPending}
							>
								Create
							</Button>
						)}
					</form.Subscribe>
				</Flex>
			</form>
		</Container>
	);
}
