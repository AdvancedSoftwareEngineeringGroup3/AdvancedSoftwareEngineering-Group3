module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(expo-location|expo-modules-core)/)', // Add expo-location & expo-modules-core here
  ],
};
