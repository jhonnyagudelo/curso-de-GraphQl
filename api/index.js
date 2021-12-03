import { ApolloServer, gql } from "apollo-server";
import { v1 as uuid } from "uuid";
import "./db";
import Person from "./models/Person";

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
    personCount: () => Person.collection.countDocuments(),

    allPersons: async (root, args) => {
      // falta el filtro del celular
      return Person.find({});
    },

    findPerson: (root, args) => {
      const { name } = args;
      return Person.findOne({ name });
    },
  },
  // laura marcela valencia
  Mutation: {
    addPerson: (root, args) => {
       
      const person = new Person
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
});|
