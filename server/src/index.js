const { ApolloServer, gql } = require('apollo-server');

// In-memory database
let todos = [];

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    todos: [Todo]!
    todo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!): Todo
    updateTodo(id: ID!, title: String, completed: Boolean): Todo
    deleteTodo(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
    todo: (_, { id }) => todos.find(todo => todo.id === id),
  },
  Mutation: {
    createTodo: (_, { title }) => {
      const todo = {
        id: String(todos.length + 1),
        title,
        completed: false,
      };
      todos.push(todo);
      return todo;
    },
    updateTodo: (_, { id, title, completed }) => {
      const index = todos.findIndex(todo => todo.id === id);
      if (index === -1) return null;

      todos[index] = {
        ...todos[index],
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      };
      return todos[index];
    },
    deleteTodo: (_, { id }) => {
      const index = todos.findIndex(todo => todo.id === id);
      if (index === -1) return false;
      
      todos = todos.filter(todo => todo.id !== id);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});