import React from 'react';
import { InputGroup, FormControl, Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

const ControlBar = ({ onSearch, onFilterStatus, onFilterPriority, onSort, onCreateProject }) => {
    return (
        <div className="d-flex mb-3">
            <InputGroup className="w-25 me-2 shadow">
                <FormControl
                    className="is-invalid"
                    type="text"
                    placeholder="Recherche par titre"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </InputGroup>

            <ButtonGroup className="me-2 shadow">
                <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle variant="outline-danger" id="dropdown-basic">
                        Filtrer par statut
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onFilterStatus('Tous')}>Tous</Dropdown.Item>
                        <Dropdown.Item onClick={() => onFilterStatus('A faire')}>A faire</Dropdown.Item>
                        <Dropdown.Item onClick={() => onFilterStatus('En cours')}>En cours</Dropdown.Item>
                        <Dropdown.Item onClick={() => onFilterStatus('Terminé')}>Terminé</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle variant="outline-danger" id="dropdown-basic">
                        Filtrer par priorité
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onFilterPriority('Tous')}>Tous</Dropdown.Item>
                        <Dropdown.Item onClick={() => onFilterPriority('Faible')}>Faible</Dropdown.Item>
                        <Dropdown.Item onClick={() => onFilterPriority('Moyenne')}>Moyenne</Dropdown.Item>
                        <Dropdown.Item onClick={() => onFilterPriority('Haute')}>Haute</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ButtonGroup>

            <ButtonGroup className="shadow">
                <DropdownButton
                    as={ButtonGroup}
                    title="Trier par titre"
                    variant="outline-danger"
                    id="dropdown-title"
                >
                    <Dropdown.Item onClick={() => onSort('title', 'asc')}>Croissant (A-Z)</Dropdown.Item>
                    <Dropdown.Item onClick={() => onSort('title', 'desc')}>Décroissant (Z-A)</Dropdown.Item>
                </DropdownButton>
                <DropdownButton
                    as={ButtonGroup}
                    title="Trier par date"
                    variant="outline-danger"
                    id="dropdown-deadline"
                >
                    <Dropdown.Item onClick={() => onSort('deadline', 'asc')}>Plus proche</Dropdown.Item>
                    <Dropdown.Item onClick={() => onSort('deadline', 'desc')}>Plus éloignée</Dropdown.Item>
                </DropdownButton>
            </ButtonGroup>

            <Button variant="danger ms-2" onClick={onCreateProject}>
                + Nouveau Projet
            </Button>
        </div>
    );
};

export default ControlBar;
