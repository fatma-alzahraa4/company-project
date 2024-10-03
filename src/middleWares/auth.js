import { accountModel } from '../../DB/models/accountModel.js';
import { verifyToken } from '../utils/tokenFunction.js'


export const isAuth= (Roles) => {
  return async (req, res, next) => {
    try {      
      const { authorization } = req.headers
      if (!authorization) {
        return next(new Error('Please login first', { cause: 401 }))
      }

      if (!authorization.startsWith(process.env.TOKEN_PREFIX)) {
        return next(new Error('invalid token prefix', { cause: 401 }))
      }
      
      const splitedToken = authorization.split(' ')[1]
      const decodedData = verifyToken({
        token: splitedToken,
        signature: process.env.ADMIN_TOKEN_SIGNATURE,
      })
      const findAccount = await accountModel.findById(
        decodedData._id,
        'email role',
      )
      if (!findAccount) {
        return next(new Error('Please SignUp', { cause: 401 }))
      }
      if (findAccount.changePasswordTime && parseInt(findAccount.changePasswordTime?.getTime() / 1000) > decodedData.iat) {
        return next(new Error('Please LogIn first', { cause: 401 }))
      }
      if(!Roles.includes(findAccount.role)){
        return next(new Error('UnAuthorized to access this api', { cause: 401 }))
      }      
      req.authAccount = findAccount
        next()
      
    }
    catch (error) {
      console.log(error.message)
      if (error.message == 'jwt expired') {
        return next(new Error('Please login first', { cause: 401 }))
      }
      next(new Error('catch error in auth', { cause: 500 }))
    }
  }
}
