import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import { calculateProgress, getPriorityColor, getStatusColor } from '../../JS/Utils/Utils';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashProjects = () => {
    const [projects, setProjects] = useState([]);
    const [showAllProjects, setShowAllProjects] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://gmt-9b50b8a26041.herokuapp.com/projects', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProjects(response.data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des projets :', error);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(
        (project) => project.status === 'A faire' || project.status === 'En cours'
    );

    const displayedProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 5);

    return (
        <div className='mt-5'>
            <h4>Projets en cours</h4>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
                {displayedProjects.map((project) => (
                    <div className="col" key={project._id}>
                        <Card>
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Card.Title className='text-danger fw-bold'>{project.title}</Card.Title>
                                <div className="d-flex justify-content-between align-items-center mb-2 w-100">
                                    <div>
                                        <div>
                                            <Badge pill bg={getStatusColor(project.status)} style={{ fontSize: '0.6rem' }}>
                                                {project.status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Badge pill bg={getPriorityColor(project.priority)} style={{ fontSize: '0.6rem' }}>
                                                {project.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CircularProgressbar
                                        value={calculateProgress(project)}
                                        text={`${calculateProgress(project)}%`}
                                        styles={circularProgressStyles}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}

                {!showAllProjects && (
                    <div className="col">
                        <Card style={{ height: '100%' }}>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setShowAllProjects(true)}
                                style={{ height: '100%' }}
                            >
                                Voir tous les projets
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

const circularProgressStyles = {
    root: { width: '40%' },
    path: { stroke: '#fe5c5c',
        transition: 'stroke-dashoffset 1s ease-in-out',
    },
    text: { fill: '#fe5c5c', fontSize: '25px' },
};

export default DashProjects;
