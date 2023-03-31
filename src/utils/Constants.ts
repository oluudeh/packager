import * as core from '@actions/core';

export default class Constants {
    private static readonly DEPLOY_TOKEN_STRING = 'DEPLOY_TOKEN';
    private static readonly SCHEMA_FILE_PATH_STRING = 'SCHEMA_FILE_PATH';

    static readonly SCHEMA_FILE_PATH = core.getInput(Constants.SCHEMA_FILE_PATH_STRING);
    static readonly DEPLOY_TOKEN = core.getInput(Constants.DEPLOY_TOKEN_STRING);

    static readonly DEPLOYMENT_KOTLIN = 'kotlin';
    static readonly DEPLOYMENT_JAVA = 'java';
    static readonly DEPLOYMENT_SPRING = 'spring';
    static readonly DEPLOYMENT_TYPESCRIPT_AXIOS = 'typescript-axios';
    static readonly DEPLOYMENT_PHP = 'php';

    static readonly GRADLE_PLUGINGS = (owner: string, repoName: string, githubToken: string) => `

    `;

    static readonly SETTINGS_XML = (githubUsername: string, githubToken: string) => ``;

    static readonly POM_DISTRIBUTION = (owner: string, repoName: string) => ``;

    static readonly POM_PROPERTIES = ``;
}