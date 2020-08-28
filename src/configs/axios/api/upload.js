import axios from '@/configs/axios'

export const upload = (params) => {
    let data = new FormData();
    Object.keys(params).forEach(k => data.append(k, params[k]));
    return axios.post('upload', data,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
};