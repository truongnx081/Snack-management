let productsApiUrl = "/honeyshop/api/products";

let urls;
let methods;
let messages;

$(document).ready(function () {
    loadData();

    $("#addProduct").on("click", function () {
        $(".create").show();
        $(".update").hide();
        $('#chon-anh').html('');

        urls = productsApiUrl;
        methods = 'POST';
        messages = "Thêm";

        localStorage.removeItem('id');

        $("#addUserPanel").fadeIn();
    });
    // create_updateProduct(urls, methods, messages);
})

// Định dạng tiền tệ
function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Load data
// function loadData() {
//     $.ajax({
//         url: productsApiUrl,
//         method: "GET",
//         contentType: "application/json",
//         dataType: "json",
//         // headers: {
//         //     'Authorization': 'Bearer ' + getToken()
//         // },
//         success: function (response) {
//             let products = response.data; // Lấy danh sách data
//             let row = '';
//             if (Array.isArray(products)) {
//                 products.forEach(function (product, index) {
//                     row += `
//                                 <tr id = 'row_${product.id}' class="odd">
//                                     <td class="sorting_1">${index + 1}</td>
//                                     <td>${product.name}</td>
//                                     <td>
//                                         <img src = "/honeyshop/images/${product.thumbnail}" alt="Hình ảnh"
//                                         style="width: 50px; height: 50px">
//                                     </td>
//                                     <td>
//                                         ${formatCurrencyVND(product.price)}
//                                     </td>
//                                     <td>${product.categories.name}</td>
//                                     <td style="text-align: center">
//                                         <button
//                                                 type="button"
//                                                 class="btn btn-info"
//                                             onclick='eidtProduct("${product.id}")'>
//                                             <i class="fa fa-edit"></i>
//                                         </button>
//                                         <button
//                                                 type="button"
//                                                 class="btn btn-danger"
//                                             onclick='removeProduct("${product.id}")'>
//                                             <i class="fa fa-trash"></i>
//                                         </button>
//                                     </td>
//                                 </tr>
//                                     `;
//                     $("tbody").html(row);
//                 })
//             } else {
//                 console.error("Expected an array but got:", typeof products);
//                 alert('The response is not an array.');
//             }
//         },
//         error: function (e) {
//             console.log("Error: ", e);
//         }
//     })
// }

function loadData() {
    // Nếu DataTable đã được khởi tạo, hãy hủy khởi tạo trước khi tiếp tục
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().clear().destroy();
    }

    // Khởi tạo DataTable
    const table = $('#dataTable').DataTable({
        "ajax": {
            "url": productsApiUrl, // URL của API để lấy dữ liệu
            "type": "GET",
            "dataSrc": function (json) {

                // Kiểm tra nếu dữ liệu trả về không phải là mảng
                if (!Array.isArray(json)) {
                    if (json.data && Array.isArray(json.data)) {
                        json = json.data;
                    } else {
                        console.error("API response is not an array:", json);
                        return [];
                    }
                }
                let totalProduct = json.length;
                $('#totalProduct').text(totalProduct);
                const data = json.map((item, index) => {
                    return [
                        index + 1, // STT
                        item.name || 'N/A',
                        item.thumbnail ? `<img src="/honeyshop/images/${item.thumbnail}" alt="${item.name}" style="width:50px;height:50px;">` : 'N/A',
                        item.price ? item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A',
                        item.categories && item.categories.name ? item.categories.name : 'N/A',
                        `<button type="button" class="btn btn-info" onclick="eidtProduct('${item.id}')"> <i class="fa fa-edit"></i> </button> 
                        <button type="button" class="btn btn-danger" onclick="removeProduct('${item.id}')"> <i class="fa fa-trash"></i> </button>`
                    ];
                });
                return data;
            }
        },
        "columns": [
            { "title": "STT" },
            { "title": "Tên sản phẩm" },
            { "title": "Hình ảnh", "orderable": false },
            { "title": "Đơn giá" },
            { "title": "Loại sản phẩm" },
            { "title": "Thao tác", "orderable": false }
        ],
        processing: true,
        serverSide: false,
        paging: true,
        searching: true,
        ordering: true,
        info: true
    });
    table.on('search.dt', function () {
        var info = table.page.info();
        $('#totalProduct').text(info.recordsDisplay);
    });
}

// create update product
function create_updateProduct(urls, methods, messages) {
    // Gỡ bỏ các sự kiện submit đã gán trước đó
    $("#form_create_update").off('submit');

    $("#form_create_update").submit((event) => {
        event.preventDefault();
        let id = localStorage.getItem("id");
        if (id)
            urls += "/" + id;

        let formData = new FormData();

        let product = {
            name: $("#name").val(),
            price: $("#price").val(),
            categories: $("#categories").val(),
            description: $("#description").val(),
        }

        // Append user data as a json string
        formData.append('data', new Blob([JSON.stringify(product)], { type: 'application/json' }));

        // Append the file
        let fileInput = document.getElementById('img');
        if (fileInput.files.length > 0)
            formData.append('img', fileInput.files[0]);

        $.ajax({
            url: urls,
            method: methods,
            data: formData,
            processData: false, // Prevent jQuery from automatically transforming the data into a query string
            contentType: false, // Setting contentType to false is important for file upload
            // headers: {
            //     'Authorization': 'Bearer ' + token
            // },
            success: function (response) {
                console.log(response)
                if (response.code === 1000) {
                    swal(messages + " sản phẩm thành công", "", "success");
                    if (messages !== 'Cập nhật') {
                        $("#form_create_update")[0].reset();
                        $('#chon-anh').html('');
                    }
                    loadData();
                } else {
                    swal(messages + " sản phẩm thất bại", response.messages, "error");
                }
            },
            error: function (e) {
                swal(messages + " sản phẩm thất bại", "", "error");
                console.log("error: ", e);
            }
        })
    })
}

function eidtProduct(id) {
    $("#addUserPanel").fadeIn(); // Show the panel

    localStorage.setItem("id", id);

    $(".create").hide();
    $(".update").show();

    urls = productsApiUrl + "/" + id;
    methods = 'PUT';
    messages = "Cập nhật";

    $.ajax({
        url: productsApiUrl + "/" + id,
        type: 'GET',
        dataType: "json",
        // headers: {
        //     'Authorization': 'Bearer ' + token
        // },
        success: function (response) {
            let product = response.data;
            $('#name').val(product.name);
            $('#description').val(product.description);
            $('#price').val(product.price);
            $('#categories').val(product.categories.id);

            // Hiển thị hình ảnh nếu có
            if (product.thumbnail) {
                $('#chon-anh').html('<img src="/honeyshop/images/' + product.thumbnail + '" alt="Product Image" style="width: 100%; height: 100%">');
            }
        },
        error: function (xhr, status, error) {
            alert('Failed to load product: ' + error);
        }
    });
}

function removeProduct(id) {
    swal({
        title: "Bạn có chắc muốn xóa không?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                url: productsApiUrl + "/" + id,
                method: "DELETE",
                contentType: "application/json",
                dataType: "json",
                // headers: {
                //     'Authorization': 'Bearer ' + getToken()
                // },
                success: function () {
                    $("#row_" + id).remove();
                    swal("Xóa sản phẩm thành công!", {
                        icon: "success",
                    });
                    loadData();
                },
                error: function () {
                    swal("Xóa sản phẩm thất bại!", {
                        icon: "error",
                    });
                }
            });
        }
    });
}