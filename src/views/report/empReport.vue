<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { queryEmpGenderDataApi, queryEmpJobDataApi } from '@/api/report';

const chartRef = ref(null);
const chartRef2 = ref(null);
let myChart = null;
let myChart2 = null;
const option = ref({
    title: {
        text: '员工职位统计',
        subtext: '点击柱状图进行缩放~喵！'
    },
    xAxis: {
        data: [],
        axisLabel: {
            inside: true,
            color: '#fff'
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        z: 10
    },
    yAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#999'
        }
    },
    dataZoom: [
        {
            type: 'inside'
        }
    ],
    series: [
        {
            type: 'bar',
            showBackground: true,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                ])
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#2378f7' },
                        { offset: 0.7, color: '#2378f7' },
                        { offset: 1, color: '#83bff6' }
                    ])
                }
            },
            data: []
        }
    ]
});

const option2 = ref({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: []
        }
    ]
});

onMounted( () => { 
    if (chartRef.value) {
        window.scrollTo(0, 0);
        // 在 DOM 渲染完成后初始化图表
        myChart = echarts.init(chartRef.value);
        myChart2 = echarts.init(chartRef2.value);
        
        // 获取数据
        getEmpJobData();
        getEmpGenderData();
    }
});

const getEmpJobData = async() => { 
    const result = await queryEmpJobDataApi();
    if(result.code == 1){
        option.value.xAxis.data = result.data.jobList;
        option.value.series[0].data = result.data.dataList;
    }

    // 设置图表选项
    if (myChart) {
        myChart.setOption(option.value);
        enableZoomOnClick();
    }
}

const getEmpGenderData = async() => { 
    const result = await queryEmpGenderDataApi();
    if(result.code == 1){
        option2.value.series[0].data = result.data;
    }

    // 创建图表实例
    if (myChart2) {
        myChart2.setOption(option2.value);
    }
}

// Enable data zoom when user click bar.
const enableZoomOnClick = () => {
    if(!myChart) return;

    const zoomSize = 6;
    myChart.on('click', function (params) {
        const dataAxis = option.value.xAxis.data;
        myChart.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, dataAxis.length - 1)]
        });
    });
}


</script>

<template>

    <el-row align="middle">
        <el-col :span="12">
            <div ref="chartRef" style="width: 100%; height: 400px;"></div>
        </el-col>
        <el-col :span="12">
            <div ref="chartRef2" style="width: 100%; height: 400px;"></div>
        </el-col>
    </el-row>



</template>

<style scoped>


</style>
