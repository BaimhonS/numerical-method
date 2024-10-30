module.exports = {
  transform: {
      '^.+\\.jsx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom', // Make sure this is set for testing React components
};
