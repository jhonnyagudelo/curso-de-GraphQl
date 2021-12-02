import axios from "axios";
import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v1 as uuid } from "uuid";
const persons = [
  {
    age: "32",
    name: "jhonny",
    street: "calle 34a",
    city: "Palmira",
    cc: "11364502",
  },
  {
    age: "13",
    name: "stiven",
    phone: "312-700-0718",
    street: "calle 15 107",
    city: "Palmira",
    cc: "113648956",
  },
  {
    age: "16",
    name: "diven",
    phone: "312-747-002",
    street: "calle 58",
    city: "Palmira",
    cc: "113110102",
  },
];

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    canDrink: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
      age: String
    ): Person

    editNumber(name: String!, phone: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,

    allPersons: async (root, args) => {
      const { data: personsFromRestApi } = await axios.get(
        "http://localhost:3000/persons"
      );
      console.log(personsFromRestApi);
      if (!args.phone) return personsFromRestApi;

      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;
      return personsFromRestApi.filter(byPhone);
    },
    findPerson: (root, args) => {
      const { name } = args;
      return (
        persons.find((person) => person.name === name) || { name: "Not found" }
      );
    },
  },
  // laura marcela valencia
  Mutation: {
    addPerson: (root, args) => {
      //const { name,   phone, street, city } = args
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuid() };
      persons.push(person); //update database with new person
      return person;
    },

    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name);
      if (!personIndex === -1) return null;
      const person = persons[personIndex];

      const updatedPerson = { ...person, phone: args.phone };
      persons[personIndex] = updatedPerson;
      return updatedPerson;
    },
  },

  //otras formas
  //sirve para crear calculos
  Person: {
    canDrink: (root) => root.age > 18,
    address: (root) => `${root.street}, ${root.city}`,
    //diferenciar la informacion de la db y como preguntar por la informacion y como recuoperar en el cliente
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`);
});
