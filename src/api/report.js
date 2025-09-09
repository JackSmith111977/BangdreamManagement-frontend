import request from "@/utils/request";

export const queryStudentDegreeDataApi = () => {
    return request.get('/report/studentDegreeData');
}

export const queryStudentCountDataApi = () => {
    return request.get('/report/studentCountData');
}

export const queryEmpGenderDataApi = () => {
    return request.get('/report/empGenderData');
}

export const queryEmpJobDataApi = () => {
    return request.get('/report/empJobData');
}