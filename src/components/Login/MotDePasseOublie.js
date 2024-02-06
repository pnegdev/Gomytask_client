import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MotDePasseOublie = ({ show, handleClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        try {
        setIsLoading(true);

        if (!username || !email || !newPassword) {
            toast.error('Veuillez remplir tous les champs.');
            return;
        }

        // Requête au backend pour réinitialiser le mot de passe
        await axios.post('https://gmt-9b50b8a26041.herokuapp.com/auth/reset-password', {
            username,
            email,
            newPassword,
        });

        toast.success('Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter avec le nouveau mot de passe.');
        handleClose();
        
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du mot de passe :', error.response?.data?.message);
            toast.error('Une erreur s\'est produite lors de la réinitialisation du mot de passe.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Réinitialisation du mot de passe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Nom d'utilisateur</Form.Label>
                        <Form.Control type="text" placeholder="Entrez votre nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mt-3' controlId="formEmail">
                        <Form.Label>Adresse e-mail</Form.Label>
                        <Form.Control type="email" placeholder="Entrez votre adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className='mt-3' controlId="formNewPassword">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Entrez votre nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                Annuler
                </Button>
                <Button variant="success" onClick={handleResetPassword} disabled={isLoading}>
                {isLoading ? 'En cours de réinitialiation...' : 'Réinitialiser le mot de passe'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MotDePasseOublie;
