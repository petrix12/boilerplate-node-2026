/* src/services/contact.service.js */
import api from '@/api/axios';

export const contactService = {
    async sendMessage(formData) {
        const response = await api.post('/contact', formData);
        return response.data;
    }
};