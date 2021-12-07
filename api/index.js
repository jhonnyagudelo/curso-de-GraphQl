import { ApolloServer, gql, UserInputError } from "apollo-server";
import "./db.js";
import Person from "./models/Person.js";
import User from "./models/user.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "tu_palabra_secreta";

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

  type User {
    username: String!
    friends: [Person]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
    me: User
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

    createUser(username: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),

    allPersons: async (root, args) => {
      if (!args.phone) return Person.find({});
      return Person.find({ phone: { $exists: args.phone === "YES " } });
    },

    findPerson: (root, args) => {
      const { name } = args;
      return Person.findOne({ name });
    },
  },
  // laura marcela valencia

  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args });
      try {
        await person.save();
      } catch (e) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return person;
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name });
      if (!person) return;
      person.phone = args.phone;
      try {
        await person.save();
      } catch (e) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return person;
    },

    createUser: (root, args) => {
      const user = new User({ username: args.username });
      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return {
        value: jwt.sign(userForToken, JWT_SECRET),
      };
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
