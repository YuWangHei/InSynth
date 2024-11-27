import React, { useRef, useState } from 'react';
import { Button, Group, Text, FileButton, Container , Switch, Title} from '@mantine/core';
import Frame from '../Frame';

function Playground() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const [isInfiniteLoop, setIsInfiniteLoop] = useState(false);
  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      // Cleanup previous URL if exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      // Create new URL for the audio file
      const newUrl = URL.createObjectURL(selectedFile);
      setAudioUrl(newUrl);
      setFile(selectedFile);

      // Reset audio element
      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <Frame>
      <Title order={1}>Playground</Title>
      <Text>You can upload your audio file here and tryout different synthesizing techniques.</Text>
      <Container size="lg">
        <Group position="center" direction="column" spacing="lg">
          <FileButton
            onChange={handleFileSelect}
            accept="audio/wav"
          >
            {(props) => (
              <Button {...props} size="lg">
                {file ? 'Change audio file' : 'Upload audio file'}
              </Button>
            )}
          </FileButton>
          <span>Play once</span>
          <Switch
            // label={isInfiniteLoop ? 'Infinite Loop' : 'Play once'}
              checked={isInfiniteLoop}
              onChange={() => setIsInfiniteLoop(!isInfiniteLoop)}
          />
          <span>Infinite Loop</span>
          {file && (
            <Text size="sm" c="dimmed">
              Selected file: {file.name}
            </Text>
          )}

          {file && (
            <audio
              ref={audioRef}
              controls
              src={audioUrl}
              preload="auto"
              style={{
                width: '100%',
                maxWidth: '500px'
              }}
              loop={isInfiniteLoop}
            />
          )}

          {/* Add your playground controls here */}
          {file && (
            <Group position="center" spacing="md">
              {/* Add your audio processing controls */}
            </Group>
          )}
        </Group>
      </Container>
    </Frame>
  );
}

export default Playground;
