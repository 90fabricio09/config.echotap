import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../css/CardSetup.css';
import { compressImage, validateImageFile } from '../utils/imageCompression';
import { updateCardConfig, getCardByCode } from '../services/cardService';
import { useNotification } from '../contexts/NotificationContext';

// Estilos inline temporários para garantir que funcione
const inlineStyles = {
    container: {
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px 0'
    },
    content: {
        maxWidth: '800px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
    }
};

const CardSetup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const cardId = searchParams.get('cardId');
    const cardCode = searchParams.get('code');
    const { showSuccess, showError, showWarning } = useNotification();
    
    // Estados do formulário
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        profilePhoto: null,
        profilePhotoBase64: null,
        themeColor: '#2563EB',
        links: [
            { id: 1, title: '', description: '', url: '', icon: 'website' }
        ]
    });
    
    const [imageProcessing, setImageProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loadingCardData, setLoadingCardData] = useState(true);

    // Definir título da página
    useEffect(() => {
        document.title = 'EchoTap - Configurar Cartão';
    }, []);

    // Carregar dados existentes do cartão
    useEffect(() => {
        const loadExistingCardData = async () => {
            if (!cardCode) {
                setLoadingCardData(false);
                return;
            }

            setLoadingCardData(true);
            try {
                const result = await getCardByCode(cardCode);
                
                if (result.success && result.cardData.config) {
                    const config = result.cardData.config;
                    setIsEditMode(true);
                    
                    // Preencher formulário com dados existentes
                    setFormData({
                        name: config.name || '',
                        bio: config.bio || '',
                        profilePhoto: null,
                        profilePhotoBase64: config.profilePhoto || null,
                        themeColor: config.themeColor || '#2563EB',
                        links: config.links && config.links.length > 0 
                            ? config.links.map((link, index) => ({
                                ...link,
                                id: index + 1
                            }))
                            : [{ id: 1, title: '', description: '', url: '', icon: 'website' }]
                    });

                    // Atualizar título para modo de edição
                    document.title = `EchoTap - Editar Cartão (${config.name || cardCode})`;
                }
            } catch (error) {
                console.error('Erro ao carregar dados do cartão:', error);
            } finally {
                setLoadingCardData(false);
            }
        };

        loadExistingCardData();
    }, [cardCode]);

    // Opções de ícones para links
    const iconOptions = [
        // Redes Sociais
        { value: 'instagram', label: 'Instagram' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'twitter', label: 'Twitter' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'snapchat', label: 'Snapchat' },
        { value: 'pinterest', label: 'Pinterest' },
        { value: 'discord', label: 'Discord' },
        { value: 'telegram', label: 'Telegram' },
        
        // Comunicação
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Telefone' },
        { value: 'message', label: 'Mensagem' },
        { value: 'chat', label: 'Chat' },
        
        // Negócios e Profissional
        { value: 'website', label: 'Website' },
        { value: 'portfolio', label: 'Portfólio' },
        { value: 'resume', label: 'Currículo' },
        { value: 'business', label: 'Negócio' },
        { value: 'briefcase', label: 'Maleta' },
        { value: 'building', label: 'Empresa' },
        { value: 'shop', label: 'Loja' },
        { value: 'store', label: 'Comércio' },
        
        // Tecnologia
        { value: 'github', label: 'GitHub' },
        { value: 'google', label: 'Google' },
        { value: 'code', label: 'Código' },
        { value: 'laptop', label: 'Laptop' },
        { value: 'mobile', label: 'Mobile' },
        
        // Entretenimento e Mídia
        { value: 'spotify', label: 'Spotify' },
        { value: 'netflix', label: 'Netflix' },
        { value: 'twitch', label: 'Twitch' },
        { value: 'podcast', label: 'Podcast' },
        { value: 'music', label: 'Música' },
        { value: 'video', label: 'Vídeo' },
        { value: 'camera', label: 'Câmera' },
        { value: 'mic', label: 'Microfone' },
        
        // Serviços e Utilitários
        { value: 'calendar', label: 'Calendário' },
        { value: 'clock', label: 'Relógio' },
        { value: 'location', label: 'Localização' },
        { value: 'map', label: 'Mapa' },
        { value: 'navigation', label: 'Navegação' },
        { value: 'car', label: 'Carro' },
        { value: 'plane', label: 'Avião' },
        { value: 'train', label: 'Trem' },
        
        // Comida e Restaurante
        { value: 'menu', label: 'Cardápio' },
        { value: 'restaurant', label: 'Restaurante' },
        { value: 'food', label: 'Comida' },
        { value: 'coffee', label: 'Café' },
        { value: 'pizza', label: 'Pizza' },
        { value: 'burger', label: 'Hambúrguer' },
        { value: 'utensils', label: 'Talheres' },
        
        // Saúde e Bem-estar
        { value: 'heart', label: 'Coração' },
        { value: 'star', label: 'Estrela' },
        { value: 'fitness', label: 'Fitness' },
        { value: 'gym', label: 'Academia' },
        { value: 'yoga', label: 'Yoga' },
        { value: 'meditation', label: 'Meditação' },
        
        // Educação e Aprendizado
        { value: 'book', label: 'Livro' },
        { value: 'graduation', label: 'Graduação' },
        { value: 'school', label: 'Escola' },
        { value: 'university', label: 'Universidade' },
        { value: 'course', label: 'Curso' },
        { value: 'certificate', label: 'Certificado' },
        
        // Outros
        { value: 'gift', label: 'Presente' },
        { value: 'ticket', label: 'Ingresso' },
        { value: 'event', label: 'Evento' },
        { value: 'party', label: 'Festa' },
        { value: 'game', label: 'Jogo' },
        { value: 'sport', label: 'Esporte' },
        { value: 'art', label: 'Arte' },
        { value: 'design', label: 'Design' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addLink = () => {
        const newId = Math.max(...formData.links.map(link => link.id)) + 1;
        setFormData(prev => ({
            ...prev,
            links: [...prev.links, { id: newId, title: '', description: '', url: '', icon: 'website' }]
        }));
    };

    const updateLink = (linkId, field, value) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.map(link => 
                link.id === linkId ? { ...link, [field]: value } : link
            )
        }));
    };

    const removeLink = (linkId) => {
        if (formData.links.length > 1) {
            setFormData(prev => ({
                ...prev,
                links: prev.links.filter(link => link.id !== linkId)
            }));
        }
    };

    // Funções para reordenar links
    const moveLinkUp = (linkId) => {
        setFormData(prev => {
            const links = [...prev.links];
            const currentIndex = links.findIndex(link => link.id === linkId);
            
            if (currentIndex > 0) {
                // Trocar com o link anterior
                [links[currentIndex], links[currentIndex - 1]] = [links[currentIndex - 1], links[currentIndex]];
            }
            
            return { ...prev, links };
        });
    };

    const moveLinkDown = (linkId) => {
        setFormData(prev => {
            const links = [...prev.links];
            const currentIndex = links.findIndex(link => link.id === linkId);
            
            if (currentIndex < links.length - 1) {
                // Trocar com o link seguinte
                [links[currentIndex], links[currentIndex + 1]] = [links[currentIndex + 1], links[currentIndex]];
            }
            
            return { ...prev, links };
        });
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.isValid) {
            showError(validation.error);
            return;
        }

        setImageProcessing(true);

        try {
            const compressedBase64 = await compressImage(file, 800, 800, 800, 0.8);
            
            setFormData(prev => ({
                ...prev,
                profilePhoto: file,
                profilePhotoBase64: compressedBase64
            }));

            console.log('Imagem comprimida com sucesso');
        } catch (error) {
            console.error('Erro ao comprimir imagem:', error);
            showError('Erro ao processar imagem: ' + error.message);
        } finally {
            setImageProcessing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.profilePhotoBase64) {
            showWarning('Nome e foto de perfil são obrigatórios!');
            return;
        }

        setLoading(true);

        try {
            if (!cardId) {
                showError('Erro: ID do cartão não encontrado');
                return;
            }

            const configData = {
                name: formData.name,
                bio: formData.bio,
                profilePhoto: formData.profilePhotoBase64,
                themeColor: formData.themeColor,
                links: formData.links.filter(link => link.title.trim() && link.url.trim())
            };

            const result = await updateCardConfig(cardId, configData, formData.profilePhotoBase64);
            
            if (result.success) {
                showSuccess('Configuração salva com sucesso!');
                navigate(`/view?code=${cardCode}`);
            } else {
                showError('Erro ao salvar configuração: ' + result.error);
            }
            
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            showError('Erro ao salvar configuração: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(`/config?code=${cardCode}`);
    };

    // Função para obter ícone do preview
    const getPreviewIcon = (iconType) => {
        const iconMap = {
            // Redes Sociais
            instagram: 'instagram',
            linkedin: 'linkedin',
            twitter: 'twitter',
            youtube: 'youtube',
            tiktok: 'tiktok',
            facebook: 'facebook',
            snapchat: 'snapchat',
            pinterest: 'pinterest',
            discord: 'discord',
            telegram: 'telegram',
            
            // Comunicação
            whatsapp: 'whatsapp',
            email: 'envelope',
            phone: 'telephone',
            message: 'chat-dots',
            chat: 'chat',
            
            // Negócios e Profissional
            website: 'globe',
            portfolio: 'briefcase',
            resume: 'file-earmark-person',
            business: 'building',
            briefcase: 'briefcase',
            building: 'building',
            shop: 'shop',
            store: 'shop-window',
            
            // Tecnologia
            github: 'github',
            google: 'google',
            code: 'code-slash',
            laptop: 'laptop',
            mobile: 'phone',
            
            // Entretenimento e Mídia
            spotify: 'spotify',
            netflix: 'play-circle',
            twitch: 'twitch',
            podcast: 'mic',
            music: 'music-note-beamed',
            video: 'camera-video',
            camera: 'camera',
            mic: 'mic',
            
            // Serviços e Utilitários
            calendar: 'calendar-event',
            clock: 'clock',
            location: 'geo-alt',
            map: 'map',
            navigation: 'compass',
            car: 'car-front',
            plane: 'airplane',
            train: 'train-front',
            
            // Comida e Restaurante
            menu: 'list-ul',
            restaurant: 'cup-hot',
            food: 'egg-fried',
            coffee: 'cup-hot',
            pizza: 'circle',
            burger: 'circle',
            utensils: 'utensils',
            
            // Saúde e Bem-estar
            heart: 'heart',
            star: 'star',
            fitness: 'heart-pulse',
            gym: 'dumbbell',
            yoga: 'person-standing',
            meditation: 'sun',
            
            // Educação e Aprendizado
            book: 'book',
            graduation: 'mortarboard',
            school: 'building',
            university: 'building',
            course: 'journal-text',
            certificate: 'award',
            
            // Outros
            gift: 'gift',
            ticket: 'ticket-perforated',
            event: 'calendar-event',
            party: 'balloon',
            game: 'controller',
            sport: 'trophy',
            art: 'palette',
            design: 'brush'
        };
        return iconMap[iconType] || 'link-45deg';
    };

    // Função para obter nome da cor
    const getColorName = (color) => {
        const colorNames = {
            '#2563EB': 'Azul',
            '#059669': 'Verde',
            '#dc2626': 'Vermelho',
            '#7c3aed': 'Roxo',
            '#ea580c': 'Laranja',
            '#0891b2': 'Ciano',
            '#1f2937': 'Cinza Escuro',
            '#f59e0b': 'Amarelo'
        };
        return colorNames[color] || 'Personalizada';
    };

    // Mostrar loading enquanto carrega dados existentes
    if (loadingCardData) {
        return (
            <div className="card-setup-container">
                <div className="card-setup-content">
                    <div className="loading-state">
                        <i className="bi bi-arrow-clockwise loading-icon"></i>
                        <p>Carregando dados do cartão...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card-setup-container">
            <div className="card-setup-content">
                <div className="setup-header">
                    {isEditMode && (
                        <div className="edit-mode-banner">
                            <i className="bi bi-pencil-square"></i>
                            <span>Modo de Edição - Atualizando cartão existente</span>
                        </div>
                    )}
                    <h1 className="setup-title">
                        {isEditMode ? 'Editar Cartão NFC' : 'Configuração do Cartão NFC'}
                    </h1>
                    <p className="setup-subtitle">
                        {isEditMode 
                            ? 'Atualize as informações do seu cartão' 
                            : 'Configure seus dados pessoais e links para ativar seu cartão NFC'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="setup-form">
                    {/* Dados Pessoais */}
                    <div className="form-section">
                        <h2 className="section-title">
                            <i className="bi bi-person"></i>
                            Dados Pessoais
                        </h2>

                        <div className="form-group">
                            <label className="form-label required">Nome</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Seu nome completo"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Biografia</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Conte um pouco sobre você ou sua empresa"
                                className="form-textarea"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Foto de Perfil</label>
                            <div className="photo-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="photo-input"
                                    id="photo-upload"
                                    required={!formData.profilePhotoBase64}
                                    disabled={imageProcessing}
                                />
                                <label htmlFor="photo-upload" className={`photo-label ${imageProcessing ? 'processing' : ''}`}>
                                    {imageProcessing ? (
                                        <>
                                            <i className="bi bi-arrow-clockwise loading-icon"></i>
                                            Comprimindo imagem...
                                            <span className="photo-hint">Aguarde o processamento</span>
                                        </>
                                    ) : formData.profilePhotoBase64 ? (
                                        <>
                                            <i className="bi bi-check-circle"></i>
                                            Foto Otimizada
                                            <span className="photo-hint">Clique para trocar a imagem</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-camera"></i>
                                            Adicionar Foto
                                            <span className="photo-hint">Clique para selecionar uma imagem</span>
                                        </>
                                    )}
                                </label>
                                
                                {formData.profilePhotoBase64 && (
                                    <div className="photo-preview">
                                        <img 
                                            src={formData.profilePhotoBase64} 
                                            alt="Preview" 
                                            className="preview-image"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cor do Tema */}
                    <div className="form-section">
                        <h2 className="section-title">
                            <i className="bi bi-palette"></i>
                            Cor do Tema
                        </h2>
                        
                        {/* Preview do Tema */}
                        <div className="theme-preview">
                            <div className="preview-card" style={{ '--preview-color': formData.themeColor }}>
                                <div className="preview-header">
                                    <div className="preview-avatar">
                                        {formData.profilePhotoBase64 ? (
                                            <img src={formData.profilePhotoBase64} alt="Preview" />
                                        ) : (
                                            <i className="bi bi-person-circle"></i>
                                        )}
                                    </div>
                                    <div className="preview-info">
                                        <h3>{formData.name || 'Seu Nome'}</h3>
                                        <p>{formData.bio || 'Sua biografia aparecerá aqui'}</p>
                                    </div>
                                </div>
                                <div className="preview-links">
                                    {formData.links.filter(link => link.title && link.url).slice(0, 2).map((link, index) => (
                                        <div key={index} className="preview-link">
                                            <i className={`bi bi-${getPreviewIcon(link.icon)}`}></i>
                                            <span>{link.title}</span>
                                        </div>
                                    ))}
                                    {formData.links.filter(link => link.title && link.url).length === 0 && (
                                        <div className="preview-link">
                                            <i className="bi bi-link-45deg"></i>
                                            <span>Seus links aparecerão aqui</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seletor de Cores */}
                        <div className="color-section">
                            <h3 className="color-section-title">Cores Predefinidas</h3>
                            <div className="color-picker">
                                {['#2563EB', '#059669', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#1f2937', '#f59e0b'].map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-option ${formData.themeColor === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleInputChange('themeColor', color)}
                                        title={getColorName(color)}
                                    />
                                ))}
                            </div>

                            <h3 className="color-section-title">Cor Personalizada</h3>
                            <div className="custom-color-picker">
                                <input
                                    type="color"
                                    value={formData.themeColor}
                                    onChange={(e) => handleInputChange('themeColor', e.target.value)}
                                    className="color-input"
                                />
                                <div className="color-info">
                                    <span className="color-label">Cor selecionada:</span>
                                    <span className="color-value">{formData.themeColor}</span>
                                    <div 
                                        className="color-preview-small" 
                                        style={{ backgroundColor: formData.themeColor }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="form-section">
                        <h2 className="section-title">
                            <i className="bi bi-link-45deg"></i>
                            Links
                        </h2>

                        {formData.links.map((link, index) => (
                            <div key={link.id} className="link-group">
                                <div className="link-header">
                                    <div className="link-info">
                                        <span className="link-number">Link {index + 1}</span>
                                        <span className="link-position">Posição {index + 1}</span>
                                    </div>
                                    <div className="link-controls">
                                        {formData.links.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => moveLinkUp(link.id)}
                                                    className="move-link-btn"
                                                    disabled={index === 0}
                                                    title="Mover para cima"
                                                >
                                                    <i className="bi bi-arrow-up"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveLinkDown(link.id)}
                                                    className="move-link-btn"
                                                    disabled={index === formData.links.length - 1}
                                                    title="Mover para baixo"
                                                >
                                                    <i className="bi bi-arrow-down"></i>
                                                </button>
                                            </>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeLink(link.id)}
                                            className="remove-link-btn"
                                            title="Remover link"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="link-fields">
                                    <div className="form-group">
                                        <label className="form-label">Título</label>
                                        <input
                                            type="text"
                                            value={link.title}
                                            onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                                            placeholder="Ex: Meu Instagram"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Descrição</label>
                                        <input
                                            type="text"
                                            value={link.description}
                                            onChange={(e) => updateLink(link.id, 'description', e.target.value)}
                                            placeholder="Ex: Siga-me no Instagram"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">URL</label>
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                            placeholder="Ex: https://instagram.com/seuperfil"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Ícone</label>
                                        <select
                                            value={link.icon}
                                            onChange={(e) => updateLink(link.id, 'icon', e.target.value)}
                                            className="form-select"
                                        >
                                            {iconOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addLink}
                            className="add-link-btn"
                        >
                            <i className="bi bi-plus-circle"></i>
                            Adicionar Link
                        </button>
                    </div>

                    {/* Botões de Ação */}
                    <div className="form-actions">
                        <button type="button" onClick={handleBack} className="back-btn">
                            Voltar
                        </button>
                        <button 
                            type="submit" 
                            className={`save-btn ${loading ? 'loading' : ''}`}
                            disabled={loading || imageProcessing}
                        >
                            {loading ? (
                                <>
                                    <i className="bi bi-arrow-clockwise loading-icon"></i>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle"></i>
                                    {isEditMode ? 'Atualizar Cartão' : 'Salvar Cartão'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CardSetup;