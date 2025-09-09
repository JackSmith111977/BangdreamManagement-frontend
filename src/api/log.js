import request from "@/utils/request";

export const queryLogPageApi = (page, pageSize) => {
    return request.get(`/log/page?page=${page}&pageSize=${pageSize}`);
}