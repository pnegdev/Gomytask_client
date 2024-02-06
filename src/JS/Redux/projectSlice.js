import { createSlice } from '@reduxjs/toolkit';

const initialState = { projects: [] };

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        validateTaskSuccess: (state, action) => {
            const updatedProjects = state.projects.map(project => {
                if (project._id === action.payload._id) {
                    return action.payload;
                }
                return project;
            });
            state.projects = updatedProjects;
        },
        deleteProjectSuccess: (state, action) => {
            console.log('Deleting project in reducer:', action.payload);

            state.projects = state.projects.filter(project => project._id !== action.payload._id);
        },
        resetState: (state) => {
            state.projects = initialState.projects;
        },
    },
});

export const { setProjects, validateTaskSuccess, deleteProjectSuccess, resetState } = projectSlice.actions;
export default projectSlice.reducer;
