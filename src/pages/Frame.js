import { AppShell, NavLink, Burger, Group, Text, MantineProvider, createTheme, ActionIcon, useMantineColorScheme, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconHome, IconBrandDeezer, IconAdjustmentsAlt, IconSun, IconMoon } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'cyan',
});

function Frame({ children }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const navigate = useNavigate();

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
    >
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
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
              <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
              <Text size='xl' fw={700}>InSynth</Text>
            </Group>
            <Group>
              <Button onClick={() => navigate('/')} variant='outline'>
                <IconHome />
              </Button>
              <ActionIcon
                variant="outline"
                color={dark ? 'yellow' : 'blue'}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <NavLink href='#/' label='Home' leftSection={<IconHome />} />
          <NavLink href='#/Dashboard' label='Dashboard' leftSection={<IconDashboard />} />
          <NavLink href='#/Playground' label='Playground' leftSection={<IconBrandDeezer />} />
          <NavLink label='Exercise' leftSection={<IconAdjustmentsAlt />}>
            <NavLink href='#/SoundSynth' label='Sound Synthesis' />
            <NavLink href='#/EffectExercise/setup' label='Effect Exercise' />
            {/* <NavLink href='#/SoundQ3' label='Question Type 3' /> */}
            <NavLink href='#/MixingEq' label='EQ Exercise' />
            {/* <NavLink href='#/SynthQ2' label='Eq2' /> */}
            <NavLink href='#/AmplitudeExercise/setup' label='Amplitude' />
            <NavLink href='#/PanningExercise/setup' label='Panning' />
            {/* <NavLink href='#/SoundQ3' label='Question Type 3' /> */}
            {/* <NavLink href='#/MixingEq' label='Eq1' /> */}
            {/* <NavLink href='#/SynthQ2' label='Eq2' /> */}

          </NavLink>
        </AppShell.Navbar>
        <AppShell.Main>
          {children}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default Frame;