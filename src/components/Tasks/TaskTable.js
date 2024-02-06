import React, { useState, useEffect } from 'react';
import { Card, Badge, Form, Button, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { validateTaskSuccess, setProjects } from '../../JS/Redux/projectSlice';
import { getStatusColor, getPriorityColor, formatDateFr } from '../../JS/Utils/Utils';
import axios from 'axios';

const TaskTable = () => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.project.projects);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [priorityFilter, setPriorityFilter] = useState('Tous');

    useEffect(() => {
        // Chargement des projets au démarrage de l'application
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://gmt-9b50b8a26041.herokuapp.com/projects', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                dispatch(setProjects(response.data || []));
            } catch (error) {
                console.error('Erreur lors de la récupération des données des projets :', error);
            }
        };
    
        fetchProjects();
    }, [dispatch]);

    const handleTaskValidation = (projectId, task) => {
        // Appel à l'API pour valider la tâche avec Axios
        axios.post(`https://gmt-9b50b8a26041.herokuapp.com/projects/validateTask/${projectId}`, { task }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => {
            // Mettre à jour l'état Redux avec le projet mis à jour
            dispatch(validateTaskSuccess(response.data));
        })
        .catch(error => console.error('Erreur lors de la validation de la tâche:', error));
    };

    // Filtrer les projets en fonction des critères de recherche et de filtre
    const filteredProjects = projects.filter((project) => {
        const titleMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'Tous' || project.status === statusFilter;
        const priorityMatch = priorityFilter === 'Tous' || project.priority === priorityFilter;
        return titleMatch && statusMatch && priorityMatch;
    });

    return (
        <div className='ms-2'>
            <h1>Liste des tâches</h1>

            {/* Barre de recherche et filtres */}
            <div className="d-flex flex-wrap mb-3">
                {/* Barre de recherche */}
                <Form.Control
                    type="text"
                    className='shadow'
                    placeholder="Rechercher par projet"
                    value={searchTerm}
                    style={{ maxWidth: '22rem' }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Filtres par statut */}
                <ButtonGroup className="mx-4 shadow">
                    <Button
                        variant={statusFilter === 'Tous' ? 'light' : 'outline-light'}
                        onClick={() => setStatusFilter('Tous')}
                    >
                        Statut
                    </Button>
                    <Button
                        variant={statusFilter === 'A faire' ? 'primary' : 'outline-primary'}
                        onClick={() => setStatusFilter('A faire')}
                    >
                        A faire
                    </Button>
                    <Button
                        variant={statusFilter === 'En cours' ? 'warning' : 'outline-warning'}
                        onClick={() => setStatusFilter('En cours')}
                    >
                        En cours
                    </Button>
                    <Button
                        variant={statusFilter === 'Terminé' ? 'success' : 'outline-success'}
                        onClick={() => setStatusFilter('Terminé')}
                    >
                        Terminé
                    </Button>
                </ButtonGroup>

                {/* Filtres par priorité */}
                <ButtonGroup className='shadow'>
                    <Button
                        variant={priorityFilter === 'Tous' ? 'light' : 'outline-light'}
                        onClick={() => setPriorityFilter('Tous')}
                    >
                        Priorité
                    </Button>
                    <Button
                        variant={priorityFilter === 'Faible' ? 'info' : 'outline-info'}
                        onClick={() => setPriorityFilter('Faible')}
                    >
                        Faible
                    </Button>
                    <Button
                        variant={priorityFilter === 'Moyenne' ? 'secondary' : 'outline-secondary'}
                        onClick={() => setPriorityFilter('Moyenne')}
                    >
                        Moyenne
                    </Button>
                    <Button
                        variant={priorityFilter === 'Haute' ? 'danger' : 'outline-danger'}
                        onClick={() => setPriorityFilter('Haute')}
                    >
                        Haute
                    </Button>
                </ButtonGroup>
            </div>

            {/* Cartes filtrées */}
            <div className="card-container">
                {filteredProjects.map((project) => (
                <Card key={project._id} className="mb-4 me-3 w-100 shadow" style={{ maxWidth: '16rem' }}>
                    <Card.Body className="align-items-center">
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title style={{ color: '#fe5c5c', fontWeight: 'bold'}}>{project.title}</Card.Title>
                        <div className="d-flex flex-column">
                            <Badge pill bg={getPriorityColor(project.priority)} style={{ fontSize: '0.6rem', marginBottom: '3px', cursor: 'pointer' }}
                            data-toggle="tooltip" data-placement="top" title="Priorité"
                            >
                                {project.priority}
                            </Badge>
                            <Badge pill bg={getStatusColor(project.status)} style={{ fontSize: '0.6rem', cursor: 'pointer' }}
                            data-toggle="tooltip" data-placement="top" title="Statut"
                            >
                                {project.status}
                            </Badge>
                        </div>
                    </div>
                    <table className="table">
                        <tbody>
                        {project.tasks.map((task, index) => (
                            <tr key={index}>
                            <td>
                                <input
                                className='form-check-input rounded-circle'
                                type="checkbox"
                                checked={project.tasksValidation && project.tasksValidation[task]}
                                onChange={() => handleTaskValidation(project._id, task)}
                                style={{ border: project.tasksValidation && project.tasksValidation[task] ? '2px solid #fe5c5c' : '2px solid gray', cursor: 'pointer',
                                backgroundColor: project.tasksValidation && project.tasksValidation[task] ? '#fe5c5c' : 'inherit',
                                }}
                                />
                            </td>
                            <td
                                style={{
                                textDecoration: project.tasksValidation && project.tasksValidation[task] ? 'line-through' : 'none',
                                color: project.tasksValidation && project.tasksValidation[task] ? 'gray' : 'inherit',
                                }}
                            >
                                {task}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Card.Subtitle className="m-2 fst-italic fw-light txt-grey">Date limite : {formatDateFr(project.deadline)}</Card.Subtitle>
                    </Card.Body>
                </Card>
                ))}
            </div>
        </div>
    );
};

export default TaskTable;