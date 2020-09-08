import axios from '@/configs/axios'

export const list = (params) => axios.get('listAboutToOverdue', {params: params});
export const listReportForm = (params) => axios.get('listReportForm', {params: params});