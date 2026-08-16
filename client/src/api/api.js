// client/src/api/api.js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// Users / profiles
export const getUsers = () => api.get('/users').then((r) => r.data);
export const createUser = (username) => api.post('/users', { username }).then((r) => r.data);
export const getUser = (id) => api.get(`/users/${id}`).then((r) => r.data);

// Quests
export const getTasks = (userId) => api.get(`/tasks/${userId}`).then((r) => r.data);
export const addTask = (title, difficulty, userId) =>
  api.post('/tasks', { title, difficulty, userId }).then((r) => r.data);
export const completeTask = (id, userId) =>
  api.post(`/tasks/${id}/complete`, { userId }).then((r) => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);

// Focus sessions
export const addFocusXp = (userId, minutes) =>
  api.post('/tasks/bonus-xp', { userId, minutes }).then((r) => r.data);

// History
export const getHistory = (userId) => api.get(`/history/${userId}`).then((r) => r.data);

export default api;