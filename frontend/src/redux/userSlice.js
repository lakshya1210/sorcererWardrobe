import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signIn: (state, action) => {
            state.currentUser = action.payload;
        },
        updateUser: (state, action) => {
            state.currentUser = action.payload
        },
        deleteUser: (state, action) => {
            state.currentUser = null
        },
        signOut: (state, action) => {
            state.currentUser = null
        }
    }
})

export const {signIn, updateUser, deleteUser, signOut} = userSlice.actions

export default userSlice.reducer