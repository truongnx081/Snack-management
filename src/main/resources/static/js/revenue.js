$(document).ready(function() {

    let index = true;
    $('#filter_revenue').click(function (e) {
        e.preventDefault();
        index = false;
        loadDataTable();
    })

    if(index)
        loadDataTable();

    //Xuâ excel
    $('#exportButton').click(function() {
        // Lấy các giá trị từ input
        var dateStart = $('#dateStart').val();
        var dateEnd = $('#dateEnd').val();

        // Nếu dateEnd rỗng, gán giá trị ngày hiện tại
        if (dateEnd === "") {
            dateEnd = formatDate(new Date());
        }

        var productNameFilter = $('#productName').val(); // Lấy tên sản phẩm từ input

        // Nếu dateStart rỗng, gọi API để lấy ngày bắt đầu
        if (dateStart === "") {
            $.ajax({
                url: `/honeyshop/api/report/revenue/start-date`,
                type: 'GET',
                success: function(response) {
                    if (response.code === 1000) {
                        dateStart = formatDate(response.data);
                        // Gọi API để xuất dữ liệu Excel
                        window.location.href = `/honeyshop/api/report/export?dateStart=${dateStart}&dateEnd=${dateEnd}&productNameFilter=${productNameFilter}`;
                    } else {
                        alert(response.message); // Hiển thị thông báo lỗi từ API
                    }
                },
                error: function() {
                    alert('Không thể lấy ngày bắt đầu dữ liệu doanh thu.');
                }
            });
        } else {
            // Gọi API để xuất dữ liệu Excel
            window.location.href = `/honeyshop/api/report/export?dateStart=${dateStart}&dateEnd=${dateEnd}&productNameFilter=${productNameFilter}`;
        }
    });

// Hàm formatDate để chuyển đổi ngày thành định dạng yyyy-MM-dd
    function formatDate(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);  // Chuyển đổi date thành Date nếu chưa phải là Date
        }

        // Định dạng ngày theo yyyy-MM-dd
        var day = date.getDate().toString().padStart(2, '0');
        var month = (date.getMonth() + 1).toString().padStart(2, '0');  // Lưu ý: tháng bắt đầu từ 0
        var year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }


});

function loadDataTable(){
    // Nếu DataTable đã được khởi tạo, hãy hủy khởi tạo trước khi tiếp tục
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().clear().destroy();
    }

    // Khởi tạo DataTable
    const table = $('#dataTable').DataTable({
        ajax: {
            url: '/honeyshop/api/report/product-revenue',
            method: "POST",
            data: function(d) {
                return JSON.stringify({
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
                    totalRevenue += parseFloat(item.revenue) || 0
                    totalProduct += parseFloat(item.quantity) || 0
                });
                $('#totalRevenue').text(formatCurrencyVND(totalRevenue));
                $('#totalProduct').text(totalProduct);

                return json.map((item, index) => [
                    index + 1,
                    item.productName || 'N/A',
                    item.quantity || 0,
                    item.price ? formatCurrencyVND(item.price) : 'N/A',
                    item.revenue ? formatCurrencyVND(item.revenue) : 'N/A',
                ]);
            },
            error: function (xhr, status, error) {
                console.error('Lỗi khi tải dữ liệu:', status, error);
            }
        },
        columns: [
            { title: 'STT' },
            { title: 'Tên sản phẩm' },
            { title: 'Số lượng' },
            { title: 'Đơn giá' },
            { title: 'Doanh thu' },
        ],
        processing: true,
        serverSide: false,
        paging: true,
        searching: true,
        ordering: true,
        info: true
    });
}