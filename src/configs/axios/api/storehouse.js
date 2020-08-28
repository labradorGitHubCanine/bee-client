import axios from '@/configs/axios'

export const detail = (id) => axios.get('storehouse/' + id);
export const list = (params) => axios.get('storehouse', {params: params});