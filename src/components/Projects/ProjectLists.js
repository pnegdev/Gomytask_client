import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setProjects, deleteProjectSuccess } from '../../JS/Redux/projectSlice';
import ProjectCard from "./ProjectCard";
import ControlBar from './ControlBar';

const ProjectLists = () => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.project.projects);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [priorityFilter, setPriorityFilter] = useState('Tous');
    const [sort, setSort] = useState({ field: '', order: '' });
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        deadline: new Date(),
    });

    const filteredProjects = projects
        .filter((project) => {
            const titleMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'Tous' || project.status === statusFilter;
            const priorityMatch = priorityFilter === 'Tous' || project.priority === priorityFilter;
            return titleMatch && statusMatch && priorityMatch;
        })
        .sort((a, b) => {
            if (!sort.field) return 0;

            const aValue = a[sort.field];
            const bValue = b[sort.field];

            if (sort.order === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const handleFilterStatus = (status) => {
        setStatusFilter(status);
    };

    const handleFilterPriority = (priority) => {
        setPriorityFilter(priority);
    };

    const handleSort = (field, order) => {
        setSort({ field, order });
    };

    const handleCreateProject = () => {
        newProject.tasks = newProject.tasks || ['Cahier des charges', 'Nom de domaine', 'Hébergement', 'Arborescence du site', 'Maquette UI', 'Back-end', 'Front-end', 'Test', 'Mise en ligne', 'Optimisation SEO'];
        axios.post('https://gmt-9b50b8a26041.herokuapp.com/projects', newProject, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => {
            dispatch(setProjects([...projects, response.data]));
            setNewProject({
                title: '',
                description: '',
                deadline: new Date(),                
            });
            setShowModal(false);
        })
        .catch(error => console.error('Erreur lors de la création du projet:', error));
    };

    const handleModalClose = () => {
        setNewProject({
            title: '',
            description: '',
            deadline: new Date(),
        });
        setShowModal(false);
    };

    const handleEditProject = async (projectId, updatedFields) => {
        try {
            const response = await axios.put(`https://gmt-9b50b8a26041.herokuapp.com/projects/${projectId}`, updatedFields, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            dispatch(setProjects(projects.map(project => (project._id === projectId ? response.data : project))));
            toast.success('Projet modifié avec succès');

        } catch (error) {
            console.error('Erreur lors de la modification du projet :', error);
        }
    };
    
    const handleDelete = async (projectId) => {
        try {
            // Appel à l'API pour supprimer le projet avec Axios
            const response = await axios.delete(`https://gmt-9b50b8a26041.herokuapp.com/projects/${projectId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            dispatch(deleteProjectSuccess(response.data));
            dispatch(setProjects(projects.filter(project => project._id !== projectId)));
            toast.error('Projet supprimé avec succès');

        } catch (error) {
            console.error('Erreur lors de la suppression du projet :', error);
        }
    };
    
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

    return (
        <div className='ms-2'>
            <h1>Liste des projets</h1>
            <ControlBar
                onSearch={handleSearch}
                onFilterStatus={handleFilterStatus}
                onFilterPriority={handleFilterPriority}
                onSort={handleSort}
                onCreateProject={() => setShowModal(true)}
            />
            <div className="card-container">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project._id}
                        project={project}
                        onDelete={handleDelete}
                        onEdit={handleEditProject}
                    />
                ))}
            </div>

            {/* Fenêtre modale pour la création de projet */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un nouveau projet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Formulaire de création de projet */}
                    <Form>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Titre du projet</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez le titre du projet"
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description du projet</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Entrez la description du projet"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDeadline">
                            <Form.Label>Date limite</Form.Label>
                            <Form.Control
                                type="date"
                                value={newProject.deadline.toISOString().split('T')[0]}
                                onChange={(e) => setNewProject({ ...newProject, deadline: new Date(e.target.value) })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPriority">
                            <Form.Label>Priorité</Form.Label>
                            <Form.Select
                                value={newProject.priority}
                                onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                            >
                                <option value="Faible">Faible</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="Haute">Haute</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleCreateProject}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProjectLists;
