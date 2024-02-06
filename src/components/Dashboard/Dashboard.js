import React from 'react';
import DashStats from './DashStats';
import DashProjects from './DashProjects';
import DashTasks from './DashTasks';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <DashStats />
            <DashProjects />
            <DashTasks />
        </div>
    );
};

export default Dashboard;
