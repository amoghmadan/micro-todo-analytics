import { GraphQLEnumType } from "graphql";

const Status = new GraphQLEnumType({
    name: "Status",
    values: {
        STATUS_TODO_UNSPECIFIED: { value: 0 },
        STATUS_IN_PROGRESS: { value: 1 },
        STATUS_DONE: { value: 2 },
        STATUS_SCRAPED: { value: 2 },
    }
});

export default Status;
