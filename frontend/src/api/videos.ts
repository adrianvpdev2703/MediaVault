// src/api/videos.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/videos';

export const getVideos = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getVideoById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createVideo = async (videoData: FormData) => {
    const response = await axios.post(API_URL, videoData);
    return response.data;
};

export const updateVideo = async (id: string, videoData: FormData) => {
    const response = await axios.put(`${API_URL}/${id}`, videoData);
    return response.data;
};

export const deleteVideo = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
