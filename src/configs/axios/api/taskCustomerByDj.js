import axios from '@/configs/axios'

export const list = (params) => axios.get('taskCustomerByDj', {params: params});
export const listByChargor = (params) => axios.get('taskCustomerByDj/listByChargor', {params: params});
export const detail = (id) => axios.get('taskCustomerByDj/' + id);
export const report = (params) => axios.post('taskCustomerByDj/report', params);
export const reportOther = (params) => axios.post('taskCustomerByDj/reportOther', params);
