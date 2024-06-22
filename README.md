
#  Convential Commits Tool

This project is a command-line tool designed to facilitate the creation of commits in Git. It uses the commander package for argument management and inquirer for user interaction. The tool allows you to select the commit type, scope, and files to include, and it can save preferences for future commits.

## Installation
To use this tool, you need to have Node.js and npm installed. Then, install the necessary dependencies:

bash
Copiar código
npm install commander inquirer
Usage
Save the provided code in a file, for example, commit-tool.js.
Ensure the file has execution permissions:
bash
Copiar código
chmod +x commit-tool.js
Run the tool from the command line, passing the commit message as an argument:
bash
Copiar código
./commit-tool.js "Your commit message"

## Configuration
The tool saves user preferences in a JSON file located at ~/.commit-tool-config.json. This file is automatically created and updated based on user choices if the user opts to save preferences.

Example
Run the following command to create a commit with the message "Initial commit":

The tool will prompt you to select the type of change, enter an optional scope, select the files to include in the commit, and confirm the commit. You will also have the option to save your preferences for future commits.

### License
This project is licensed under the MIT License.