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
import { IconListTree, IconTrain, IconWhirl } from "@tabler/icons-react";

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
				<MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
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
					to="/"
					label="Active services"
					leftSection={<IconListTree size="1rem" />}
				/>
				<NavLink
					component={Link}
					to="/new"
					label="Spin up service"
					leftSection={<IconWhirl size="1rem" />}
				/>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
