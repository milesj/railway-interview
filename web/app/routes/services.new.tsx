import {
	Button,
	Container,
	Flex,
	Input,
	SegmentedControl,
	Select,
	Space,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "@remix-run/react";
import { IconWhirl } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import type { ServiceCreateInput } from "gql/graphql";
import type { GraphQLError } from "graphql";
import { ClientError } from "graphql-request";
import { type FormEvent, useState } from "react";
import * as v from "valibot";
import { graphqlClient } from "~/clients/graphql";
import { FormActions } from "~/components/FormActions";
import { FormErrors } from "~/components/FormErrors";
import { CREATE_SERVICE } from "~/mutations";
import { ENVIRONMENTS } from "~/utils/data";
import { getValueFieldProps } from "~/utils/form";

export default function ServiceCreate() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [errors, setErrors] = useState<GraphQLError[]>();
	const { mutate, isPending } = useMutation({
		mutationFn: (input: ServiceCreateInput) =>
			graphqlClient.request(CREATE_SERVICE, { input }),
		onSuccess(data) {
			notifications.show({
				message: `Service ${data.serviceCreate.name} has been created! Will redirect in 3 seconds.`,
				color: "green",
				autoClose: 3000,
			});

			// Clear project cache
			queryClient.invalidateQueries({
				queryKey: ["project", data.serviceCreate.projectId],
			});

			// Then redirect to the services page
			setTimeout(() => {
				navigate(`/services?projectId=${data.serviceCreate.projectId}`);
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
				message: "Failed to create service, please try again later.",
				color: "red",
			});
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			environment: "production",
			type: "empty",
			// Repository
			repo_url: "",
			repo_branch: "master",
			// Docker
			docker_image: "",
		},
		validatorAdapter: valibotValidator(),
		async onSubmit(data) {
			setErrors([]);

			console.log(data);
		},
	});

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		event.stopPropagation();
		form.handleSubmit();
	}

	return (
		<Container>
			<Title order={1}>Spin up service</Title>

			<form onSubmit={handleSubmit}>
				<Stack py="md">
					<div>
						<form.Field name="name">
							{(field) => (
								<TextInput
									name={field.name}
									label="Name"
									description="Name of your service. If not provided, will be automatically generated."
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
									required
									name={field.name}
									label="Environment"
									description="Environment to create the service in."
									data={ENVIRONMENTS}
									onBlur={field.handleBlur}
									onChange={(value) => value && field.handleChange(value)}
									{...getValueFieldProps(field.state)}
								/>
							)}
						</form.Field>
					</div>

					<div>
						<Input.Wrapper
							label="Type"
							description="Type of service to create."
							required
						>
							<Space pt="xs">
								<form.Field name="type">
									{(field) => (
										<SegmentedControl
											name={field.name}
											data={[
												{ label: "GitHub repository", value: "repo" },
												{
													label: "Template",
													value: "template",
													disabled: true,
												},
												{
													label: "Database",
													value: "database",
													disabled: true,
												},
												{
													label: "Docker image",
													value: "docker",
												},
												{ label: "Empty", value: "empty" },
											]}
											onChange={field.handleChange}
											{...getValueFieldProps(field.state)}
										/>
									)}
								</form.Field>
							</Space>
						</Input.Wrapper>
					</div>

					<form.Subscribe selector={(state) => state.values.type === "repo"}>
						{(selected) =>
							selected && (
								<>
									<div>
										<form.Field
											name="repo_url"
											validators={{
												onChange: v.union([
													v.pipe(v.string(), v.url()),
													v.pipe(v.string(), v.startsWith("git@")),
												]),
											}}
										>
											{(field) => (
												<TextInput
													required
													name={field.name}
													label="Repository"
													description="URL of your repository. Supports both https and git protocols."
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													{...getValueFieldProps(field.state)}
												/>
											)}
										</form.Field>
									</div>

									<div>
										<form.Field
											name="repo_branch"
											validators={{
												onChange: v.pipe(v.string(), v.nonEmpty()),
											}}
										>
											{(field) => (
												<TextInput
													required
													name={field.name}
													label="Branch name"
													description="Name of branch to spinup."
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													{...getValueFieldProps(field.state)}
												/>
											)}
										</form.Field>
									</div>
								</>
							)
						}
					</form.Subscribe>

					<form.Subscribe selector={(state) => state.values.type === "docker"}>
						{(selected) =>
							selected && (
								<div>
									<form.Field
										name="docker_image"
										validators={{
											onChange: v.pipe(v.string(), v.nonEmpty()),
										}}
									>
										{(field) => (
											<TextInput
												required
												name={field.name}
												label="Image"
												description="Name of a Docker image from DockerHub, GHCR, or quay.io."
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												{...getValueFieldProps(field.state)}
											/>
										)}
									</form.Field>
								</div>
							)
						}
					</form.Subscribe>
				</Stack>

				<FormErrors errors={errors} />

				<FormActions>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								size="lg"
								leftSection={<IconWhirl />}
								disabled={!canSubmit || isPending}
								loading={isSubmitting || isPending}
							>
								Spin
							</Button>
						)}
					</form.Subscribe>
				</FormActions>
			</form>
		</Container>
	);
}
