import { useEffect, useState } from 'react';
import { useMantineTheme } from '@mantine/core';
import { useMove } from '@mantine/hooks';

function HSlider({ initPos = 0.5, onChange, index = 0, min = 0, max = 100, width = 160, scalingFunc = (min, max, x) => Math.round(min + x * (max - min)), resetFlag }) {
  const theme = useMantineTheme();
  const [value, setValue] = useState(initPos); // Normalized value (0 to 1)
  const [outValue, setOutValue] = useState(min + initPos * (max - min)); // Actual value based on min and max
  const [isHovered, setIsHovered] = useState(false);

  const { ref } = useMove(({ x }) => {
    // Update value based on horizontal position
    setValue(x);

    // Calculate the actual output value
    const newOutValue = scalingFunc(min, max, x);
    // const newOutValue = Math.round(min + x * (max - min));
    setOutValue(newOutValue);

    // Call onChange if provided
    if (onChange) {
      onChange(newOutValue, index);
    }
  });

  useEffect(() => {
    setValue(initPos);
    setOutValue(scalingFunc(min, max, initPos));
    // setOutValue(Math.round(min + initPos * (max - min)));
  }, [resetFlag, initPos, min, max]);

  return (
    <div
      ref={ref}
      style={{
        width: width,
        height: 16,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        position: 'relative',
      }}
    >
      {/* Filled bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: `${value * 100}%`,
          height: 16,
          backgroundColor: theme.colors.blue[2],
        }}
      />

      {/* Thumb */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          left: `calc(${value * 100}% - 8px)`,
          top: 0,
          width: 16,
          height: 16,
          backgroundColor: theme.colors.blue[7],
        }}
      />

      {/* Value label */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            left: `calc(${value * 100}% - 8px)`,
            top: '-28px', // Position the label above the slider
            transform: 'translateX(-50%)', // Center the label horizontally
            padding: '4px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none', // Prevent this from blocking mouse events
            zIndex: 1, // Ensure the label appears above other elements
          }}
        >
          {outValue}
        </div>
      )}
    </div>
  );
}

export default HSlider;