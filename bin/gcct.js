#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import { exec } from 'child_process';

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
    { name: 'chore: Other changes that don\'t modify src or test files', value: '♻️ chore' },
    { name: 'revert: Reverts a previous commit', value: '🗑 revert' }
];

program
    .argument('<message>', 'Commit message')
    .action((message) => {
        if (!message || typeof message !== 'string') {
            console.error('Error: Commit message must be provided.');
            process.exit(1);
        }

        message = message.trim();

        if (message.length === 0) {
            console.error('Error: Commit message cannot be empty.');
            process.exit(1);
        }

        const questions = [
            {
                type: 'list',
                name: 'type',
                message: 'Select the type of change you are committing:',
                choices: commitTypes
            },
            {
                type: 'input',
                name: 'scope',
                message: 'Enter the scope of this change (optional):'
            },
            {
                type: 'confirm',
                name: 'confirmCommit',
                message: 'Do you want to proceed with this commit?',
                default: true
            }
        ];

        inquirer.prompt(questions).then(answers => {
            if (!answers.confirmCommit) {
                console.log('Commit cancelled.');
                return;
            }

            const scope = answers.scope ? `(${answers.scope})` : '';
            const commitMessage = `${answers.type}${scope}: ${message}`;

            exec(`git commit -m "${commitMessage}"`, (error, stdout, stderr) => {
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
