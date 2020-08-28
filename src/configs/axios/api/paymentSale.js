import axios from '@/configs/axios'

export const list = (params) => axios.get('paymentSale', {params: params});
