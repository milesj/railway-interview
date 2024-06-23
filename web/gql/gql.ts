/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nmutation DeleteProject($id: String!) {\n\t\tprojectDelete(id: $id)\n}": types.DeleteProjectDocument,
    "\nquery ListProjects {\n\tprojects {\n\t\tedges {\n\t\t\tcursor\n\t\t\tnode {\n\t\t\t\tcreatedAt\n\t\t\t\tdeletedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\tisPublic\n\t\t\t\tisTempProject\n\t\t\t\tname\n\t\t\t\tsubscriptionPlanLimit\n\t\t\t\tsubscriptionType\n\t\t\t\tteam {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tteamId\n\t\t\t}\n\t\t}\n\t\tpageInfo {\n\t\t\tendCursor\n\t\t\tstartCursor\n\t\t\thasNextPage\n\t\t\thasPreviousPage\n\t\t}\n\t}\n}": types.ListProjectsDocument,
    "\nmutation CreateProject($input: ProjectCreateInput!) {\n\tprojectCreate(input: $input) {\n\t\tid\n\t\tname\n\t}\n}": types.CreateProjectDocument,
    "\nquery ReadProject($id: String!) {\n\tproject(id: $id) {\n\t\tid\n\t\tname\n\t\tservices {\n\t\t\tedges {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tcreatedAt\n\t\t\t\t\ticon\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\tendCursor\n\t\t\t\tstartCursor\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t}\n\t\t}\n\t}\n}": types.ReadProjectDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation DeleteProject($id: String!) {\n\t\tprojectDelete(id: $id)\n}"): (typeof documents)["\nmutation DeleteProject($id: String!) {\n\t\tprojectDelete(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ListProjects {\n\tprojects {\n\t\tedges {\n\t\t\tcursor\n\t\t\tnode {\n\t\t\t\tcreatedAt\n\t\t\t\tdeletedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\tisPublic\n\t\t\t\tisTempProject\n\t\t\t\tname\n\t\t\t\tsubscriptionPlanLimit\n\t\t\t\tsubscriptionType\n\t\t\t\tteam {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tteamId\n\t\t\t}\n\t\t}\n\t\tpageInfo {\n\t\t\tendCursor\n\t\t\tstartCursor\n\t\t\thasNextPage\n\t\t\thasPreviousPage\n\t\t}\n\t}\n}"): (typeof documents)["\nquery ListProjects {\n\tprojects {\n\t\tedges {\n\t\t\tcursor\n\t\t\tnode {\n\t\t\t\tcreatedAt\n\t\t\t\tdeletedAt\n\t\t\t\tdescription\n\t\t\t\tid\n\t\t\t\tisPublic\n\t\t\t\tisTempProject\n\t\t\t\tname\n\t\t\t\tsubscriptionPlanLimit\n\t\t\t\tsubscriptionType\n\t\t\t\tteam {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tteamId\n\t\t\t}\n\t\t}\n\t\tpageInfo {\n\t\t\tendCursor\n\t\t\tstartCursor\n\t\t\thasNextPage\n\t\t\thasPreviousPage\n\t\t}\n\t}\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateProject($input: ProjectCreateInput!) {\n\tprojectCreate(input: $input) {\n\t\tid\n\t\tname\n\t}\n}"): (typeof documents)["\nmutation CreateProject($input: ProjectCreateInput!) {\n\tprojectCreate(input: $input) {\n\t\tid\n\t\tname\n\t}\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery ReadProject($id: String!) {\n\tproject(id: $id) {\n\t\tid\n\t\tname\n\t\tservices {\n\t\t\tedges {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tcreatedAt\n\t\t\t\t\ticon\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\tendCursor\n\t\t\t\tstartCursor\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t}\n\t\t}\n\t}\n}"): (typeof documents)["\nquery ReadProject($id: String!) {\n\tproject(id: $id) {\n\t\tid\n\t\tname\n\t\tservices {\n\t\t\tedges {\n\t\t\t\tcursor\n\t\t\t\tnode {\n\t\t\t\t\tcreatedAt\n\t\t\t\t\ticon\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t\tpageInfo {\n\t\t\t\tendCursor\n\t\t\t\tstartCursor\n\t\t\t\thasNextPage\n\t\t\t\thasPreviousPage\n\t\t\t}\n\t\t}\n\t}\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;