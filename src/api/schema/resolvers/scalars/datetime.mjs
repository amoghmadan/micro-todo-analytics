import { GraphQLScalarType } from "graphql";
import { fromTimestamp } from "#/api/utils/transform.mjs";

export const DateTime = new GraphQLScalarType({
  name: "DateTime",
  description: "Converts a gRPC Timestamp object into an ISO 8601 string.",

  serialize(value) {
    const date = fromTimestamp(value);
    return date.toISOString();
  },
  parseValue(value) {
    const ms = Date.parse(value);
    return { seconds: Math.floor(ms / 1000), nanos: (ms % 1000) * 1000000 };
  },
  parseLiteral(ast) {
    const ms = Date.parse(ast.value);
    return { seconds: Math.floor(ms / 1000), nanos: (ms % 1000) * 1000000 };
  }
});

export default DateTime;
