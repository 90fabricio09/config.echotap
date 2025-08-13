import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
    const navigate = useNavigate();

    // Definir título da página
    useEffect(() => {
        document.title = '404 - Página não encontrada | EchoTap';
    }, []);

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <div className="error-section">
                    <h1 className="error-code">404</h1>
                    <div className="error-icon">🔍</div>
                </div>
                
                <div className="message-section">
                    <h2 className="error-title">Página não encontrada</h2>
                    <p className="error-description">
                        Ops! A página que você está procurando não existe ou foi movida.
                    </p>
                </div>

                <div className="action-section">
                    <button 
                        className="home-button"
                        onClick={handleGoHome}
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;