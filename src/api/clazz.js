import request from "@/utils/request";

// 查询全部乐队数据
export const queryAllApi = () => {
    return request.get('/clazzs/list');
}

// 添加乐队
export const addApi = (date) => {
    return request.post('/clazzs', date);
}

// 修改乐队
export const updateApi = (date) => {
    return request.put('/clazzs', date);
}

// 根据id查询乐队
export const queryByIdApi = (id) => {
    return request.get(`/clazzs/${id}`);
}

// 删除乐队
export const deleteApi = (id) => {
    return request.delete(`/clazzs/${id}`);
}