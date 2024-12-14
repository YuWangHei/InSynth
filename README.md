# AIST2010 Group Project - InSynth
The website is created with React.js, to run and edit the website, please follow the following instruction
---
## Install Script
To install the script, run the following code to download the latest version of the source code:
### `git clone https://github.com/YuWangHei/InSynth.git`
The whole source code will be downloaded in the folder *InSynth*

## Run Script
To run the code and access the website, you first need *Node.js* and *npm* installed

To install Node.js and npm: go check out https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

To install all dependencies:
### `npm install --legacy-peer-deps`
list of dependencies are stored in `package.json`

Note that due to some dependency issues, adding `--legacy-peer-deps` flag is needed so as to install all required packages

To run the website on local pc:
### `npm start`

## File Structure
All the pages are stored in `/src`

### Components
`/src/components` stores useful components for exercises including:

`CustomContainer.js` is a custom container used for UI design, built with Mantine component

`HSlider.js` is a horizontal slider component used in EQ Exercises

`VSlider.js` is a vertical slider component used in EQ Exercises

`SetupPage.js` is a custom UI structure used for selecting difficulty and no. of questions, built with Mantine component

### Music
`/src/Music` stores all sound sample used in exercises and the script `AudioPicker.js` exports function for randomly selecting sound sample

### Dashboard
Dashboard will show the user records of finished exercise by cookies.

If you wish to remove all records, please simply delete the cookies by following instruction of your browser

`/src/dashboard` stores scripts `Dashboard.js` for dashboard 

### Amplitude Exercise
Amplitude exercise allow users to train their ears with questions on gain value

`/src/exercise/AmplitudeExercise` stores the following scripts for Amplitude Exercise:

`AmplitudeExerciseSetup.js` is responsible for selecting difficulties and no. of questions;

`AmplitudeExercise.js` is responsible for the main part of exercise

### Effect Exercise
Effect exercise allow users to train their ears with questions on random effects

`/src/exercise/EffectExercise` stores the following scripts for Effect Exercise:

`EffectExerciseSetup.js` is responsible for selecting difficulties and no. of questions;

`EffectExercise.js` is responsible for the main part of exercise

### EQ Exercise
EQ exercise allow users to train their ears with questions on reproducing random generated EQ

`/src/exercise/EQExercise` stores the following scripts for EQ Exercise:

`EQExerciseSetup.js` is responsible for selecting difficulties and no. of questions;

`EQGraphic.js` is responsible for the main part of graphical eq exercise; 

`EQParametric.js` is responsible for the main part of parametric eq exercise;

### Panning Exercise
Panning exercise allow users to train their ears with questions on guessing random generated pan

`/src/exercise/PanningExercise` stores the following scripts for Panning Exercise:

`PanningExerciseSetup.js` is responsible for selecting difficulties and no. of questions;

`PanningExercise.js` is responsible for the main part of exercise;

`PanningExercise.css` is responsible for the UI components in the exercise

### Sound Exercise
Sound synthesis exercise allow users to train their ears with questions on guessing random synthesised sound

`/src/exercise/SoundExercise` stores the following scripts for Sound Synthesis Exercise:

`AmplitudeExerciseSetup.js` is responsible for selecting difficulties and no. of questions;

`AmplitudeExercise.js` is responsible for the main part of exercise

### Home Page
Home page contains portals for different pages (exercises and playground)

`/src/home` stores scripts for the home page

### Playground
Playground allows user to import their own music file and try add effects on the music file in real-time in order to gain practical experience on filter and effects

`src/playground/Playground.js` is responsible for the playground code

### Frame

`/src/pages/Frame.js` is responsible for the UI of webpage, including sidebars and theme; and also linking sidebar texts to exercise pages

### App

`/src/App.js` is responsible for constructing file path for all pages



