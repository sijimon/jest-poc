const fetch = require('node-fetch');

const query = `
  query {
    hello
  }
`;

async function getData(authToken) {
  const response = await fetch('http://localhost:3006/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  console.log(data);

  // Assert the response
  if (response.status !== 200 || data.errors) {
    throw new Error('GraphQL query failed');
  }
  expect(data.data.hello).toBe('Hello, world!');
}

async function login(username, password) {
  const response = await fetch('http://localhost:3006/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data = await response.json();

  // Assert the login response
  if (response.status !== 200) {
    throw new Error(data.error || 'Invalid credentials');
  }
  expect(data.accessToken).toBeDefined();

  return data;
}

describe('API tests', () => {
  test('Successful login and data retrieval', async () => {
    try {
      const loginData = await login('sijimon@abc.com', 'Test(1234)');
      await getData(loginData.accessToken);
      console.log(JSON.stringify(loginData.accessToken));
    } catch (error) {
      throw error;
    }
  });

  test('Invalid login credentials', async () => {
    try {
      await login('invalid@example.com', 'invalidpassword');
    } catch (error) {
      expect(error.message).toContain('Invalid credentials');
    }
  });

  test('Unauthorized access to GraphQL endpoint', async () => {
    try {
      await getData('invalidtoken');
    } catch (error) {
      expect(error.message).toContain('GraphQL query failed');
    }
  });
});
