import React, { useRef, useState } from 'react';
import { Button, Group, Text, FileButton, Container , Switch, Title, Stack} from '@mantine/core';
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
      <Container size="lg" px="md">
        <Title order={1} align='center'>
          Playground
        <Text size="md" fs={700} >
          You can upload your audio file here and tryout different synthesizing techniques.
        </Text>
      </Title>
      <Container size="lg">
        <Stack position="center" direction="column" spacing="lg">
          <FileButton
            onChange={handleFileSelect}
            accept="audio/wav"
            color="green"
            fullWidth = {false}
            >
            {(props) => (
              <Button {...props} size="lg">
                {file ? 'Change audio file' : 'Upload audio file'}
              </Button>
              )}
          </FileButton>
            
          <Group> 
            {file && (
              <Text size="md">
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

            <Group>
              {file && (
                <>
                <span>Play once</span>
                <Switch
                  checked={isInfiniteLoop}
                  onChange={() => setIsInfiniteLoop(!isInfiniteLoop)}
                />
                  <span>Infinite Loop</span>
                </>
              )}
            </Group>
          </Group>
          {/* Add your playground controls here */}
          {file && (
            <Group position="center" spacing="md">
              {/* Add your audio processing controls */}
            </Group>
          )}
        </Stack>
        </Container>
      </Container>
    </Frame>
  );
}

export default Playground;
