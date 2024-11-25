import { useState } from 'react';
import { Group, rem } from '@mantine/core';
import { useMove } from '@mantine/hooks';

function VSlider({ value, onChange }) {
  const [val, setVal] = useState(0.2);
  const { ref } = useMove(({ y }) => setVal(1 - y));

  return (
    <Group justify="center">
      <div
        ref={ref}
        style={{
          width: rem(16),
          height: rem(120),
          backgroundColor: 'var(--mantine-color-blue-light)',
          position: 'relative',
        }}
      >
        {/* Filled bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            height: `${val * 100}%`,
            width: rem(16),
            backgroundColor: 'var(--mantine-color-blue-filled)',
            opacity: 0.7,
          }}
        />

        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            bottom: `calc(${val * 100}% - ${rem(8)})`,
            left: 0,
            width: rem(16),
            height: rem(16),
            backgroundColor: 'var(--mantine-color-blue-7)',
          }}
        />
      </div>
    </Group>
  );
}

export default VSlider;