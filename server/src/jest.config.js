module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(chai|chai-http)/)',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'mjs'
  ]
};