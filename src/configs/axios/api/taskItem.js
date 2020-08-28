import axios from '@/configs/axios'

export const list = (params) => axios.get('taskItem', {params: params});
export const create = (params) => axios.post('taskItem', params);
export const modify = (params) => axios.put('taskItem', params);
export const drop = (id) => axios.delete('taskItem/' + id);