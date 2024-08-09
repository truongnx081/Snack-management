$(document).ready(function() {
    let index = true;
    $('#filter_timeFrame').click(function (e) {
        e.preventDefault();
        index = false;
        loadDataTable();
    })

    if(index)
        loadDataTable();
});

function loadDataTable(){
    // Nếu DataTable đã được khởi tạo, hãy hủy khởi tạo trước khi tiếp tục
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().clear().destroy();
    }

    // Khởi tạo DataTable
    const table = $('#dataTable').DataTable({
        ajax: {
            url: '/honeyshop/api/statistical/sales-time-frame',
            method: "POST",
            data: function(d) {
                return JSON.stringify({
                    timeFrame: $("#timeFrame").val(),
                    productName: $("#productName").val(),
                    dateStart: $("#dateStart").val(),
                    dateEnd: $("#dateEnd").val(),
                    // ...d  // Thêm các tham số phân trang, tìm kiếm, sắp xếp từ DataTable
                });
            },
            dataType: 'json',
            contentType: 'application/json',
            dataSrc: function (json) {

                // Kiểm tra nếu json không phải là mảng và chuyển đến thuộc tính data
                if (json.data && Array.isArray(json.data)) {
                    json = json.data;

                } else {
                    console.error('Dữ liệu trả về không chứa thuộc tính data mong đợi hoặc không phải là mảng.');
                    return [];
                }

                let totalRevenue = 0;
                let totalProduct = 0;
                json.forEach(item => {
                    totalRevenue += parseFloat(item.totalRevenue) || 0
                    totalProduct += parseFloat(item.numberOfSales) || 0
                });
                $('#totalRevenue').text(formatCurrencyVND(totalRevenue));
                $('#totalProduct').text(totalProduct);

                return json.map((item) => [
                    // item.date || 'N/A',
                    item.timeFrame || 'N/A',
                    // item.productName || 'N/A',
                    // item.categoryName || 'N/A',
                    item.numberOfSales || 0,
                    item.totalRevenue ? formatCurrencyVND(item.totalRevenue) : 'N/A',
                    item.percentageOfTotalSalesPerDay ? (item.percentageOfTotalSalesPerDay.toFixed(2)) + '%' : 'N/A'
                ]);
            },
            error: function (xhr, status, error) {
                console.error('Lỗi khi tải dữ liệu:', status, error);
            }
        },
        columns: [
            // { title: 'Thời gian', width: '10%' }, // Thiết lập chiều rộng cho từng cột
            { title: 'Khung giờ', width: '20%' },
            // { title: 'Tên sản phẩm', width: '20%' },
            // { title: 'Loại sản phẩm', width: '15%' },
            { title: 'Số lượng bán', width: '20%' },
            { title: 'Tổng doanh thu', width: '25%' },
            { title: 'Phần trăm trên tổng số bán', width: '25%' }
        ],
        processing: true,
        serverSide: false,
        paging: true,
        searching: true,
        ordering: true,
        info: true
    });
}