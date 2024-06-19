const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');

const app = express();

// JWT secret key
const secretKey = 'your-secret-key';

// Sample GraphQL schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Sample GraphQL resolver
const root = {
  hello: () => 'Hello, world!',
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// GraphQL endpoint
app.use(
  '/v1/graphql',
  authenticate,
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Login endpoint
app.post('/v1/login', express.json(), (req, res) => {
  const { username, password } = req.body;

  // Simulated user authentication
  if (username === 'sijimon@abc.com' && password === 'Test(1234)') {
    const token = jwt.sign({ userId: 'user123' }, secretKey);
    return res.json({ accessToken: token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Start the server
const port = 3006;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
