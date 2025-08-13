import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../css/Card.css';
import { getCardByCode } from '../services/cardService';
import CardWelcome from './CardWelcome.jsx';

const Card = () => {
    const [searchParams] = useSearchParams();
    const cardCode = searchParams.get('code');
    const [cardData, setCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showWelcome, setShowWelcome] = useState(false);
    
    // Dados de exemplo para fallback
    const fallbackData = {
        name: 'Fabricio Bettarello',
        bio: 'Desenvolvedor e empreendedor apaixonado por tecnologia',
        profilePhoto: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAABQYHBAMC/8QALhAAAgEDAwMCBAYDAAAAAAAAAAECAwQRBQYSITFBE1EUIjJhBxUjcYGRobHB/8QAGQEAAwEBAQAAAAAAAAAAAAAAAwQFAgEA/8QAIhEAAgICAgICAwAAAAAAAAAAAAECEQMhEjEEQRNRImGR/9oADAMBAAIRAxEAPwB4qSjCDnJ4SWWyEnJJHoqSo0XUnJJRWW2UE2krs4ylGEXKTwkst+iIaZrN1pMnCnLfF9Y/+Gt+/wBUvZo3KXHV0jjuXJvZ6dKhcx5VYKb8Zz+hYdH1ahn5ZuHqtPzX1Xkx7q0eWoW7qwSVeC9Vf+l7/wCGfZWqPFGMrOq8xksqXyy/2vJJnDnHqjsZcl6PdKpTqwU6clKL7NE/3Hta2q3EribVGrLEW+kW/B6/DrdKu6Xtq7l6tPpGT7r/AEN2s6hHT7WVeWXhYjFdsktNSjK0Pxkpx5IzaXrF1p8sxlmHUuez7g0r0ZqnWjmLfRo8bFzNd3I7yt3b1o/7RMvD7Hcb6PqE4VYqcGpJ+UfQAhIyAAA=', // Placeholder base64 pequeno
        themeColor: '#2563EB',
        links: [
            {
                id: 1,
                title: 'Website',
                description: 'Meu site pessoal',
                url: 'https://fabricio.dev',
                icon: 'website'
            },
            {
                id: 2,
                title: 'WhatsApp',
                description: 'Entre em contato',
                url: 'https://wa.me/5511999999999',
                icon: 'whatsapp'
            },
            {
                id: 3,
                title: 'Instagram',
                description: '@fabriciobettarello',
                url: 'https://instagram.com/fabriciobettarello',
                icon: 'instagram'
            }
        ]
    };

    // Carregar dados do cartão
    useEffect(() => {
        const loadCardData = async () => {
            if (!cardCode) {
                setCardData(null);
                setError('Código do cartão não fornecido');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const result = await getCardByCode(cardCode);
                if (result.success) {
                    // Verificar se o cartão está configurado
                    if (!result.cardData.configured) {
                        // Cartão existe mas não está configurado, mostrar CardWelcome
                        setShowWelcome(true);
                        setLoading(false);
                        return;
                    }
                    
                    setCardData(result.cardData.config || fallbackData);
                } else {
                    setError('Cartão não encontrado');
                    setCardData(null);
                }
            } catch (error) {
                console.error('Erro ao carregar cartão:', error);
                setError('Erro ao carregar cartão');
                setCardData(null);
            } finally {
                setLoading(false);
            }
        };

        loadCardData();
    }, [cardCode]);

    // Atualizar título da página com nome da pessoa
    useEffect(() => {
        if (cardData && cardData.name) {
            document.title = `${cardData.name} - EchoTap`;
        } else {
            document.title = 'Cartão EchoTap';
        }
    }, [cardData]);

    // Ícones para cada tipo de link
    const getIconClass = (iconType) => {
        const icons = {
            website: 'bi-globe',
            instagram: 'bi-instagram',
            linkedin: 'bi-linkedin',
            twitter: 'bi-twitter',
            youtube: 'bi-youtube',
            tiktok: 'bi-tiktok',
            whatsapp: 'bi-whatsapp',
            email: 'bi-envelope',
            phone: 'bi-telephone'
        };
        return icons[iconType] || 'bi-link-45deg';
    };

    const handleLinkClick = (url) => {
        // Abrir link em nova aba
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Aplicar cor do tema
    useEffect(() => {
        if (cardData && cardData.themeColor) {
            document.documentElement.style.setProperty('--theme-color', cardData.themeColor);
        }
    }, [cardData]);

    // Se o cartão não está configurado, mostrar CardWelcome
    if (showWelcome) {
        return <CardWelcome />;
    }

    if (loading) {
        return (
            <div className="card-container">
                <div className="card-content">
                    <div className="loading-state">
                        <i className="bi bi-arrow-clockwise loading-icon"></i>
                        <p>Carregando cartão...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!cardData) {
        return (
            <div className="card-container">
                <div className="card-content">
                    <div className="notfound-state">
                        <div className="notfound-icon">
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <h1 className="notfound-title">Cartão não encontrado</h1>
                        <p className="notfound-message">
                            O código do cartão que você está procurando não existe ou foi removido.
                        </p>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="notfound-button"
                        >
                            <i className="bi bi-house"></i>
                            Voltar ao Início
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card-container">
            <div className="card-content">
                {error && (
                    <div className="error-banner">
                        <i className="bi bi-exclamation-triangle"></i>
                        <span>{error}</span>
                    </div>
                )}
                
                {/* Perfil */}
                <div className="profile-section">
                    <div className="profile-photo">
                        {cardData?.profilePhoto ? (
                            <img 
                                src={cardData.profilePhoto} 
                                alt={cardData.name || 'Perfil'}
                                className="profile-image"
                            />
                        ) : (
                            <div className="profile-placeholder">
                                <i className="bi bi-person-circle"></i>
                            </div>
                        )}
                    </div>
                    <h1 className="profile-name">{cardData?.name || 'Nome não disponível'}</h1>
                    {cardData?.bio && (
                        <p className="profile-bio">{cardData.bio}</p>
                    )}
                </div>

                {/* Links */}
                <div className="links-section">
                    {cardData && cardData.links && cardData.links.map((link) => (
                        <button
                            key={link.id}
                            className="link-item"
                            onClick={() => handleLinkClick(link.url)}
                        >
                            <div className="link-icon">
                                <i className={`bi ${getIconClass(link.icon)}`}></i>
                            </div>
                            <div className="link-content">
                                <span className="link-title">{link.title}</span>
                                {link.description && (
                                    <span className="link-description">{link.description}</span>
                                )}
                            </div>
                            <div className="link-arrow">
                                <i className="bi bi-arrow-right"></i>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="card-footer">
                    <p className="footer-text">
                        Criado com <i className="bi bi-heart-fill"></i> por 
                        <a 
                            href="https://echotap.com.br" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="echotap-link"
                        >
                            EchoTap
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Card;
