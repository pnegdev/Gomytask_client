import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import TaskTable from './Tasks/TaskTable';
import ProjectLists from './Projects/ProjectLists';
import Suivi from './Suivi/Suivi';
import Team from './Team/Team';
import Settings from './Settings/Settings';

const AppRouter = () => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    // Si l'utilisateur est authentifié, redirection vers /home, sinon vers /login
    if (isAuthenticated) {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/home" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/projects" element={<Layout><ProjectLists /></Layout>} />
                    <Route path="/tasks" element={<Layout><TaskTable /></Layout>} />
                    <Route path="/suivi" element={<Layout><Suivi /></Layout>} />
                    <Route path="/team" element={<Layout><Team /></Layout>} />
                    <Route path="/reglages" element={<Layout><Settings /></Layout>} />
                    <Route path="/*" element={<Navigate to="/home" />} />
                    <Route path="/login" element={<Navigate to="/home" />} />
                </Routes>
            </Router>
        );
    } else {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        );
    }
};

export default AppRouter;