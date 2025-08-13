import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { validateCardCode } from '../services/cardService';
import '../css/CardWelcome.css';
import logo from '../assets/logo.png';

const CardWelcome = () => {
    const { code: paramCode } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cardExists, setCardExists] = useState(false);
    const [cardConfigured, setCardConfigured] = useState(false);

    // Pegar o código da URL params ou search params
    const code = paramCode || searchParams.get('code');

    // Verificar se o código é válido (8 caracteres alfanuméricos)
    const isValidCode = code && code.length === 8 && /^[A-Z0-9]+$/.test(code.toUpperCase());

    // Definir título da página
    useEffect(() => {
        document.title = `Cartão ${code ? code.toUpperCase() : ''} - EchoTap`;
    }, [code]);

    useEffect(() => {
        const validateCard = async () => {
            // Se o código não for válido, redirecionar para página não encontrada
            if (!isValidCode) {
                navigate('/404', { replace: true });
                return;
            }

            try {
                setLoading(true);
                const result = await validateCardCode(code.toUpperCase());
                
                if (!result.success) {
                    // Cartão não existe, redirecionar para 404
                    navigate('/404', { replace: true });
                    return;
                }

                // Cartão existe
                setCardExists(true);
                setCardConfigured(result.cardData.configured || false);
            } catch (error) {
                console.error('Erro ao validar cartão:', error);
                navigate('/404', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            validateCard();
        }
    }, [code, isValidCode, navigate]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(code.toUpperCase());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback para navegadores que não suportam clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = code.toUpperCase();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleConfigureCard = () => {
        navigate(`/`);
    };

    // Mostrar loading enquanto valida
    if (loading) {
        return (
            <div className="card-welcome-container">
                <div className="card-welcome-content">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Verificando cartão...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Se o código não for válido ou cartão não existir, não renderizar nada
    if (!isValidCode || !cardExists) {
        return null;
    }

    return (
        <div className="card-welcome-container">
            <div className="card-welcome-content">
                <div className="welcome-header">
                    <div className="logo-container">
                        <img src={logo} alt="EchoTap Logo" className="welcome-logo" />
                    </div>
                    <h1 className="welcome-title">
                        {cardConfigured ? 'Cartão EchoTap Configurado!' : 'Bem-vindo ao EchoTap!'}
                    </h1>
                    <p className="welcome-subtitle">
                        {cardConfigured 
                            ? 'Seu cartão está ativo e pronto para uso'
                            : 'Seu cartão inteligente está pronto para ser configurado'
                        }
                    </p>
                </div>

                <div className="card-info-section">
                    <div className="card-visual">
                        <div className="card-representation">
                            <div className="card-chip"></div>
                            <div className="card-brand">EchoTap</div>
                            <div className="card-code-display">{code.toUpperCase()}</div>
                        </div>
                    </div>

                    <div className="code-section">
                        <h2 className="code-title">Código do seu cartão:</h2>
                        <div className="code-container">
                            <span className="code-value">{code.toUpperCase()}</span>
                            <button 
                                onClick={handleCopyCode}
                                className={`copy-button ${copied ? 'copied' : ''}`}
                                title="Copiar código"
                            >
                                {copied ? (
                                    <i className="bi bi-check2"></i>
                                ) : (
                                    <i className="bi bi-copy"></i>
                                )}
                            </button>
                        </div>
                        {copied && (
                            <span className="copy-feedback">Código copiado!</span>
                        )}
                    </div>
                </div>

                {!cardConfigured && (
                    <>
                        <div className="instructions-section">
                            <h3 className="instructions-title">Como configurar seu cartão:</h3>
                            <div className="steps-list">
                                <div className="step-item">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <span className="step-text">Clique no botão "Configurar Cartão" abaixo</span>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <span className="step-text">Insira o código do cartão quando solicitado</span>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <span className="step-text">Personalize seus dados e links</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="action-section">
                            <button 
                                onClick={handleConfigureCard}
                                className="configure-button"
                            >
                                <i className="bi bi-gear"></i>
                                Configurar Cartão
                            </button>
                        </div>
                    </>
                )}

                {cardConfigured && (
                    <div className="action-section">
                        <button 
                            onClick={() => navigate(`view?code=${code.toUpperCase()}`)}
                            className="configure-button"
                        >
                            <i className="bi bi-eye"></i>
                            Ver Meu Cartão
                        </button>
                        <button 
                            onClick={handleConfigureCard}
                            className="configure-button secondary"
                        >
                            <i className="bi bi-pencil"></i>
                            Editar Configuração
                        </button>
                    </div>
                )}

                <div className="welcome-footer">
                    <p className="footer-text">
                        <i className="bi bi-shield-check"></i>
                        Seus dados estão seguros e protegidos
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CardWelcome;
