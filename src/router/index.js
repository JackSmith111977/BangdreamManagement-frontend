import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '@/views/login/login.vue';
import mainView from '@/views/layout/index.vue';
import indexView from '@/views/index/index.vue';
import ClazzView from '@/views/clazz/clazz.vue';
import deptView from '@/views/dept/dept.vue';
import empView from '@/views/emp/emp.vue';
import studentView from '@/views/student/student.vue';
import stuReportView from '@/views/report/stuReport.vue';
import empReportView from '@/views/report/empReport.vue';
import logView from '@/views/log/log.vue'


// router:用于配置路由，维护路由表
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [

        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            name: 'main',
            component: mainView,
            // 重定向: 当访问 / 时，默认重定向到 /index
            redirect: '/index',
            // 配置子路由
            children: [
                //本项可以用重定向实现
                // {
                //     path: '/',
                //     name: 'main_index',
                //     component: indexView
                // },
                {
                    path: '/index',
                    name: 'index',
                    component: indexView
                },
                {
                    path: '/clazz',
                    name: 'clazz',
                    component: ClazzView
                },
                {
                    path: '/dept',
                    name: 'dept',
                    component: deptView
                },
                {
                    path: '/emp',
                    name: 'emp',
                    component: empView
                },
                {
                    path: '/student',
                    name: 'student',
                    component: studentView
                },
                {
                    path: '/stuReport',
                    name: 'stuReport',
                    component: stuReportView
                },
                {
                    path: '/empReport',
                    name: 'empReport',
                    component: empReportView
                },
                {
                    path: '/log',
                    name: 'log',
                    component: logView
                }

            ]
        }
    ]
})

export default router;