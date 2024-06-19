import "@mantine/core/styles.css";
// import "@mantine/form/styles.css";

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
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { IconBoxModel2, IconListTree, IconTrain } from "@tabler/icons-react";

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
          href="#required-for-focus"
          label="Containers"
          leftSection={<IconBoxModel2 size="1rem" />}
          childrenOffset={28}
        >
          <NavLink
            href="/containers"
            label="View running containers"
            leftSection={<IconListTree size="1rem" />}
          />
          <NavLink
            href="/containers/new"
            label="Spin up container"
            leftSection={<IconBoxModel2 size="1rem" />}
          />
        </NavLink>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
