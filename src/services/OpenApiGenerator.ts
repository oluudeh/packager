import {execute} from '../utils/execute';
import * as core from '@actions/core';

export default class OpenApiGenerator {
    static async generate(options: {
        input: string,
        output: string,
        generator: string,
        additionalProps: string[],
        gitUserId: string,
        gitRepoId: string
    }) : Promise<string> {
        const command = `openapi-generator-cli generate -i ${options.input} -g ${options.generator} -o ${options.output} --git-user-id ${options.gitUserId} --git-repo-id ${options.gitRepoId} --additional-properties=${options.additionalProps.join(',')}`;
        core.notice(command);
        return execute(command);
    }
}