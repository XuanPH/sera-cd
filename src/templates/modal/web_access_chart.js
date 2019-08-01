class WebAccessChart {
    constructor(type) {
        this.type = type

    }

    render() {
        return `<div class='row chart_modal'>
                <div class='col-12'><h1>${this.type === 'visit' ? `#Total visit 3 days ago` : `#Accessed/page 3 days ago`}</h1></div>
                <div class='col-12'> <canvas id="chartModal" width="800" height="300"></canvas></div>
            </div>
       `
    }
    init() {
        switch (this.type) {
            case 'visit': this.initChartVisitChart(); break;
            case 'page_view': this.initChartPageView(); break;
        }
    }
    initChartVisitChart() {
        var visitChart = document.getElementById("chartModal");
        var myChart = new Chart(visitChart, {
            type: 'line',
            data: {
                labels: ["27 June", "29 June", "01 July", "03 July"],
                datasets: [
                    {
                        label: '#Visit times',
                        data: [80, 30, 63, 20],
                        backgroundColor: window.chartColors.blue,
                        borderColor: window.chartColors.blue,
                        fill: false,
                        borderWidth: 3,
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        //display: true,
                        ticks: {
                            display: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: '#Visit'
                        }
                    }]
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItem, data) {
                            return tooltipItem[0].label
                        },
                        label: function (tooltipItem, data) {
                            return [`#Visit: ${tooltipItem.yLabel} times`, `#View 3 pages`]
                        },
                    }
                }
            }
        });

    }
    initChartPageView() {
        var pageViewChart = document.getElementById("chartModal");
        var myChart = new Chart(pageViewChart, {
            type: 'horizontalBar',
            data: {
                labels: ["anycar.vn/ford/ranger-n..", "anycar.vn/need-to-sell-card", "anycar.vn/contact-us", "anycar.vn/showroom-hanoi", "anycar.vn"],
                datasets: [
                    {
                        label: '#Page view',
                        data: [10, 8, 5, 4, 3],
                        backgroundColor: window.chartColors.yellow,
                        borderColor: window.chartColors.yellow,
                        borderWidth: 3,
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Page name'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: false
                        }
                    }],
                },
                legend: { display: false },
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        title: function (tooltipItems, data) {
                            var idx = tooltipItems[0].index;
                            var title = data.labels[idx];
                            // return `${title}: ${(tooltipItems[0].xLabel, 2)}`
                            return title
                        },
                        label: function (tooltipItem, data) {
                            return '';
                        },
                    }
                },
                plugins: {
                    datalabels: {
                        align: 'end',
                        clamp: true,
                        clip: true,
                        anchor: 'start',
                        display: 'auto',
                        textAlign: 'end',
                        color: "#000",
                        // padding: {
                        //     top: -20,
                        //     bottom: 0,
                        // },
                        font: function (context) {
                            var w = context.chart.width;
                            return {
                                size: w < 512 ? 12 : 14
                            }
                        },
                        formatter: function (value, context) {
                            //return value
                            return context.chart.data.labels[context.dataIndex] + `(${value})`;
                        }
                    }
                }
            }
        });
    };
}

export default WebAccessChart