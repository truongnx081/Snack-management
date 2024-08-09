var myLineChart;
var myPieChart;
var chartRevenueProfitCosts;
var chartQuantityByProduct;
var myProductQuantityLineChart;
$(document).ready(function() {
    loadDataDashboard();
    configChartTotalRevenue();
    configRevenueByGenderChart();
    configRevenueProfitCostsChart();
    configQuantityByProductChart();
    configProductQuantityChart();
});
function loadDataDashboard(){
    $.ajax({
        url: '/honeyshop/api/dashboard',
        method: 'GET',
        success: function (data) {

            let totalProfit = data.totalProfits - 140000;

            $('#totalRevenue').text(data.totalRevenue.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }));
            $('#totalProfit').text(totalProfit.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }));
            $('#totalProducts').text(data.totalQuantityProduct);
            $('#totalCustomers').text(data.totalCustomers);
            $('#totalProductsSold').text(data.totalProductSold);
        },
        error: function (xhr, status, error) {
            console.error("Có lỗi xảy ra: ", status, error);
        }
    });
}
function configChartTotalRevenue() {
    // Thiết lập mặc định cho biểu đồ, sử dụng font chữ Nunito và các font dự phòng khác
    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796'; // Màu chữ mặc định được đặt thành #858796.

    // Khởi tạo biểu đồ
    var ctx = document.getElementById("myAreaChart");
    myLineChart = new Chart(ctx, {
        type: 'line', // Loại biểu đồ là biểu đồ đường
        data: {
            labels: [], // Nhãn trục x (ban đầu là rỗng)
            datasets: [{
                label: "Doanh thu", // Nhãn của dữ liệu
                lineTension: 0.3, // Độ căng của đường biểu đồ
                backgroundColor: "rgba(78, 115, 223, 0.05)", // Màu nền của khu vực dưới đường biểu đồ
                borderColor: "rgba(78, 115, 223, 1)", // Màu đường biểu đồ
                pointRadius: 3, // Bán kính của các điểm trên đường biểu đồ
                pointBackgroundColor: "rgba(78, 115, 223, 1)", // Màu nền của các điểm
                pointBorderColor: "rgba(78, 115, 223, 1)", // Màu viền của các điểm
                pointHoverRadius: 3, // Bán kính của các điểm khi di chuột qua
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)", // Màu nền của các điểm khi di chuột qua
                pointHoverBorderColor: "rgba(78, 115, 223, 1)", // Màu viền của các điểm khi di chuột qua
                pointHitRadius: 10, // Bán kính vùng ảnh hưởng của các điểm khi nhấp chuột
                pointBorderWidth: 2, // Độ dày viền của các điểm
                data: [], // Dữ liệu của biểu đồ (ban đầu là rỗng)
            }],
        },
        options: { // Cấu hình các tùy chọn cho biểu đồ
            maintainAspectRatio: false, // Không duy trì tỉ lệ khung hình mặc định
            layout: {
                padding: {
                    left: 10, // Padding bên trái
                    right: 25, // Padding bên phải
                    top: 25, // Padding bên trên
                    bottom: 0 // Padding bên dưới
                }
            },
            scales: { // Cấu hình các trục của biểu đồ
                xAxes: [{ // Thiết lập cho trục x
                    gridLines: {
                        display: false, // Không hiển thị lưới
                        drawBorder: false // Không vẽ viền
                    },
                    ticks: {
                        maxTicksLimit: 7 // Giới hạn số lượng nhãn trục x tối đa
                    }
                }],
                yAxes: [{ // Thiết lập cho trục y
                    ticks: { // Cấu hình các nhãn trên trục y
                        maxTicksLimit: 5, // Giới hạn số lượng nhãn trục y tối đa
                        padding: 10, // Khoảng cách từ nhãn trục y đến trục
                        callback: function(value, index, values) {
                            return number_format(value) + ' đ'; // Định dạng nhãn trục y
                        }
                    },
                    gridLines: { // Cấu hình đường kẻ lưới trên trục y
                        color: "rgb(234, 236, 244)", // Màu của lưới
                        zeroLineColor: "rgb(234, 236, 244)", // Màu của đường lưới gốc (0)
                        drawBorder: false, // Không vẽ viền lưới
                        borderDash: [2], // Kiểu đường gạch ngang cho lưới
                        zeroLineBorderDash: [2] // Kiểu đường gạch ngang cho lưới gốc (0)
                    }
                }],
            },
            legend: { // Cấu hình phần chú thích của biểu đồ
                display: false // Không hiển thị chú giải (legend)
            },
            tooltips: { // Cấu hình phần hiển thị tooltip khi di chuột qua các điểm dữ liệu
                backgroundColor: "rgb(255, 255, 255)", // Màu nền của tooltip (trắng)
                bodyFontColor: "#000000", // Màu chữ của nội dung tooltip (đen)
                titleFontColor: "#000000", // Màu chữ của tiêu đề tooltip (đen)
                titleFontSize: 14, // Kích thước font của tiêu đề tooltip
                borderColor: '#000000', // Màu viền của tooltip (đen)
                borderWidth: 1, // Độ dày của viền tooltip
                xPadding: 15, // Padding ngang của tooltip
                yPadding: 15, // Padding dọc của tooltip
                displayColors: false, // Ẩn các màu sắc biểu đồ trong tooltip
                intersect: false, // Hiển thị tooltip khi di chuột gần điểm dữ liệu
                mode: 'index', // Hiển thị tất cả tooltip của các điểm dữ liệu cùng chỉ số
                caretPadding: 10, // Khoảng cách giữa caret và biên của tooltip
                callbacks: { // Định nghĩa các hàm callback cho tooltip
                    label: function(tooltipItem, chart) { // Hàm callback để tạo nội dung của tooltip
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || ''; // Lấy nhãn của dataset
                        return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + ' đ'; // Trả về chuỗi chứa nhãn và giá trị đã được định dạng
                    }
                }
            }
        }
    });

    updateChartTotalRevenue('1m');

    $('#btn-1d').on('click', function() {
        updateChartTotalRevenue('1d');
    });
    $('#btn-7d').on('click', function() {
        updateChartTotalRevenue('7d');
    });
    $('#btn-1m').on('click', function() {
        updateChartTotalRevenue('1m');
    });
}


// Hàm cập nhật dữ liệu biểu đồ từ API
function updateChartTotalRevenue(timeRange) {
    $.ajax({
        url: '/honeyshop/api/revenue_chart',
        method: 'GET', //
        data: { range: timeRange }, // Gửi dữ liệu thời gian dưới dạng tham số query
        success: function (response) {
            var data = response.data;
            console.log(data)
            myLineChart.data.labels = data.labels;
            myLineChart.data.datasets[0].data = data.data;
            myLineChart.update();
        },
        error: function (xhr, status, error) {
            console.error("Có lỗi xảy ra: ", status, error);
        }
    });
}
function configRevenueByGenderChart() {
    var ctx = document.getElementById("myPieChart");
    myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],  // Sẽ được cập nhật từ API
            datasets: [{
                data: [],  // Sẽ được cập nhật từ API
                label: "Doanh thu",
                backgroundColor: ['#4e73df', '#f6c23e'], // Màu nền
                hoverBackgroundColor: ['#2e59d9', '#f0b429'], // Màu nền khi hover
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)", // Màu nền của tooltip (trắng)
                bodyFontColor: "#000000", // Màu chữ của nội dung tooltip (đen)
                titleFontColor: "#000000", // Màu chữ của tiêu đề tooltip (đen)
                borderColor: '#000000', // Màu viền của tooltip (đen)
                borderWidth: 1, // Độ dày của viền tooltip
                xPadding: 15, // Padding ngang của tooltip
                yPadding: 15, // Padding dọc của tooltip
                displayColors: false, // Ẩn các màu sắc biểu đồ trong tooltip
                caretPadding: 10, // Khoảng cách giữa caret và biên của tooltip
                callbacks: {
                    label: function(tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        var totalRevenue = myPieChart.data.datasets[0].data[tooltipItem.index];
                        var total = myPieChart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        var percentage = ((totalRevenue / total) * 100).toFixed(2) + '%'; // Tính phần trăm
                        return datasetLabel + ': ' + number_format(totalRevenue) + ' đ (' + percentage + ')'; // Hiển thị doanh thu và phần trăm
                    }
                }
            },
            legend: {
                display: true,  // Hiển thị legend
                position: 'bottom',
                labels: {
                    boxWidth: 15, // Kích thước của chấm màu trên legend
                    padding: 10, // Khoảng cách giữa các mục trong legend
                }
            },
            cutoutPercentage: 80,  // Kích thước lỗ giữa biểu đồ
        },
    });

    updatePieChart();
}



function updatePieChart() {
    $.ajax({
        url: '/honeyshop/api/revenue_gender',
        method: 'GET',
        success: function(response) {
            if (response.code === 1000) {
                // Xử lý dữ liệu từ API
                var data = response.data;
                var labels = ['Nam', 'Nữ'];
                var revenues = [0, 0];  // Index 0 cho Nam, 1 cho Nữ

                // Phân loại doanh thu theo giới tính
                data.forEach(function(item) {
                    if (item.gender) {
                        revenues[0] = item.revenue;
                    } else {
                        revenues[1] = item.revenue;
                    }
                });

                // Cập nhật dữ liệu cho biểu đồ
                myPieChart.data.labels = labels;
                myPieChart.data.datasets[0].data = revenues;
                myPieChart.data.datasets[0].backgroundColor = ['#4e73df', '#f6c23e'];
                myPieChart.data.datasets[0].hoverBackgroundColor = ['#2e59d9', '#f0b429'];
                myPieChart.update();
            } else {
                console.error('API error: ' + response.message);
            }
        },
        error: function(error) {
            console.error('AJAX error: ', error);
        }
    });
}
// Hàm định dạng số
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(',', '').replace(' ', ''); // Xóa các dấu phẩy và khoảng trắng trong chuỗi số
    var n = !isFinite(+number) ? 0 : +number, // Kiểm tra nếu là số hợp lệ, nếu không thì đặt là 0
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), // Lấy số lượng chữ số thập phân, mặc định là 0
        sep = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep, // Ký tự phân tách hàng nghìn, mặc định là ','
        dec = (typeof dec_point === 'undefined') ? ',' : dec_point, // Ký tự phân tách thập phân, mặc định là '.'
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k; // Làm tròn số với số chữ số thập phân chính xác
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.'); // Tách phần nguyên và phần thập phân của số
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep); // Thêm ký tự phân tách hàng nghìn vào phần nguyên
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0'); // Thêm các số 0 vào phần thập phân nếu cần
    }
    return s.join(dec); // Nối phần nguyên và phần thập phân với ký tự phân tách thập phân
}

function configRevenueProfitCostsChart() {
    var ctx = document.getElementById("chartRevenueProfitCosts").getContext("2d");

    // Khởi tạo biểu đồ với dữ liệu trống
    chartRevenueProfitCosts = new Chart(ctx, {
        type: 'bar',  // Loại biểu đồ: cột (bar)
        data: {
            labels: [], // Mảng nhãn trống, sẽ được cập nhật từ API
            datasets: [
                {
                    label: 'Doanh thu',
                    backgroundColor: '#4e73df',  // Màu nền của cột Doanh thu
                    hoverBackgroundColor: '#2e59d9',  // Màu nền khi rê chuột vào cột Doanh thu
                    borderColor: '#4e73df',  // Màu viền của cột Doanh thu
                    data: []  // Dữ liệu trống, sẽ được cập nhật từ API
                },
                {
                    label: 'Lợi nhuận',
                    backgroundColor: '#1cc88a',  // Màu nền của cột Lợi nhuận
                    hoverBackgroundColor: '#17a673',  // Màu nền khi rê chuột vào cột Lợi nhuận
                    borderColor: '#1cc88a',  // Màu viền của cột Lợi nhuận
                    data: []  // Dữ liệu trống, sẽ được cập nhật từ API
                },
                {
                    label: 'Chi phí',
                    backgroundColor: '#f6c23e',  // Màu nền của cột Chi phí
                    hoverBackgroundColor: '#f0b429',  // Màu nền khi rê chuột vào cột Chi phí
                    borderColor: '#f6c23e',  // Màu viền của cột Chi phí
                    data: []  // Dữ liệu trống, sẽ được cập nhật từ API
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "#ffffff",  // Màu nền của tooltip (trắng)
                titleFontColor: "#000000",  // Màu chữ của tiêu đề tooltip (đen)
                bodyFontColor: "#000000",  // Màu chữ của nội dung tooltip (đen)
                borderColor: '#000000',  // Màu viền của tooltip (đen)
                borderWidth: 1,  // Độ dày của viền tooltip
                xPadding: 15,  // Padding theo chiều ngang của tooltip
                yPadding: 15,  // Padding theo chiều dọc của tooltip
                displayColors: false,  // Ẩn các màu sắc của các cột trong tooltip
                caretPadding: 10,  // Padding giữa tooltip và điểm dữ liệu
                callbacks: {
                    label: function(tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + number_format(tooltipItem.yLabel) + ' đ';  // Hiển thị dữ liệu với định dạng tiền tệ
                    },
                    title: function(tooltipItems, data) {
                        return tooltipItems[0].xLabel;  // Hiển thị ngày tháng trong tooltip
                    }
                },
                titleFontSize: 14,  // Kích thước chữ của tiêu đề tooltip
                titleFontStyle: 'bold',  // Phong cách chữ của tiêu đề tooltip (đậm)
                titleAlign: 'center',  // Căn giữa tiêu đề tooltip
                bodyFontSize: 12,  // Kích thước chữ của nội dung tooltip
                bodyFontStyle: 'normal',  // Phong cách chữ của nội dung tooltip (thường)
                bodySpacing: 5,  // Khoảng cách giữa các dòng nội dung trong tooltip
                footerFontStyle: 'bold',  // Phong cách chữ của footer tooltip (đậm)
                footerSpacing: 10,  // Khoảng cách giữa các dòng footer và nội dung tooltip
                footerMarginTop: 10  // Khoảng cách giữa các footer và cạnh trên của tooltip
            },
            legend: {
                display: true,  // Hiển thị danh sách legend
                position: 'bottom',  // Vị trí của legend
                labels: {
                    fontColor: '#858796',  // Màu chữ của các nhãn trong legend
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'  // Đơn vị thời gian cho trục x (ngày)
                    },
                    gridLines: {
                        display: false,  // Ẩn các đường lưới trên trục x
                        drawBorder: false  // Ẩn đường viền trục x
                    },
                    ticks: {
                        maxTicksLimit: 7  // Giới hạn số lượng các điểm đánh dấu trên trục x
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,  // Giới hạn số lượng các điểm đánh dấu trên trục y
                        padding: 10,  // Padding giữa các điểm đánh dấu và lề của trục y
                        callback: function(value, index, values) {
                            return number_format(value) + ' đ';  // Hiển thị giá trị với định dạng tiền tệ
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",  // Màu của các đường lưới trên trục y
                        zeroLineColor: "rgb(234, 236, 244)",  // Màu của đường lưới tại giá trị 0
                        drawBorder: false,  // Ẩn đường viền trục y
                        borderDash: [2],  // Đường lưới của trục y với kiểu dash
                        zeroLineBorderDash: [2]  // Đường lưới tại giá trị 0 với kiểu dash
                    }
                }]
            }
        }
    });

    updateChartRevenueProfitCosts();
}

function updateChartRevenueProfitCosts() {
    $.ajax({
        url: `/honeyshop/api/report/revenue-profit-costs`,
        method: 'GET',
        success: function(response) {
            // Kiểm tra định dạng dữ liệu API trả về
            if (response && Array.isArray(response)) {
                // Xử lý dữ liệu từ API
                var labels = [];
                var totalRevenueData = [];
                var totalProfitData = [];
                var totalCostsData = [];

                response.forEach(function(item) {
                    labels.push(item.day);
                    totalRevenueData.push(item.totalRevenue);
                    totalProfitData.push(item.totalProfit);
                    totalCostsData.push(item.totalCosts);
                });

                // Cập nhật dữ liệu cho biểu đồ
                chartRevenueProfitCosts.data.labels = labels;
                chartRevenueProfitCosts.data.datasets[0].data = totalRevenueData;
                chartRevenueProfitCosts.data.datasets[1].data = totalProfitData;
                chartRevenueProfitCosts.data.datasets[2].data = totalCostsData;

                // Cập nhật biểu đồ
                chartRevenueProfitCosts.update();
            } else {
                console.error('API error: Invalid response format');
            }
        },
        error: function(error) {
            console.error('AJAX error: ', error);
        }
    });
}

function configQuantityByProductChart() {
    var ctx = document.getElementById("chartQuantityByProduct");
    // Xóa biểu đồ cũ nếu đã tồn tại
    if (chartQuantityByProduct) {
        chartQuantityByProduct.destroy();
    }
    chartQuantityByProduct = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],  // Sẽ được cập nhật từ API
            datasets: [{
                data: [],  // Sẽ được cập nhật từ API
                label: "Số lượng",
                backgroundColor: [], // Màu nền sẽ được cập nhật động
                hoverBackgroundColor: [], // Màu nền khi hover
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)", // Màu nền của tooltip (trắng)
                bodyFontColor: "#000000", // Màu chữ của nội dung tooltip (đen)
                titleFontColor: "#000000", // Màu chữ của tiêu đề tooltip (đen)
                borderColor: '#000000', // Màu viền của tooltip (đen)
                borderWidth: 1, // Độ dày của viền tooltip
                xPadding: 15, // Padding ngang của tooltip
                yPadding: 15, // Padding dọc của tooltip
                displayColors: false, // Ẩn các màu sắc biểu đồ trong tooltip
                caretPadding: 10, // Khoảng cách giữa caret và biên của tooltip
                callbacks: {
                    label: function(tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        var totalQuantity = chartQuantityByProduct.data.datasets[0].data[tooltipItem.index];
                        var total = chartQuantityByProduct.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        var percentage = ((totalQuantity / total) * 100).toFixed(2) + '%'; // Tính phần trăm
                        return datasetLabel + ': ' + number_format(totalQuantity) + ' (' + percentage + ')'; // Hiển thị số lượng và phần trăm
                    }
                },
                // titleFontSize: 16,  // Kích thước chữ của tiêu đề tooltip
                // titleFontStyle: 'bold',  // Phong cách chữ của tiêu đề tooltip (đậm)
                // titleAlign: 'center',  // Căn giữa tiêu đề tooltip
                // titleFontColor: '#000000',  // Màu chữ của tiêu đề tooltip
                // bodyFontSize: 14,  // Kích thước chữ của nội dung tooltip
                // bodyFontStyle: 'bold',  // Phong cách chữ của nội dung tooltip (đậm)
                // bodySpacing: 5,  // Khoảng cách giữa các dòng nội dung trong tooltip
                // footerFontStyle: 'bold',  // Phong cách chữ của footer tooltip (đậm)
                // footerSpacing: 10,  // Khoảng cách giữa các dòng footer và nội dung tooltip
                // footerMarginTop: 10  // Khoảng cách giữa các footer và cạnh trên của tooltip
            },
            legend: {
                display: true,  // Hiển thị legend
                position: 'bottom',
                labels: {
                    boxWidth: 15, // Kích thước của chấm màu trên legend
                    padding: 10   // Khoảng cách giữa các mục trong legend
                }
            },
            cutoutPercentage: 70,  // Kích thước lỗ giữa biểu đồ
        },
    });
    updateQuantityByProductChart();
}




function updateQuantityByProductChart() {
    $.ajax({
        url: `/honeyshop/api/report/total-quantity-by-product`,
        method: 'GET',
        success: function(response) {
            var data = response;
            if (Array.isArray(data)) {
                var labels = [];
                var quantities = [];
                var backgroundColors = [];
                var hoverBackgroundColors = [];
                var colors = ['#4e73df', '#f6c23e', '#1cc88a', '#36b9cc', '#e74a3b']; // Màu sắc cho 5 sản phẩm

                // Sắp xếp dữ liệu theo tổng số lượng và lấy 5 sản phẩm hàng đầu
                data.sort((a, b) => b.totalQuantity - a.totalQuantity);
                data.slice(0, 5).forEach(function(item, index) {
                    labels.push(item.productName);
                    quantities.push(item.totalQuantity);
                    // Tạo màu sắc cho mỗi sản phẩm từ danh sách màu
                    backgroundColors.push(colors[index % colors.length]);  // Đảm bảo không vượt quá số màu có sẵn
                    hoverBackgroundColors.push(Chart.helpers.color(colors[index % colors.length]).alpha(0.7).rgbString());
                });

                // Cập nhật dữ liệu cho biểu đồ
                chartQuantityByProduct.data.labels = labels;
                chartQuantityByProduct.data.datasets[0].data = quantities;
                chartQuantityByProduct.data.datasets[0].backgroundColor = backgroundColors;
                chartQuantityByProduct.data.datasets[0].hoverBackgroundColor = hoverBackgroundColors;
                chartQuantityByProduct.update();

            } else {
                console.error('API error: Data is not in the expected format');  // Hiển thị thông báo lỗi chi tiết
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX error:', status, error);  // Hiển thị thông báo lỗi chi tiết
        }
    });
}

function configProductQuantityChart() {
    var ctx = document.getElementById("productQuantityLineChart").getContext('2d');
    var myProductQuantityLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Ngày sẽ được cập nhật từ phản hồi API
            datasets: [] // Dữ liệu cho tất cả các sản phẩm
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        display: false // Ẩn các đường lưới của trục x
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                },
                y: {
                    grid: {
                        display: false, // Ẩn các đường lưới của trục y
                        drawBorder: false, // Ẩn đường viền của trục y
                        borderDash: [], // Loại bỏ các đường lưới dạng dash
                        zeroLineBorderDash: [] // Loại bỏ các đường lưới dạng dash tại giá trị 0
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    backgroundColor: "#ffffff",  // Màu nền của tooltip (trắng)
                    titleFontColor: "#000000",  // Màu chữ của tiêu đề tooltip (đen)
                    bodyFontColor: "#000000",  // Màu chữ của nội dung tooltip (đen)
                    borderColor: '#000000',  // Màu viền của tooltip (đen)
                    borderWidth: 1,  // Độ dày của viền tooltip
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw; // Hiển thị dữ liệu
                        }
                    },
                    titleFontSize: 16,  // Kích thước chữ của tiêu đề tooltip
                    titleFontStyle: 'bold',  // Phong cách chữ của tiêu đề tooltip (đậm)
                    titleAlign: 'center',  // Căn giữa tiêu đề tooltip
                    bodyFontSize: 14,  // Kích thước chữ của nội dung tooltip
                    bodyFontStyle: 'normal',  // Phong cách chữ của nội dung tooltip (thường)
                    bodySpacing: 5,  // Khoảng cách giữa các dòng nội dung trong tooltip
                    footerFontStyle: 'bold',  // Phong cách chữ của footer tooltip (đậm)
                    footerSpacing: 10,  // Khoảng cách giữa các dòng footer và nội dung tooltip
                    footerMarginTop: 10  // Khoảng cách giữa các footer và cạnh trên của tooltip
                }
            }
        }
    });

    updateProductQuantityChart(myProductQuantityLineChart);
}

function updateProductQuantityChart(chart) {
    $.ajax({
        url: '/honeyshop/api/report/quantity-by-product',
        method: 'GET',
        success: function(response) {
            var data = response; // Your API response
            var productData = {};
            var labels = [];

            // Collect data for each product
            data.forEach(item => {
                if (!productData[item.productName]) {
                    productData[item.productName] = [];
                }
                productData[item.productName].push({
                    x: item.day,
                    y: item.totalQuantity
                });
                if (!labels.includes(item.day)) {
                    labels.push(item.day);
                }
            });

            // Sort labels
            labels.sort((a, b) => new Date(a) - new Date(b));

            // Create datasets for all products
            var datasets = Object.keys(productData).map(product => ({
                label: product,
                data: productData[product],
                borderColor: getColorForProduct(product),
                backgroundColor: 'transparent', // Set background color to transparent
                borderWidth: 2, // Set border width to 2 (or 0 if you want no border at all)
                fill: false
            }));

            // Update chart data
            chart.data.labels = labels;
            chart.data.datasets = datasets;
            chart.update();
        },
        error: function(xhr, status, error) {
            console.error("Có lỗi xảy ra: ", status, error);
        }
    });
}

function getColorForProduct(product, alpha = '1') {
    // Define specific colors for products here
    const colors = {
        "Sữa đậu nành": 'rgba(255, 99, 132, ' + alpha + ')',
        "Trà bí đao": 'rgba(54, 162, 235, ' + alpha + ')',
        "Bánh tráng chấm": 'rgba(255, 206, 86, ' + alpha + ')',
        "Snack": 'rgba(75, 192, 192, ' + alpha + ')',
        "Xoài": 'rgba(153, 102, 255, ' + alpha + ')'
    };
    return colors[product] || getRandomColor(alpha);
}

function getRandomColor(alpha = '1') {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${alpha})`;
}


