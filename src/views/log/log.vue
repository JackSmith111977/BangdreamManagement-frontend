<script setup>
import { ref, onMounted, computed } from 'vue';
import { queryLogPageApi } from '@/api/log';
import { queryAllApi } from '@/api/emp';

const logList = ref([]);
const empList = ref([]);
// 分页条参数
const currentPage = ref(1);// 当前页码
const pageSize = ref(5);// 每页条数
const size = ref('default');// 尺寸
const background = ref(false);// 背景色
const disabled = ref(false);// 禁用
const total = ref(0);

// 每页展示数改变时触发
const handleSizeChange = (val) => {
    queryLogPage();
}

// 当前页改变时触发
const handleCurrentChange = (val) => {
    queryLogPage();
}
const queryLogPage = async () => { 
    const result = await queryLogPageApi(currentPage.value, pageSize.value);
    if(result.code == 1){
        logList.value = result.data.rows;
        total.value = result.data.total;
    }
};

const queryAllEmp = async () => { 
    const result = await queryAllApi();
    if(result.code == 1){
        empList.value = result.data;
    }
};

onMounted(() => { 
    queryLogPage();
    queryAllEmp();
});

const empMap = computed(() => { 
    let map = new Map();
    empList.value.forEach(emp => { 
        map.set(emp.id, emp.name);
    });
    return map;
});
</script>

<template>
    <!-- 数据展示 -->
    <div class="container">
        <el-table :data="logList" border style="width: 100%">

            <el-table-column prop="operateEmpId" label="操作者" width="120" align="center">
                <template #default="scope">
                    <el-tag>{{ empMap.get(scope.row.operateEmpId) || 'UnKnown' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="methodName" label="操作" width="120" align="center"/>
            <el-table-column prop="methodParams" label="操作参数" width="120" align="center"/>
            <el-table-column prop="operateTime" label="操作时间" width="120" align="center"/>
            <el-table-column prop="returnValue" label="操作结果"  align="center"/>
                

        </el-table>
    </div>

    <!-- 分页条 -->
    <div class="container">
        <div class="demo-pagination-block">
            <!-- v-model具有双向绑定的功能，
            只需在handleSizeChange函数和handleCurrentChange函数中，
            执行search函数即可绑定当前值 -->
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 30, 50, 75, 100, 200, 500, 1000]" :size="size" :disabled="disabled"
                :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<style scoped> 

</style>