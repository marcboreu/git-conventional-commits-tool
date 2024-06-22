#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const commitTypes = [
    { name: 'feat: A new feature', value: '✨ feat' },
    { name: 'fix: A bug fix', value: '🐛 fix' },
    { name: 'docs: Documentation only changes', value: '📚 docs' },
    { name: 'style: Changes that do not affect the meaning of the code', value: '💎 style' },
    { name: 'refactor: A code change that neither fixes a bug nor adds a feature', value: '📦 refactor' },
    { name: 'perf: A code change that improves performance', value: '🚀 perf' },
    { name: 'test: Adding missing tests or correcting existing tests', value: '🚨 test' },
    { name: 'build: Changes that affect the build system or external dependencies', value: '🛠 build' },
    { name: 'ci: Changes to our CI configuration files and scripts', value: '⚙️ ci' },
    { name: 'chore: `Other changes that don\'t modify src or test files', value: '♻️ chore' },
    { name: 'revert: Reverts a previous commit', value: '🗑 revert' }
];

const configPath = path.join(os.homedir(), '.commit-tool-config.json');

function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function loadConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath));
    }
    return {};
}

program
    .argument('<message>', 'Commit message')
    .action((message) => {
        const config = loadConfig();

        if (message.trim().length === 0) {
            console.error('Error: Commit message cannot be empty.');
            process.exit(1);
        }

        const questions = [
            {
                type: 'list',
                name: 'type',
                message: 'Select the type of change you are committing:',
                choices: commitTypes,
                default: config.defaultType
            },
            {
                type: 'input',
                name: 'scope',
                message: 'Enter the scope of this change (optional):',
                default: config.defaultScope || ''
            },
            {
                type: 'checkbox',
                name: 'files',
                message: 'Select the files to include in the commit:',
                choices: () => {
                    return new Promise((resolve, reject) => {
                        exec('git status --porcelain', (error, stdout, stderr) => {
                            if (error) {
                                reject(error);
                            }
                            if (stderr) {
                                reject(stderr);
                            }
                            const files = stdout.split('\n').filter(line => line.trim() !== '').map(line => line.trim().split(' ').pop());
                            resolve(files);
                        });
                    });
                }
            },
            {
                type: 'confirm',
                name: 'confirmCommit',
                message: 'Do you want to proceed with this commit?',
                default: true
            },
            {
                type: 'confirm',
                name: 'savePreferences',
                message: 'Do you want to save these preferences for future commits?',
                default: false
            }
        ];

        inquirer.prompt(questions).then(answers => {
            if (!answers.confirmCommit) {
                console.log('Commit cancelled.');
                return;
            }

            if (answers.savePreferences) {
                saveConfig({
                    defaultType: answers.type,
                    defaultScope: answers.scope
                });
            }

            const scope = answers.scope ? `(${answers.scope})` : '';
            const commitMessage = `${answers.type}${scope}: ${message}`;
            const files = answers.files.join(' ');

            exec(`git add ${files} && git commit -m "${commitMessage}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return;
                }
                console.log(stdout);
            });
        });
    });

program.parse(process.argv);
