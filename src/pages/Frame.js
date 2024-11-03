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
        <NavLink href='/' label='Home' leftSection={<IconHome />} />
        <NavLink href='/Dashboard' label='Dashboard' leftSection={<IconDashboard />} />
        <NavLink href='/SoundExercise' label='Sound Exercise' leftSection={<IconHeadphones />} />
        <NavLink href='/SynthExercise' label='Synth Exercise' leftSection={<IconAdjustmentsAlt />} />
      </AppShell.Navbar>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default Frame;