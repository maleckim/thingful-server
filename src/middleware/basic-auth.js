const AuthService = require('../auth/auth-service')
const bcrypt = require('bcryptjs')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let basicToken
  if (!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic token' })
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }

  const [tokenUserName, tokenPassword] = AuthService.parseBasicToken(basicToken)

  if (!tokenUserName || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  // AuthService.getUserPass(req.app.get('db'), tokenUserName)
  //   .then( hash => {
  //     const { password } = hash
      
  //     if( !bcrypt.compareSync( tokenPassword, password ) ){
  //       return res.status(401).json({ error: 'Unauthorized request here' })
  //     }
      
  // })

  

  AuthService.getUserWithUserName(
    req.app.get('db'),
    tokenUserName
  )
    .then(user => {
      
      const {password} = user 

      if (!user || !bcrypt.compareSync( tokenPassword, password )) {
        return res.status(401).json({ error: 'Unauthorized request' })
      }

      req.user = user
      next()
    })
    .catch(next)
}

module.exports = {
  requireAuth,
}