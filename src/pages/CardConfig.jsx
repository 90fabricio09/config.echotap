import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../css/CardConfig.css';
import { validateCardCode } from '../services/cardService';
import logo from '../assets/logo.png';

const CardConfig = () => {
    const [cardCode, setCardCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Definir título da página
    useEffect(() => {
        document.title = 'EchoTap - Inserir Código do Cartão';
    }, []);

    // Pré-preencher código se vier da URL
    useEffect(() => {
        const codeFromUrl = searchParams.get('code');
        if (codeFromUrl) {
            setCardCode(codeFromUrl.toUpperCase());
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!cardCode.trim()) {
            setError('Digite o código do cartão');
            return;
        }

        if (cardCode.length !== 8) {
            setError('Código deve ter 8 caracteres');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await validateCardCode(cardCode);
            
            if (result.success) {
                // Código válido - navegar para configuração
                navigate(`/setup?cardId=${result.cardId}&code=${cardCode}`);
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Erro ao validar código:', error);
            setError('Erro ao validar código. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="card-config-container">
            <div className="card-config-content">
                <div className="header-section">
                    <div className="logo-container">
                        <img src={logo} alt="EchoTap Logo" className="config-logo" />
                    </div>
                    <h1 className="config-title">Configurar Cartão</h1>
                    <p className="config-subtitle">
                        Insira o código do seu cartão EchoTap para começar a configuração
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="config-form">
                    <div className="input-section">
                        <label htmlFor="cardCode" className="input-label">
                            Código do Cartão
                        </label>
                        <input
                            type="text"
                            id="cardCode"
                            value={cardCode}
                            onChange={(e) => {
                                setCardCode(e.target.value.toUpperCase());
                                setError(''); // Limpar erro ao digitar
                            }}
                            placeholder="Digite o código do cartão"
                            className={`card-input ${error ? 'error' : ''}`}
                            maxLength="8"
                            autoFocus
                            disabled={loading}
                        />
                        {error && (
                            <p className="error-message">
                                <i className="bi bi-exclamation-circle"></i>
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="button-section">
                        <button 
                            type="button" 
                            onClick={handleBack}
                            className="back-button"
                        >
                            Voltar
                        </button>
                        <button 
                            type="submit" 
                            className={`continue-button ${loading ? 'loading' : ''}`}
                            disabled={loading || !cardCode.trim()}
                        >
                            {loading ? (
                                <>
                                    <i className="bi bi-arrow-clockwise loading-icon"></i>
                                    Validando...
                                </>
                            ) : (
                                'Continuar'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardConfig;
