import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../JS/Redux/userSlice';
import { resetState } from '../../JS/Redux/projectSlice';
import { useDispatch } from 'react-redux';
import './Sidebar.css';

const Sidebar = () => {
    const [isSidebarClosed, setSidebarClosed] = useState(false);
    const [isDarkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    const toggleSidebar = () => {
        setSidebarClosed(!isSidebarClosed);
    };

    const toggleDarkMode = useCallback(() => {
        setDarkMode((prevDarkMode) => {
            const newDarkMode = !prevDarkMode;
            localStorage.setItem('darkMode', newDarkMode);

            return newDarkMode;
        });
    }, []);

    useEffect(() => {
        const body = document.querySelector('body');
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.toggle');
        const modeSwitch = document.querySelector('.toggle-switch');
        body.classList.toggle('dark', isDarkMode);

        return () => {
            toggle.removeEventListener('click', () => {
                sidebar.classList.toggle('close');
            });

            modeSwitch.removeEventListener('click', () => {
                body.classList.toggle('dark');
                toggleDarkMode();
            });
        };
    }, [isDarkMode, toggleDarkMode]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(resetState());
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className={`sidebar ${isSidebarClosed ? 'close' : ''} ${isDarkMode ? 'dark' : ''}`}>
            <header>
                <div className="image-text">
                    <span className="image">
                        <img src="logo.png" alt=""/>
                    </span>
                    <div className="text logo-text">
                        <span className="name">GoMyTask</span>
                    </div>
                </div>
                <i className='bx bx-chevron-right toggle' onClick={toggleSidebar}></i>
            </header>
            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        <li className="nav-link">
                            <Link to="/home">
                                <i className='bx bxs-dashboard icon'></i>
                                <span className="text nav-text">Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to="/projects">
                                <i className='bx bx-spreadsheet icon'></i>
                                <span className="text nav-text">Mes Projets</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to="/tasks">
                                <i className='bx bx-task icon'></i>
                                <span className="text nav-text">Mes Tâches</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to="/suivi">
                                <i className='bx bx-pie-chart-alt icon'></i>
                                <span className="text nav-text">Suivi</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to="/team">
                                <i className='bx bx-id-card icon'></i>
                                <span className="text nav-text">Team</span>
                            </Link>
                        </li>
                        <li className="nav-link">
                            <Link to="/reglages">
                                <i className='bx bx-cog icon'></i>
                                <span className="text nav-text">Réglages</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="bottom-content">
                    <li className="">
                        <Link to="/login" onClick={handleLogout}>
                            <i className='bx bx-log-out icon'></i>
                            <span className="text nav-text">Déconnexion</span>
                        </Link>
                    </li>
                <li className="mode">
                    <div className="sun-moon" onClick={toggleDarkMode}>
                        <i className={isDarkMode ? 'bx bx-sun icon' : 'bx bx-moon icon'}></i>
                    </div>
                    <span className="mode-text text">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                    <div className="toggle-switch" onClick={toggleDarkMode}>
                        <span className={`switch ${isDarkMode ? 'night' : 'day'}`}></span>
                    </div>
                </li>

                </div>
            </div>
        </nav>
    );
};

export default Sidebar;