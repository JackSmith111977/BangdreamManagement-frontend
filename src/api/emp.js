import request from "@/utils/request"

// 查询员工列表数据
export const queryPageApi = (name,gender,begin,end,page,pageSize) => {
    return request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);
}

// 新增员工及其工作经历
export const addEmpApi = (emp) => {
    return request.post('/emps',emp);
}

// 根据ID查询员工信息
export const queryEmpByIdApi = (id) => {
    return request.get(`/emps/${id}`)
}

// 修改员工信息
export const updateEmpApi = (emp) => {
    return request.put('/emps',emp);
}

// 删除员工信息
export const deleteEmpByIdApi = (ids) => {
    return request.delete(`/emps?ids=${ids}`);
}

// 查询所有员工信息
export const queryAllApi = () => {
    return request.get('/emps/list');
}