const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  bail: true,
  clearMocks: true,
  preset: '@shelf/jest-mongodb',
  transform: tsjPreset.transform,
  roots: ['src'],
  watchPathIgnorePatterns: [
    '<rootDir>/*.json/',
    '<rootDir>/*.js/',
    '<rootDir>/dist/',
    '<rootDir>/node_modules/'
  ]
}
