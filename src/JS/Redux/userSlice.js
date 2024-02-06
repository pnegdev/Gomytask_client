import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    token: null,
    username: null,
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { token, username, user } = action.payload;
            state.isAuthenticated = true;
            state.token = token;
            state.username = username;
            state.user = user;
            console.log('waza', user);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = null;
            state.user = null;
        },
        registerUserSuccess: (state, action) => {
            const { token, username, user } = action.payload;
            state.isAuthenticated = false;
            state.token = token;
            state.username = username;
            state.user = user;
        },
        updateUserProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        changePassword: (state) => {
        },
    },
});

export const { loginSuccess, logout, registerUserSuccess, updateUserProfile, changePassword } = userSlice.actions;
export default userSlice.reducer;
