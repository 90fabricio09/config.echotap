// Utilitário para compressão de imagens

/**
 * Comprime uma imagem para um tamanho máximo especificado
 * @param {File} file - Arquivo de imagem
 * @param {number} maxSizeKB - Tamanho máximo em KB (padrão: 800KB para ficar bem abaixo de 1MB)
 * @param {number} maxWidth - Largura máxima em pixels (padrão: 800px)
 * @param {number} maxHeight - Altura máxima em pixels (padrão: 800px)
 * @param {number} quality - Qualidade da compressão (0.1 a 1.0, padrão: 0.8)
 * @returns {Promise<string>} Base64 da imagem comprimida
 */
export const compressImage = (
    file, 
    maxSizeKB = 800, 
    maxWidth = 800, 
    maxHeight = 800, 
    quality = 0.8
) => {
    return new Promise((resolve, reject) => {
        // Verificar se é uma imagem
        if (!file.type.startsWith('image/')) {
            reject(new Error('Arquivo deve ser uma imagem'));
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calcular novas dimensões mantendo proporção
            let { width, height } = calculateDimensions(
                img.width, 
                img.height, 
                maxWidth, 
                maxHeight
            );

            // Configurar canvas
            canvas.width = width;
            canvas.height = height;

            // Desenhar imagem redimensionada
            ctx.drawImage(img, 0, 0, width, height);

            // Função para comprimir recursivamente
            const compress = (currentQuality) => {
                const base64 = canvas.toDataURL('image/jpeg', currentQuality);
                const sizeKB = (base64.length * 0.75) / 1024; // Aproximação do tamanho em KB

                console.log(`Compressão: ${currentQuality.toFixed(2)} | Tamanho: ${sizeKB.toFixed(0)}KB`);

                if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
                    resolve(base64);
                } else {
                    // Reduzir qualidade e tentar novamente
                    compress(currentQuality - 0.1);
                }
            };

            // Iniciar compressão
            compress(quality);
        };

        img.onerror = () => {
            reject(new Error('Erro ao carregar a imagem'));
        };

        // Carregar imagem
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.onerror = () => {
            reject(new Error('Erro ao ler o arquivo'));
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Calcula novas dimensões mantendo a proporção
 * @param {number} originalWidth - Largura original
 * @param {number} originalHeight - Altura original
 * @param {number} maxWidth - Largura máxima
 * @param {number} maxHeight - Altura máxima
 * @returns {Object} Novas dimensões {width, height}
 */
const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
    let width = originalWidth;
    let height = originalHeight;

    // Redimensionar se necessário
    if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }

    if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Valida se o arquivo é uma imagem válida
 * @param {File} file - Arquivo a ser validado
 * @returns {Object} {isValid: boolean, error?: string}
 */
export const validateImageFile = (file) => {
    // Verificar se é um arquivo
    if (!file) {
        return { isValid: false, error: 'Nenhum arquivo selecionado' };
    }

    // Verificar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        return { 
            isValid: false, 
            error: 'Formato não suportado. Use JPEG, PNG ou WebP' 
        };
    }

    // Verificar tamanho (máximo 10MB antes da compressão)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
        return { 
            isValid: false, 
            error: `Arquivo muito grande. Máximo ${maxSizeMB}MB` 
        };
    }

    return { isValid: true };
};

/**
 * Converte base64 para Blob (se necessário para preview)
 * @param {string} base64 - String base64
 * @returns {Blob} Blob da imagem
 */
export const base64ToBlob = (base64) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
};

/**
 * Gera preview da imagem comprimida
 * @param {string} base64 - String base64 da imagem
 * @returns {string} URL para preview
 */
export const generatePreview = (base64) => {
    return base64; // Base64 pode ser usado diretamente como src
};
