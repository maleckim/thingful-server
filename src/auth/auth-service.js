const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('thingful_users')
      .where({ user_name })
      .first()
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':')
  },
  getUserPass(db, user_name) {
    return db('thingful_users')
    .select('password')
    .where({user_name})
    .first()
  }
}

module.exports = AuthService