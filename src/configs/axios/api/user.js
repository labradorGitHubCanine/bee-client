import axios from '@/configs/axios'

export const form = (params) => axios.get('user/form', {params: params});
export const list = (params) => axios.get('user', {params: params});
export const silentLogin = (agencyId, userId) => axios.get('user/silentLogin', {params: {agencyId: agencyId, userId: userId}});
export const login = (params) => axios.post('user/login', params);
export const logout = () => axios.delete('user/logout');