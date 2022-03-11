const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  bail: true,
  clearMocks: true,
  preset: '@shelf/jest-mongodb',
  transform: tsjPreset.transform,
  testMatch: ['**/*.spec.ts']
}
