import User from '../models/user-model.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'

export const signup = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        throw new BadRequestError('Please provide all fields')
    }
    const user = await User.create({ username, email, password })
    const { password: pass, ...rest } = user._doc
    res.status(StatusCodes.OK).json(rest)
}

export const signin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const { password: pass, ...rest } = user._doc
    const token = user.createJwt()
    res.status(StatusCodes.OK).cookie('access_token', token, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 }).json(rest)
}

export const google = async (req, res) => {
    const { name, email, googlePhotoUrl } = req.body

    if (!name || !email || !googlePhotoUrl) {
        throw new BadRequestError('Invalid credentials')
    }
    const user = await User.findOne({ email })
    if (user) {
        const { password: pass, ...rest } = user._doc
        const token = user.createJwt()
        res.status(StatusCodes.OK).cookie('access_token', token, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 }).json(rest)
    }
    else {
        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        const user = await User.create({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email,
            password,
            profilePicture: googlePhotoUrl
        })
        const { password: pass, ...rest } = user._doc
        const token = user.createJwt()
        res.status(StatusCodes.OK).cookie('access_token', token, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 }).json(rest)
    }
}