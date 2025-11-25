export interface ProjectConfig {
    name: string;
    architecture: "feature" | "service";
    database: "mongodb" | "postgresql" | "mysql" | "none";
}
export declare function createProject(projectName: string, architecture: string, database: string): Promise<void>;
//# sourceMappingURL=common.d.ts.map