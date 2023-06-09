import OpenApiGenerator from "../services/OpenApiGenerator";
import Constants from "../utils/Constants";
import * as github from '@actions/github';
import * as core from '@actions/core';
import {FileService} from '../services/FileService';
import { execute } from "../utils/execute";


export default class JavaPublisher {
    static async publish(artifact: string, group: string, version: string) {
        await OpenApiGenerator.generate({
            input: Constants.SCHEMA_FILE_PATH,
            output: Constants.DEPLOYMENT_JAVA,
            generator: Constants.DEPLOYMENT_SPRING,
            additionalProps: [
                `artifactId=${artifact}`,
                `artifactVersion=${version}`,
                `groupId=${group}`,
                `useFeignClient=true`,
                `useFeignClientUrl=false`,
                `library=spring-cloud`,
                `apiPackage=${group}.api`,
                `modelPackage=${group}.model`,
                `invokerPackage=${group}.api`
            ],
            gitUserId: github.context.repo.owner,
            gitRepoId: github.context.repo.repo
        });
        core.notice(`${Constants.DEPLOYMENT_JAVA} Creation complete`);

        let pom = await FileService.read(Constants.DEPLOYMENT_JAVA + '/pom.xml');
        
        pom = pom
            .replace('</project>', Constants.POM_DISTRIBUTION(github.context.repo.owner, github.context.repo.repo))
            .replace('</properties>', Constants.POM_PROPERTIES);

        await FileService.write(Constants.DEPLOYMENT_JAVA + '/pom.xml', pom);
        core.notice(`${Constants.DEPLOYMENT_JAVA} POM file updated`);

        await JavaPublisher.createSettingsXML();
        core.notice(`${Constants.DEPLOYMENT_JAVA} Settings file created`);

        await JavaPublisher.publishCommand();
        core.notice(`${Constants.DEPLOYMENT_JAVA} Published`);
    }

    private static async createSettingsXML() {
        await FileService.write(
            Constants.DEPLOYMENT_JAVA + '/settings.xml',
            Constants.SETTINGS_XML(github.context.repo.owner, Constants.DEPLOY_TOKEN)
        );
    }

    private static async publishCommand() {
        await execute(`ls -la`).then(console.log);
        await execute(`cd ${Constants.DEPLOYMENT_JAVA}; ls -la`).then(console.log);
        await execute(`cd ${Constants.DEPLOYMENT_JAVA}; mvn deploy --settings settings.xml -DskipTests`);
    }
}