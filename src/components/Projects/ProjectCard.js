import React, { useState } from 'react';
import { Card, Badge, Button, Form, Modal, Row, Col, ProgressBar } from 'react-bootstrap';
import { getStatusColor, getPriorityColor, calculateProgress, formatDateFr } from '../../JS/Utils/Utils';

const ProjectCard = ({ project, onEdit, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    
    const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    };
    
    const [updatedProject, setUpdatedProject] = useState({
        title: project.title,
        description: project.description,
        deadline: formatDate(project.deadline),
        priority: project.priority,
        creationDate: project.creationDate,
    });

    const handleOpenModal = () => {
        setUpdatedProject({ ...project });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProject({ ...updatedProject, [name]: value });
    };
    
    const handleUpdateProject = () => {
        const projectId = project._id;
        onEdit(projectId, updatedProject);
        handleCloseModal();
    };

    const handleDeleteProject = () => {
        const projectId = project._id;
        onDelete(projectId);
        handleCloseModal();
    };
    
    return (
        <>
            <Card className="mb-4 me-3 w-100 shadow" style={{ maxWidth: '16rem' }} onClick={handleOpenModal}>
                <Card.Body className="align-items-center">
                    <Card.Title className='text-danger fw-bold'>{project.title}</Card.Title>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge pill bg={getStatusColor(project.status)} style={{ fontSize: '0.6rem' }}>
                            {project.status}
                        </Badge>
                        <Badge pill bg={getPriorityColor(project.priority)} style={{ fontSize: '0.6rem' }}>
                            {project.priority}
                        </Badge>
                    </div>
                    <ProgressBar
                        striped 
                        variant="danger"
                        animated
                        now={calculateProgress(project)}
                        label={`${calculateProgress(project)}%`}
                    />
                    <Card.Subtitle className="m-2 fst-italic txt-grey">Date limite : {formatDateFr(project.deadline)}</Card.Subtitle>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{project.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form>
                                <Form.Group className="mb-3" controlId="formTitle">
                                    <Form.Label>Titre du projet</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={updatedProject.title}
                                        onChange={handleChange}
                                        name="title"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formDescription">
                                    <Form.Label>Description du projet</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={updatedProject.description}
                                        onChange={handleChange}
                                        name="description"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formCreation">
                                    <Form.Label>Date de création</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formatDate(updatedProject.creationDate)}
                                        onChange={handleChange}
                                        name="creationDate"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formDeadline">
                                    <Form.Label>Date limite</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formatDate(updatedProject.deadline)}
                                        onChange={handleChange}
                                        name="deadline"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPriority">
                                    <Form.Label>Priorité</Form.Label>
                                    <Form.Select
                                        value={updatedProject.priority}
                                        onChange={handleChange}
                                        name="priority"
                                    >
                                        <option value="Faible">Faible</option>
                                        <option value="Moyenne">Moyenne</option>
                                        <option value="Haute">Haute</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Statut</Form.Label>
                                    <Badge pill bg={getStatusColor(project.status)} style={{ fontSize: '0.6rem', marginLeft: '10px' }}>
                                        {updatedProject.status}
                                    </Badge>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col md={6}>
                            <p className='f500'>Liste des tâches</p>
                            <table className="table">
                                <tbody>
                                    {project.tasks.map((task, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    className='form-check-input rounded-circle'
                                                    type="checkbox"
                                                    defaultChecked={project.tasksValidation && project.tasksValidation[task]}
                                                    style={{ border: project.tasksValidation && project.tasksValidation[task] ? '2px solid #fe5c5c' : '2px solid gray', cursor: 'pointer',
                                                    backgroundColor: project.tasksValidation && project.tasksValidation[task] ? '#fe5c5c' : 'inherit',
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                {task}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleUpdateProject}>
                        Modifier
                    </Button>
                    <Button variant="danger" onClick={handleDeleteProject}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProjectCard;
