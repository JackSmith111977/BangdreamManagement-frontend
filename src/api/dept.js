import request from "@/utils/request";

// 查询部门数据,并导出
export const queryAllApi = () => {
    return request.get('/depts');
}

// 新增
export const addApi = (dept) => {
    return request.post('/depts', dept);
}

// 根据ID查询
export const queryByIdApi = (id) => {
    return request.get(`/depts/${id}`);
}

// 修改
export const updateApi = (dept) => {
    return request.put('/depts', dept);
}

// 删除
export const deleteByIdApi = (id) => {
    return request.delete(`/depts?id=${id}`);
}