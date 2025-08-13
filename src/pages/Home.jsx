import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import logo from '../assets/logo.png';

const Home = () => {
    const navigate = useNavigate();

    // Definir título da página
    useEffect(() => {
        document.title = 'EchoTap - Configuração de Cartão';
    }, []);

    const handleConfigureCard = () => {
        navigate('/config');
    };

    return (
        <div className="home-container">
            <div className="home-content">
                <div className="logo-section">
                    <div className="logo-container">
                        <img src={logo} alt="EchoTap Logo" className="app-logo" />
                    </div>
                    <p className="app-subtitle">Painel de Configuração</p>
                </div>
                
                <div className="welcome-section">
                    <h2 className="welcome-title">Bem-vindo ao EchoTap</h2>
                    <p className="welcome-description">
                        Configure seu cartão inteligente de forma simples e rápida
                    </p>
                </div>

                <div className="action-section">
                    <button 
                        className="config-button"
                        onClick={handleConfigureCard}
                    >
                        Configurar Cartão
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
