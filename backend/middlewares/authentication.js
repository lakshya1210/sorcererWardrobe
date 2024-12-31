import jwt from 'jsonwebtoken'
import { UnauthenticatedError } from '../errors/index.js'

const auth = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        throw new UnauthenticatedError('Please log in to continue!')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId, isAdmin: payload.isAdmin }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Please log in to continue!')
    }
}

export default auth