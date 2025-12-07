import axios from 'axios';

const API_URL = 'http://localhost:3000/api/books';

export const getBooks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getBookById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createBook = async (formData: FormData) => {
    const response = await axios.post(API_URL, formData);
    return response.data;
};

export const updateBook = async (id: string, formData: FormData) => {
    const response = await axios.put(`${API_URL}/${id}`, formData);
    return response.data;
};

export const deleteBook = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
