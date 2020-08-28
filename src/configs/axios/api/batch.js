import axios from '@/configs/axios'

export const list = (params) => axios.get('batch', {params: params});
