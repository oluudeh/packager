import * as core from '@actions/core';
import {JarDeployment, NPMDeployment, OpenApiYML} from './models/OpenApiYML';
import Constants from './utils/Constants';
import {FileService} from './services/FileService';
import { execute } from './utils/execute';
import TypescriptAxiosPublisher from './publishers/TypescriptAxiosPublisher';

async function main() {
    core.notice(Constants.SCHEMA_FILE_PATH);

    const schemaFile = await FileService.readYML<OpenApiYML>(Constants.SCHEMA_FILE_PATH);
    const deploymentNames = Object.keys(schemaFile['x-deploy']);
    const deploymentValues = Object.values(schemaFile['x-deploy']);

    core.notice(`Found ${deploymentNames.length} deployments`);
    core.notice(`Deployments: ${deploymentNames.join(', ')}`);

    core.notice('Installing OpenAPI Generator CLI');
    await execute('npm install @openapitools/openapi-generator-cli -g');
    await execute(`openapi-generator-cli validate -i ${Constants.SCHEMA_FILE_PATH}`);

    deploymentNames.forEach(async name => {
        switch (name) {
            case 'typescript-case': 
                core.notice('Found Typescript Axios deployment');
                const dep = schemaFile['x-deploy']['typescript-axios'] as NPMDeployment;
                core.notice(`Typescript axios package name: ${dep.name}`);
                await TypescriptAxiosPublisher.publish(dep.name);
                break;

            default:
                core.error(`Unknown deployment: ${name}`);
                break;
        }
    });

}

main()
    .then(() => core.notice('Deployment complete'))
    .catch(err => core.setFailed(err.message))