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
import { IconWhirl } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import type { FormEvent } from "react";
import * as v from "valibot";
import { ENVIRONMENTS } from "~/utils/data";
import { getValueFieldProps } from "~/utils/form";

export default function ServiceCreate() {
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

				<Flex justify="center" mt="xl">
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								size="lg"
								leftSection={<IconWhirl />}
								disabled={!canSubmit}
								loading={isSubmitting}
							>
								Spin
							</Button>
						)}
					</form.Subscribe>
				</Flex>
			</form>
		</Container>
	);
}
