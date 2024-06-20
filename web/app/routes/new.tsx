import { Title } from "@mantine/core";

export default function New() {
  return <Title order={1}>Spin up service</Title>;
}

// branch: String
// environmentId: String

// Environment ID. If the specified environment is a fork, the service will only be created in it. Otherwise it will created in all environments that are not forks of other environments
// name: String
// projectId: String!
// registryCredentials: RegistryCredentialsInput
// source: ServiceSourceInput
// variables: ServiceVariables
