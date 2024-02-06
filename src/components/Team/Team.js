import React, { useEffect, useState } from 'react';
import { Card, ProgressBar, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Team = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://gmt-9b50b8a26041.herokuapp.com/user/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
            }
        };
        fetchUsers();
    }, [token]);

    const getDefaultProfilePhoto = () => {
        return 'Defaut.png';
    };

    const calculateProjectStats = (projects) => {
        const stats = {
            total: projects.length,
            todo: projects.filter((project) => project.status === 'A faire').length,
            inProgress: projects.filter((project) => project.status === 'En cours').length,
            completed: projects.filter((project) => project.status === 'Terminé').length,
            totalTasks: projects.reduce((acc, project) => acc + project.tasks.length, 0),
            completedTasks: projects.reduce((acc, project) => {
                const completed = Object.values(project.tasksValidation).filter(Boolean).length;
                return acc + completed;
            }, 0),
        };

        return stats;
    };

    return (
        <div>
            <h1>Team</h1>
            <Row xs={1} sm={2} md={3} lg={4} xl={5}>
                {users.map((user) => (
                <Col key={user._id} style={{ marginBottom: '0.8rem', width: '17.5rem' }}>
                    <Card className='shadow' style={{ width: '100%', height: '24rem', marginBottom: '1rem' }}>
                        <Card.Body>
                            <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
                                <Card.Img
                                    variant="top"
                                    src={`https://gmt-9b50b8a26041.herokuapp.com/uploads/${user.photoDeProfil}` || getDefaultProfilePhoto()}
                                    onError={(e) => { e.target.src = getDefaultProfilePhoto(); }}
                                    style={{
                                    height: '220px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    border: '2px solid #ccc',
                                    }}
                                />
                            </div>
                            <Card.Title>{`${user.prenom} ${user.nom}`}</Card.Title>
                            <Card.Text>Projets: {user.projects.length} <span>-</span> Tâches: {calculateProjectStats(user.projects).completedTasks}/{calculateProjectStats(user.projects).totalTasks}</Card.Text>
                            <ProgressBar style={{ fontSize: '0.6rem' }}>
                            <ProgressBar
                                animated
                                variant="primary"
                                now={(user.projects.length > 0 ? (user.projects.filter((project) => project.status === 'A faire').length / user.projects.length) * 100 : 0)}
                                key={1}
                                label={`A faire: ${user.projects.filter((project) => project.status === 'A faire').length}`}
                            />
                            <ProgressBar
                                animated
                                variant="warning"
                                now={(user.projects.length > 0 ? (user.projects.filter((project) => project.status === 'En cours').length / user.projects.length) * 100 : 0)}
                                key={2}
                                label={`En cours: ${user.projects.filter((project) => project.status === 'En cours').length}`}
                            />
                            <ProgressBar
                                animated
                                variant="success"
                                now={(user.projects.length > 0 ? (user.projects.filter((project) => project.status === 'Terminé').length / user.projects.length) * 100 : 0)}
                                key={3}
                                label={`Terminé: ${user.projects.filter((project) => project.status === 'Terminé').length}`}
                            />
                            </ProgressBar>
                        </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>
        </div>
    );
};

export default Team;