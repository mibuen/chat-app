const expect = require('expect');
const { Users } = require('../utils/users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'SB'
      },
      {
        id: '2',
        name: 'Manuel',
        room: 'Stiva'
      },
      {
        id: '3',
        name: 'Jack',
        room: 'Stiva'
      }
    ];
  });

  it('should return names for room SB', () => {
    const userList = users.getUserList('SB');
    expect(userList).toEqual(['Mike']);
  });
  it('should return names for room Stiva', () => {
    const userList = users.getUserList('Stiva');
    expect(userList).toEqual(['Manuel', 'Jack']);
  });
  it('should find user', () => {
    const userId = '2';
    const user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });
  it('should Not find user', () => {
    const userId = '99';
    const user = users.getUser(userId);
    expect(user).toBeUndefined();
  });
  it('should remove user', () => {
    const userId = '1';
    const user = users.removeUser(userId);
    expect(users.users.length).toBe(2);
  });
  it('should Not remove user', () => {
    const userId = '77';
    const user = users.removeUser(userId);
    expect(users.users.length).toBe(3);
  });
  it('should add new user', () => {
    users = new Users();
    const user = {
      id: '123',
      name: 'chiquito',
      room: '@SB'
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });
});
