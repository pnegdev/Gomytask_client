import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Form, Button, Image } from 'react-bootstrap';
import { updateUserProfile, changePassword } from '../../JS/Redux/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';


const Settings = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const [profileData, setProfileData] = useState({
        username: '',
        nom: '',
        prenom: '',
        email: '',
        photoDeProfil: null,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser) {
            setProfileData({
                username: storedUser.user.username,
                nom: storedUser.user.nom,
                prenom: storedUser.user.prenom,
                email: storedUser.user.email || '',
                photoDeProfil: storedUser.user.photoDeProfil,
            });
        }
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        try {
            const formData = new FormData();
            formData.append('photoDeProfil', file);

            const response = await axios.put('https://gmt-9b50b8a26041.herokuapp.com/user/profile/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(updateUserProfile(response.data.user));

            const updatedUser = { ...JSON.parse(localStorage.getItem('user')), user: response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setProfileData((prevData) => ({
                ...prevData,
                photoDeProfil: response.data.user.photoDeProfil,
            }));
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la photo de profil :', error);
            console.error('Détails de l\'erreur:', error.response?.data?.message);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('https://gmt-9b50b8a26041.herokuapp.com/user/profile', profileData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch(updateUserProfile(response.data.user));
            toast.success('Profil modifié avec succès');

            console.log('Profil mis à jour avec succès:', response.data.user);

            const updatedUser = { ...JSON.parse(localStorage.getItem('user')), user: response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil :', error);
            console.error('Détails de l\'erreur:', error.response?.data?.message);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            if (passwordData.newPassword !== passwordData.confirmNewPassword) {
                console.error('Les nouveaux mots de passe ne correspondent pas');
                toast.error('Les nouveaux mots de passe saisis ne correspondent pas');
                return;
            }

            await axios.put(
                'https://gmt-9b50b8a26041.herokuapp.com/user/password',
                passwordData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

        dispatch(changePassword(passwordData));
        toast.success('Mot de passe modifié avec succès');

        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        });
        } catch (error) {
        console.error('Erreur lors du changement de mot de passe :', error);
        }
    };
    console.log('profilleData', profileData);

    return (
        <div className="ms-2">
            <h1>Profil</h1>
        <Row className="d-flex justify-content-around">
            <Col style={{ maxWidth: '35rem' }}>
                <Form onSubmit={handleProfileSubmit}>
                    <Form.Group className="my-4" controlId="formPhotoDeProfil">
                        <Image
                            src={profileData.photoDeProfil ? `https://gmt-9b50b8a26041.herokuapp.com/uploads/${profileData.photoDeProfil}` : "/Defaut.png"}
                            alt="Photo de profil"
                            style={{ width: '150px', height: '150px', border: '2px solid #fe5c5c', borderRadius: '50%', cursor: 'pointer' }}
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Control
                            type="file"
                            name="photoDeProfil"
                            id="fileInput"
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                        />
                    </Form.Group>
                </Form>

                <Form onSubmit={handleProfileSubmit}>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Nom d'utilisateur</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nom d'utilisateur"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Row>
                            <Col>
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Prénom"
                                name="prenom"
                                value={profileData.prenom}
                                onChange={handleProfileChange}
                            />
                            </Col>
                            <Col>
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nom"
                                name="nom"
                                value={profileData.nom}
                                onChange={handleProfileChange}
                            />
                            </Col>
                        </Row>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                        />
                    </Form.Group>

                    <Button variant="danger" className="mb-3" type="submit">Enregistrer les modifications</Button>
                </Form>
            </Col>
    
            <Col style={{ maxWidth: '30rem', marginTop: '8.8rem' }}>
                <h3>Changer le mot de passe</h3>
                <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mt-4 mb-3" controlId="formCurrentPassword">
                        <Form.Label>Mot de passe actuel</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Mot de passe actuel"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formNewPassword">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Nouveau mot de passe"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Nouveau mot de passe"
                            name="confirmNewPassword"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                        />
                    </Form.Group>

                    <Button variant="danger" className="mb-3 " type="submit">Changer le mot de passe</Button>
                </Form>
            </Col>
        </Row>
        </div>
    );
};

export default Settings;

