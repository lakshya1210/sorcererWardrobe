import React from 'react';
import Chart from 'react-apexcharts';

function SalesChart({ salesData, title }) {
    const options = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            type: 'category',
            categories: salesData.map(data => data.date),
        },
        plotOptions: {
            bar: {
                borderRadius: 2,
                dataLabels: {
                    position: 'top',
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return `₹${val}`;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        title: {
            text: title,
            align: 'left'
        }
    };


    const series = [{
        name: 'Sales',
        data: salesData.map(data => data.totalSales)
    }];

    return (
        <div className='p-6 pb-1 border bg-white rounded-md shadow-dashboard'>
            <Chart options={options} series={series} type="bar" height="350" />
        </div>
    );
}

export default SalesChart;
