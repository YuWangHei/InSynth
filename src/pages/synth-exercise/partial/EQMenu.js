import { Text, Button, Group } from "@mantine/core";
import CustomContainer from "../../../components/CustomContainer";

function EQMenu({ onSelect }) {
  return (
    <CustomContainer title="EQ Exercise">
      <Text>Mode 1: Adjust amplitude of different frequency ranges to simulate the target.</Text>
      <Text>Mode 2: Adjust the given filters to simulate the target.</Text>
      <Group>
        <Button onClick={() => onSelect(true)}>Start Mode 1!</Button>
        <Button onClick={() => onSelect(false)}>Start Mode 2!</Button>
      </Group>
    </CustomContainer>
  )
}

export default EQMenu;