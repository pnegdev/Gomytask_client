import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginSuccess, registerUserSuccess } from '../../JS/Redux/userSlice';
import { setToken } from '../../JS/Redux/authSlice';
import MotDePasseOublie from './MotDePasseOublie';
import axios from 'axios';
import login from './login.jpg';
import sign from './signin.jpg';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Avant appel à votre backend');
    
            const response = await axios.post('https://gmt-9b50b8a26041.herokuapp.com/auth/login', { username, password });
            console.log('Réponse du backend :', response.data);
    
            const { token, user } = response.data;
    
            dispatch(setToken(token));
            dispatch(loginSuccess({ token, username: user.username, user }));
    
            localStorage.setItem('token', token);
            localStorage.setItem('username', user.username);
            localStorage.setItem('user', JSON.stringify({ token, username: user.username, user }));

            toast.success('Bienvenue ' + user.prenom);
            navigate('/home');
        } catch (error) {
            console.error('Erreur lors de la connexion :', error.response?.data?.message);
            toast.error('Nom d\'utilisateur ou mot de passe incorrect');
        }
    };
    


    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Vérification des champs obligatoires
            if (!username || !password || !nom || !prenom || !email) {
                toast.error('Veuillez remplir tous les champs.');
                return;
            }
            // Envoi d'une requête HTTP POST au backend pour créer un nouvel utilisateur
            const response = await axios.post('https://gmt-9b50b8a26041.herokuapp.com/auth/register', {
                username,
                password,
                nom,
                prenom,
                email,
            });

            dispatch(registerUserSuccess(response.data));
            console.log('Compte créé avec succès', response.data);

            toast.success('Compte créé avec succès');
            showLoginForm();

        } catch (error) {
            console.error('Erreur lors de la création du compte :', error.response?.data?.message);
    
            // Vérification si l'utilisateur existe déjà
            if (error.response?.data?.message === 'Cet utilisateur existe déjà') {
                toast.error('L\'utilisateur existe déjà.');
            } else {
                toast.error('Une erreur s\'est produite lors de la création du compte.');
            }
        }
    };

    const showLoginForm = () => {
        const container = document.getElementById('container');
        if (container) {
            container.classList.remove("active");
        }
    };

    const showRegisterForm = () => {
        const container = document.getElementById('container');
        if (container) {
            container.classList.add("active");
        }
    };

    const style = {
        body: {
            backgroundImage: "url('/bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            margin: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

    return (
        <div style={style.body}>
            <div className="container" id="container">
                <div className="form-container sign-in">
                    <form>
                        <h1>Connexion</h1>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className='linky' type="button" onClick={handleShowModal}>Mot de passe oublié</button>
                        <button type="submit" onClick={handleLogin}>Se connecter</button>
                    </form>
                </div>
                <div className="form-container sign-up">
                    <form>
                        <h1>Inscription</h1>
                        <div className="input-group">
                            <input type="text" placeholder="Prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                        </div>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" onClick={handleRegister}>S'inscrire</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <img src={sign} alt="Signin" className='log-image'/>
                            <p>Déja inscrit? <br></br> Connectez-vous pour suivre vos projets</p>
                            <button type="button" onClick={showLoginForm}>Connexion</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <img src={login} alt="Login" className='log-image'/>
                            <p>Pas encore inscrit? <br></br> Enregistrez-vous pour utiliser <span className='fs-6'>GoMyTask</span></p>
                            <button type="button" onClick={showRegisterForm}>Inscription</button>
                        </div>
                    </div>
                </div>
            </div>
            <MotDePasseOublie show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};
    
    export default Login;