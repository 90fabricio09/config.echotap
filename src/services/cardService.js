import { 
    collection, 
    doc, 
    getDocs, 
    updateDoc,
    query,
    where,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const CARDS_COLLECTION = 'cards';

// Validar se o código do cartão existe
export const validateCardCode = async (code) => {
    try {
        if (!code || code.length !== 8) {
            return {
                success: false,
                error: 'Código deve ter 8 caracteres'
            };
        }

        const cardsRef = collection(db, CARDS_COLLECTION);
        const q = query(cardsRef, where('code', '==', code.toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return {
                success: false,
                error: 'Código não encontrado'
            };
        }

        const cardDoc = querySnapshot.docs[0];
        return {
            success: true,
            cardId: cardDoc.id,
            cardData: cardDoc.data()
        };
    } catch (error) {
        console.error('Erro ao validar código:', error);
        return {
            success: false,
            error: 'Erro ao validar código'
        };
    }
};

// Buscar cartão por código
export const getCardByCode = async (code) => {
    try {
        const q = query(
            collection(db, CARDS_COLLECTION), 
            where('code', '==', code.toUpperCase())
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return {
                success: false,
                error: 'Cartão não encontrado'
            };
        }

        const cardDoc = querySnapshot.docs[0];
        const cardData = {
            id: cardDoc.id,
            ...cardDoc.data()
        };

        return {
            success: true,
            cardData: cardData
        };
    } catch (error) {
        console.error('Erro ao buscar cartão:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Atualizar configuração do cartão
export const updateCardConfig = async (cardId, configData, profileImageBase64 = null) => {
    try {
        let finalConfigData = { ...configData };
        
        // Se houver imagem de perfil em base64, incluir nos dados
        if (profileImageBase64) {
            finalConfigData.profilePhoto = profileImageBase64;
        }

        const cardRef = doc(db, CARDS_COLLECTION, cardId);
        
        await updateDoc(cardRef, {
            config: finalConfigData,
            configured: true,
            lastUsed: serverTimestamp(),
            owner: finalConfigData.name || 'Usuário'
        });

        return {
            success: true
        };
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Atualizar último uso do cartão (quando alguém acessa o link)
export const updateLastUsed = async (cardId) => {
    try {
        const cardRef = doc(db, CARDS_COLLECTION, cardId);
        
        await updateDoc(cardRef, {
            lastUsed: serverTimestamp()
        });

        return {
            success: true
        };
    } catch (error) {
        console.error('Erro ao atualizar último uso:', error);
        return {
            success: false,
            error: error.message
        };
    }
};


