import api from './api';

const BASE_URL = '/users';

export const createUser = async (userData) => {
    const res = await api.post(BASE_URL, userData);
    return res.data;
};

export const getAllUsers = async () => {
    const res = await api.get(BASE_URL);
    return res.data;
};

export const getUserById = async (id) => {
    const res = await api.get(`${BASE_URL}/${id}`);
    return res.data;
};

export const updateUser = async (id, userData) => {
    const payload = { ...userData };
    if (!payload.password) delete payload.password;

    const res = await api.patch(`${BASE_URL}/${id}`, payload);
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`${BASE_URL}/${id}`);
    return res.data;
};