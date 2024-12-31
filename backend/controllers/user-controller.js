import User from '../models/user-model.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/index.js'
import bcryptjs from 'bcryptjs'


export const signout = (req, res) => {
    res.clearCookie('access_token').status(StatusCodes.OK).json('Signed out successfully')
}

export const getAllUsers = async (req, res) => {
    if (!req.user.isAdmin) {
        throw new UnauthenticatedError('You are not authorized to see all users')
    }
    const start = parseInt(req.query.start || 0)
    const limit = parseInt(req.query.limit || 9)
    const sort = req.query.sort === 'asc' ? 1 : -1

    const users = await User.find().sort({ createdAt: sort }).skip(start).limit(limit)
    const userRes = users.map((user) => {
        const { password, ...rest } = user._doc
        return rest
    })
    const totalUsers = await User.countDocuments()
    res.status(StatusCodes.OK).json({userRes, totalUsers})
}

export const getUser = async (req, res) => {
    if (!req.params.userId) {
        throw new BadRequestError('Please provide user Id')
    }
    const user = await User.findById(req.params.userId)
    if (!user) {
        throw new NotFoundError('User does not exist')
    }
    const { password, ...rest } = user._doc
    res.status(StatusCodes.OK).json(rest)
}

export const updateUser = async (req, res) => {
    if (req.user.userId !== req.params.userId) {
        throw new UnauthenticatedError('You are not allowed to update this profile')
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            throw new BadRequestError("Password length must be atleast 6 characters")
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        const username = req.body.username;
        if (username.length < 6 || username.length > 20) {
            throw new BadRequestError('Username length must be between 6-20 characters')
        }
        const usernameRegex = /^[a-z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            throw new BadRequestError('Username can only contain a-z, 0-9 and underscore');
        }
        if (!/^[a-z]/.test(username)) {
            throw new BadRequestError('Username must start with a character');
        }
        req.body.username = username;
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        address: req.body.address
    }, { new: true, runValidators: true })

    const { password, ...rest } = updatedUser._doc
    res.status(StatusCodes.OK).json(rest)
}

export const deleteUser = async (req, res) => {
    if (!req.user.isAdmin && req.user.userId !== req.params.userId) {
        throw new UnauthenticatedError('You are not allowed to delete this account')
    }
    const user = await User.findByIdAndDelete(req.params.userId)
    if (!user) {
        throw new NotFoundError('No such user found')
    }
    res.status(StatusCodes.OK).json('Account deleted successfully')
}