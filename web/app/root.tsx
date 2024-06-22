import "@mantine/core/styles.css";

import {
	AppShell,
	ColorSchemeScript,
	Flex,
	MantineProvider,
	NavLink,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import {
	IconCube,
	IconCubePlus,
	IconTable,
	IconTablePlus,
	IconTrain,
} from "@tabler/icons-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
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
				<MantineProvider defaultColorScheme="dark">
					<QueryClientProvider client={queryClient}>
						{children}
					</QueryClientProvider>
				</MantineProvider>
				<ScrollRestoration />
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
						label="View all"
						leftSection={<IconTable size="1rem" />}
					/>

					<NavLink
						component={Link}
						to="/projects/new"
						label="Create new"
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
