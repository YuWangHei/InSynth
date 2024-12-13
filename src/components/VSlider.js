import { useEffect, useState } from 'react';
import { useMantineTheme } from '@mantine/core';
import { useMove } from '@mantine/hooks';

function VSlider({ initPos = 0.5, onChange, index = 0, min = 0, max = 100, height = 120, resetFlag }) {
  // Ensure initPos is between 0 and 1
  if (initPos > 1 || initPos < 0) {
    alert('Invalid initPos in <VSlider/>.');
  }

  // Initialize theme and state
  const theme = useMantineTheme();
  const [value, setValue] = useState(initPos);
  const [outValue, setOutValue] = useState(min + (1 - initPos) * (max - min));
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (resetFlag) {
      setValue(0.5);
      setOutValue(0);
    }
  }, [resetFlag]);

  const { ref } = useMove(({ y }) => {
    // Update value based on vertical position
    setValue(1 - y);

    // Calculate outValue based on min and max
    const newOutValue = Math.round(min + (1 - y) * (max - min));
    setOutValue(newOutValue);

    // Call onChange if provided
    if (onChange) {
      onChange(newOutValue, index);
    }
  });

  return (
    <div
      ref={ref}
      style={{
        width: 16,
        height: height,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        position: 'relative',
      }}
    >
      {/* Filled bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          height: `${value * 100}%`,
          width: 16,
          backgroundColor: theme.colors.blue[2],
        }}
      />

      {/* Thumb */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          bottom: `calc(${value * 100}% - 8px)`,
          left: 0,
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
            bottom: `calc(${value * 100}% + 20px)`, // Position the label above the thumb
            left: '50%', // Center the label horizontally
            transform: 'translateX(-50%)', // Adjust for centering
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

export default VSlider;