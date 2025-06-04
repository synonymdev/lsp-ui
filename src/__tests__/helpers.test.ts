import { clipCenter, numberWithSpaces, orderExpiryFormat } from '../utils/helpers';

describe('clipCenter', () => {
  it('returns empty string for empty input', () => {
    expect(clipCenter('', 10)).toBe('');
  });

  it('returns full string if shorter than max', () => {
    expect(clipCenter('hello', 10)).toBe('hello');
  });

  it('clips long string in the middle', () => {
    expect(clipCenter('abcdefghij1234567890', 10)).toBe('abcde...67890');
  });
});

describe('numberWithSpaces', () => {
  it('formats small numbers', () => {
    expect(numberWithSpaces(1000)).toBe('1 000');
    expect(numberWithSpaces(1234567)).toBe('1 234 567');
  });
});

