import { gql } from "apollo-server-core";
import { ApolloServer } from "apollo-server";
const persons = [
  {
    name: "jhonny",
    phone: "312-747-0718",
    street: "calle 34a",
    city: "Palmira",
    cc: "11364502",
  },
  {
    name: "stiven",
    phone: "312-700-0718",
    street: "calle 15 107",
    city: "Palmira",
    cc: "113648956",
  },
  {
    name: "diven",
    phone: "312-747-002",
    street: "calle 58",
    city: "Palmira",
    cc: "113110102",
  },
];

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String
    city: String
    cc: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
  },
};

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`);
});
