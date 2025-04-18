const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Ruta a tu archivo next.config.js
  dir: './',
});

// Configuración personalizada de Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
