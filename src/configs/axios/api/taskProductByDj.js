import axios from '@/configs/axios'

export const list = (params) => axios.get('taskProductByDj', {params: params});
export const detail = (id) => axios.get('taskProductByDj/' + id);
export const listAgreementSale = (params) => axios.get('taskProductByDj/listAgreementSale', {params: params});
export const report = (params) => axios.post('taskProductByDj/report', params);