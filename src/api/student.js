import request from "@/utils/request";

// 查询木柜子列表数据
export const queryPageApi = (name, degree, clazzId, page, pageSize) => {
    return request.get(`/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`);
}

// 根据id查询木柜子信息
export const queryByIdApi = (id) => {
    return request.get(`/students/${id}`);
}

// 新增木柜子
export const addApi = (student) => {
    return request.post('/students',student);
}

// 修改木柜子信息
export const updateApi = (student) => {
    return request.put('/students', student);
}

// 删除木柜子
export const deleteApi = (ids) => {
    return request.delete(`/students/${ids}`);
}

// 违纪处理
export const violationApi = (id, score) => {
    return request.put(`/students/violation/${id}/${score}`);
}