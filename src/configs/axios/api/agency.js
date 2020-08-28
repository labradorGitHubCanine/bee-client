import axios from '@/configs/axios'

export const detail = (agencyId) => axios.get('agency/' + agencyId);
export const list = (params) => axios.get('agency', {params: params});