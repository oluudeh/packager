import OpenApiGenerator from "../services/OpenApiGenerator";
import Constants from "../utils/Constants";
import github from '@actions/github';
import * as core from '@actions/core';
import { FileService } from "../services/FileService";
import { execute } from "../utils/execute";

export default class KotlinPublisher {
    static async publish(artifact: string, group: string, version: string) {
        await OpenApiGenerator.generate({
            input: Constants.SCHEMA_FILE_PATH,
            output: Constants.DEPLOYMENT_KOTLIN,
            generator: Constants.DEPLOYMENT_KOTLIN,
            additionalProps: [
                `artifactId=${artifact}`,
                `artifactVersion=${version}`,
                `groupId=${group}`
            ],
            gitUserId: github.context.repo.owner,
            gitRepoId: github.context.repo.repo
        });
        core.notice(`${Constants.DEPLOYMENT_KOTLIN} Creation complete`);

        let gradle = await FileService.read(Constants.DEPLOYMENT_KOTLIN + '/build.gradle');
        gradle = gradle.replace(
            "apply plugin: 'kotlin'",
            Constants.GRADLE_PLUGINGS(github.context.repo.owner, github.context.repo.repo, Constants.DEPLOY_TOKEN)
        );

        await FileService.write(Constants.DEPLOYMENT_KOTLIN + '/build.gradle', gradle);
        core.notice(`${Constants.DEPLOYMENT_KOTLIN} Gradle file updated`);

        await KotlinPublisher.publishCommand(Constants.DEPLOYMENT_KOTLIN);
        core.notice(`${Constants.DEPLOYMENT_KOTLIN} Published`);
    }

    private static async publishCommand(output: string) {
        await execute(`cd ${output}; gradle publish`);
    }
}