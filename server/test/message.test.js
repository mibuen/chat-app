/* eslint-disable no-undef */
// test for message
const expect = require('expect');
const { generateMessage } = require('../utils/message');

describe('generateMessage', () => {
  it('should generate correct  message  object', () => {
    const from = 'Jen';
    const text = 'Some Message';
    const message = generateMessage(from, text);
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({ from, text });
  });
});
