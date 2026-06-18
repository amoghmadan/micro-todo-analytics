import apiRouter from "#/api/urls/api/index.mjs";
import graphqlRouter from "#/api/urls/graphql.mjs";

const routers = new Map([
  ["/api", apiRouter],
  ["/graphql", graphqlRouter],
]);

export default routers;
