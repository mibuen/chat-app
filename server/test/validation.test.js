const expect = require('expect');
const { isRealString } = require('../utils/validations');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const res = isRealString(98);
    expect(res).toBe(false);
  });
  it('should reject string with only spaces', () => {
    const res = isRealString(' ');
    expect(res).toBe(false);
  });
  it('should allow strings with non-space characters', () => {
    const res = isRealString('D');
  });
});
