import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
	AppShell,
	ColorSchemeScript,
	Flex,
	MantineProvider,
	NavLink,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
} from "@remix-run/react";
import {
	IconCube,
	IconCubePlus,
	IconTable,
	IconTablePlus,
	IconTrain,
} from "@tabler/icons-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// https://remix.run/docs/en/main/guides/envvars
export async function loader() {
	return json({
		ENV: {
			RAILWAY_TOKEN: process.env.RAILWAY_TOKEN,
		},
	});
}

export function Layout({ children }: { children: React.ReactNode }) {
	const data = useLoaderData<typeof loader>();

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// With SSR, we usually want to set some default staleTime
						// above 0 to avoid refetching immediately on the client
						staleTime: 60 * 1000,
					},
				},
			}),
	);

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider
					defaultColorScheme="dark"
					theme={{ primaryColor: "grape" }}
				>
					<ModalsProvider>
						<QueryClientProvider client={queryClient}>
							{children}
							<Notifications />
						</QueryClientProvider>
					</ModalsProvider>
				</MantineProvider>
				<ScrollRestoration />
				<script
					// biome-ignore lint: allowed here
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
					}}
				/>
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
			}}
			padding="md"
		>
			<AppShell.Header py={10} px={15}>
				<Flex align="center" gap="xs">
					<ThemeIcon mr={5} color="grape">
						<IconTrain size="1.5rem" />
					</ThemeIcon>
					<Title order={2}>Railway station</Title>
				</Flex>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<NavLink
					component={Link}
					to="/projects"
					label="Projects"
					leftSection={<IconTable size="1rem" />}
				>
					<NavLink
						component={Link}
						to="/projects"
						label="View all projects"
						leftSection={<IconTable size="1rem" />}
					/>

					<NavLink
						component={Link}
						to="/projects/new"
						label="Create project"
						leftSection={<IconTablePlus size="1rem" />}
					/>
				</NavLink>

				<NavLink
					component={Link}
					to="/services"
					label="Services"
					leftSection={<IconCube size="1rem" />}
				>
					<NavLink
						component={Link}
						to="/services"
						label="View active"
						leftSection={<IconCube size="1rem" />}
					/>

					<NavLink
						component={Link}
						to="/services/new"
						label="Spin up"
						leftSection={<IconCubePlus size="1rem" />}
					/>
				</NavLink>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
