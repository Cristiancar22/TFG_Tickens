import '@testing-library/jest-native/extend-expect';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const msg = args.join(' ');
    if (msg.includes('Warning:')) return;
    console.warn(...args);
  });
});