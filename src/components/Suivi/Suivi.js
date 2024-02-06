import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Badge } from 'react-bootstrap';

const Suivi = () => {
    const projects = useSelector((state) => state.project.projects);

    // Filtrer les projets par statut
    const projectsTodo = projects.filter((project) => project.status === 'A faire');
    const projectsInProgress = projects.filter((project) => project.status === 'En cours');
    const projectsDone = projects.filter((project) => project.status === 'Terminé');

    const columnTitleStyle = {
        textAlign: 'center',
        paddingBottom: '10px',
        background: '#f8f9fa',
    };

    const cardHeaderStyleTodo = {
        borderWidth: '1px 1px 2px 1px',
        borderStyle: 'solid',
        borderColor: '#007bff',
    };

    const cardHeaderStyleInProgress = {
        borderWidth: '1px 1px 2px 1px',
        borderStyle: 'solid',
        borderColor: '#ffc107',
    };

    const cardHeaderStyleDone = {
        borderWidth: '1px 1px 2px 1px',
        borderStyle: 'solid',
        borderColor: '#28a745',
    };

    return (
        <div className="ms-2">
            <h1>Suivi</h1>
            <Row>
                <Col>
                    <Card style={{ ...cardHeaderStyleTodo }}>
                        <Card.Header as="h5" style={{ ...columnTitleStyle, ...cardHeaderStyleTodo }}>
                            A faire <Badge className="ms-2" bg="primary">{projectsTodo.length}</Badge>
                        </Card.Header>
                        <Card.Body>
                            {projectsTodo.map((project) => (
                                <Card.Text key={project._id}>{project.title}</Card.Text>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ ...cardHeaderStyleInProgress }}>
                        <Card.Header as="h5" style={{ ...columnTitleStyle, ...cardHeaderStyleInProgress }}>
                            En cours <Badge className="ms-2" bg="warning">{projectsInProgress.length}</Badge>
                        </Card.Header>
                        <Card.Body>
                            {projectsInProgress.map((project) => (
                                <Card.Text key={project._id}>{project.title}</Card.Text>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{ ...cardHeaderStyleDone }}>
                        <Card.Header as="h5" style={{ ...columnTitleStyle, ...cardHeaderStyleDone }}>
                            Terminé <Badge className="ms-2" bg="success">{projectsDone.length}</Badge>
                        </Card.Header>
                        <Card.Body>
                            {projectsDone.map((project) => (
                                <Card.Text key={project._id}>{project.title}</Card.Text>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Suivi;
