import { AppShell, NavLink, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconHome, IconHeadphones, IconAdjustmentsAlt } from '@tabler/icons-react';
import React from 'react';

function Frame({ children }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          {/* <MantineLogo size={30} /> */}
          <Text size='xl' fw={700}>Title</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {/* Links have to be in shape of "/#/{name}" to fit in HashRouter's need */}
        <NavLink href='/' label='Home' leftSection={<IconHome />} />
        <NavLink href='/#/Dashboard' label='Dashboard' leftSection={<IconDashboard />} />
        <NavLink label='Sound Exercise' leftSection={<IconHeadphones />}>
          <NavLink href='/#/SoundQ1' label='Question Type 1' />
          <NavLink href='/#/SoundQ2' label='Question Type 2' />
          <NavLink href='/#/SoundQ3' label='Question Type 3' />
        </NavLink>
        <NavLink label='Synth Exercise' leftSection={<IconAdjustmentsAlt />}>
          <NavLink href='/#/SynthQ1' label='Question Type 1' />
          <NavLink href='/#/SynthQ2' label='Question Type 2' />
          <NavLink href='/#/SynthQ3' label='Question Type 3' />
        </NavLink>
      </AppShell.Navbar>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default Frame;