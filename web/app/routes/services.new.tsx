import {
	Anchor,
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
import { Link, json, useLoaderData, useNavigate } from "@remix-run/react";
import { IconWhirl } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { LIST_PROJECTS, READ_PROJECT } from "~/queries";
import { getValueFieldProps } from "~/utils/form";

function listProjects() {
	return graphqlClient.request(LIST_PROJECTS);
}

function readProject(id: string) {
	return graphqlClient.request(READ_PROJECT, { id });
}

export async function loader() {
	return json({ projects: await listProjects() });
}

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
			projectId: "",
			environmentId: "",
			type: "empty",
			// Repository
			repoUrl: "",
			repoBranch: "master",
			// Docker
			dockerImage: "",
		},
		validatorAdapter: valibotValidator(),
		async onSubmit({ value }) {
			setErrors([]);

			await mutate({
				branch: value.type === "repo" ? value.repoBranch : undefined,
				projectId: value.projectId,
				environmentId: value.environmentId,
				name: value.name,
				source:
					value.type === "repo"
						? { repo: value.repoUrl }
						: value.type === "docker"
							? { image: value.dockerImage }
							: undefined,
			});
		},
	});

	const initialData = useLoaderData<typeof loader>();
	const selectedProjectId = form.useStore((state) => state.values.projectId);

	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: listProjects,
		initialData: initialData.projects,
	});
	const { data: selectedProject } = useQuery({
		queryKey: ["project", selectedProjectId],
		queryFn: () =>
			selectedProjectId ? readProject(selectedProjectId) : undefined,
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
						<form.Field
							name="projectId"
							validators={{
								onChange: v.pipe(v.string(), v.nonEmpty()),
							}}
						>
							{(field) => (
								<Select
									required
									name={field.name}
									label="Project"
									description={
										<>
											Project to create the service within.{" "}
											<Anchor component={Link} to="/projects/new" size="xs">
												Create a project
											</Anchor>
											?
										</>
									}
									placeholder="Select a project"
									data={projects.projects.edges.map(({ node }) => ({
										label: node.name,
										value: node.id,
									}))}
									onBlur={field.handleBlur}
									onChange={(value) => value && field.handleChange(value)}
									{...getValueFieldProps(field.state)}
								/>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field
							name="name"
							validators={{
								onChange: v.pipe(v.string(), v.nonEmpty()),
							}}
						>
							{(field) => (
								<TextInput
									required
									name={field.name}
									label="Name"
									description="Name of your service."
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									{...getValueFieldProps(field.state)}
								/>
							)}
						</form.Field>
					</div>

					<div>
						<form.Field name="environmentId">
							{(field) => (
								<Select
									required
									name={field.name}
									label="Environment"
									description="Environment to create the service in."
									disabled={
										!selectedProject ||
										selectedProject.project.environments.edges.length === 0
									}
									data={selectedProject?.project.environments.edges.map(
										({ node }) => ({ label: node.name, value: node.id }),
									)}
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
											name="repoUrl"
											validators={{
												onChange: v.pipe(v.string(), v.url()),
											}}
										>
											{(field) => (
												<TextInput
													required
													name={field.name}
													label="Repository"
													description="URL of your repository."
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													{...getValueFieldProps(field.state)}
												/>
											)}
										</form.Field>
									</div>

									<div>
										<form.Field
											name="repoBranch"
											validators={{
												onChange: v.pipe(v.string(), v.nonEmpty()),
											}}
										>
											{(field) => (
												<TextInput
													required
													name={field.name}
													label="Branch name"
													description="Name of branch to spin up."
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
										name="dockerImage"
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
