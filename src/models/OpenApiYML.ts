export interface OpenApiYML {
    'x-deploy': Deployment,
    info: {
        version: string
    }
}

export type DeploymentName = 'kotlin' | 'spring' | 'java' | 'typescript-axios' | 'php';

export interface JarDeployment {
    artifact: string;
    group: string;
}

export interface NPMDeployment {
    name: string;
}

export type Deployment = {
    [key in DeploymentName]: JarDeployment | NPMDeployment;
}