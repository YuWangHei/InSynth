import { Container, Paper, Stack, Group, Title } from "@mantine/core";

function CustomContainer({ children, size = "xs", title }) {
  return (
    <Container size={size} px="md">
      <Paper shadow="md" p="xl" radius="md">
        <Stack>
          <Title order={1}>{title}</Title>
          {children}
        </Stack>
      </Paper>
    </Container>
  )
}

export default CustomContainer;