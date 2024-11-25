import { useState } from 'react';
import { Group, Text, rem } from '@mantine/core';
import { useMove } from '@mantine/hooks';

function HSlider({ value, onChange }) {
  const [val, setVal] = useState(0.2);
  const { ref } = useMove(({ x }) => setVal(x));

  return (
    <Group justify="center">
      <div
        ref={ref}
        style={{
          width: rem(400),
          height: rem(16),
          backgroundColor: 'var(--mantine-color-blue-light)',
          position: 'relative',
        }}
      >
        {/* Filled bar */}
        <div
          style={{
            width: `${val * 100}%`,
            height: rem(16),
            backgroundColor: 'var(--mantine-color-blue-filled)',
            opacity: 0.7,
          }}
        />

        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${val * 100}% - ${rem(8)})`,
            top: 0,
            width: rem(16),
            height: rem(16),
            backgroundColor: 'var(--mantine-color-blue-7)',
          }}
        />
      </div>
    </Group>
  );
}

export default HSlider;