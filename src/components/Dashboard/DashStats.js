import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { CircularProgressbar, } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const DashStats = () => {
    const [userData, setUserData] = useState({});
    const [projectsData, setProjectsData] = useState([]);
    const [tasksData, setTasksData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://gmt-9b50b8a26041.herokuapp.com/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUserData(response.data.user || {});
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error);
            }
        };

        const fetchProjectsData = async () => {
            try {
                const response = await axios.get('https://gmt-9b50b8a26041.herokuapp.com/projects', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProjectsData(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des données des projets :', error);
            }
        };

        const fetchTasksData = async () => {
            try {
                const response = await axios.get('https://gmt-9b50b8a26041.herokuapp.com/projects/tasks', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTasksData(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des données des tâches :', error);
            }
        };

        fetchUserData();
        fetchProjectsData();
        fetchTasksData();
    }, []);

    const projectsInProgress = projectsData.filter(project => project.status === 'A faire' || project.status === 'En cours');
    const projectsFinished = projectsData.filter(project => project.status === 'Terminé');
    const totalProjects = projectsData.length;
    const tasksToDo = tasksData.filter(task => !task.completed);

    return (
        <div className='mt-5'>
            <Row xs={1} md={2} lg={3} className='g-4'>
                {/* Carte 1 : Welcome */}
                <Col>
                    <Card className="stat-card">
                        <Card.Body className="stat-card-body">
                            <Row>
                                <Col xs={4}>
                                    <Image src={userData.photoDeProfil ? `https://gmt-9b50b8a26041.herokuapp.com/uploads/${userData.photoDeProfil}` : "/Defaut.png"} roundedCircle fluid className="profile-image" />
                                </Col>
                                <Col xs={8} className='stat-card-text'>
                                    <Card.Title>Bonjour {userData.prenom},</Card.Title>
                                    <Card.Text>
                                        Vous avez {projectsInProgress.length} projets en cours
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Carte 2 : Projets terminés */}
                <Col>
                    <Card className="stat-card">
                        <Card.Body className="stat-card-body">
                            <Row>
                                <Col xs={8} className='stat-card-text'>
                                    <Card.Title>Projets terminés</Card.Title>
                                </Col>
                                <Col xs={4}>
                                    <CircularProgressbar
                                        value={(projectsFinished.length / totalProjects) * 100}
                                        text={`${projectsFinished.length}/${totalProjects}`}
                                        styles={circularProgressStyles}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Carte 3 : Tâches à faire */}
                <Col>
                    <Card className="stat-card">
                        <Card.Body className="stat-card-body">
                            <Row>
                                <Col xs={8} className='stat-card-text mt-3'>
                                    <Card.Title>Tâches à faire</Card.Title>
                                </Col>
                                <Col xs={4}>
                                    <Card.Text>
                                        <span style={{ fontSize: '42px', color: '#fe5c5c' }}>{tasksToDo.length}</span>
                                    </Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const circularProgressStyles = {
    root: { width: '80%' },
    path: {
        stroke: '#fe5c5c',
        transition: 'stroke-dashoffset 1s ease-in-out',
    },
    text: { fill: '#fe5c5c', fontSize: '24px' },
};

export default DashStats;
