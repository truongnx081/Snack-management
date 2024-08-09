let productsApiUrl = "/honeyshop/api/products" ;

var currentOrderId;
$(document).ready(function() {
    $('#addUser').click(function () {
        $("#addUserPanel").fadeIn().css('z-index', 1050); // Hiển thị form addUserPanel và đảm bảo nó nổi lên trên các modal khác
    });

    $('#orderModal').on('hidden.bs.modal', function () {
        // clearCartHistory();
        $('#cartList').empty();
        $('#totalPrice').text('0 ₫');
    });

    // Nếu DataTable đã được khởi tạo, hãy hủy khởi tạo trước khi tiếp tục
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().clear().destroy();
    }

    // Khởi tạo DataTable
    const table = $('#dataTable').DataTable({
        "ajax": {
            "url": "/honeyshop/api/report", // URL của API để lấy dữ liệu
            "type": "GET",
            "dataSrc": function (json) {
                let totalRevenue = 0;

                const data = json.map((item, index) => {
                    totalRevenue += item.revenue;
                    return [
                        index + 1, // STT
                        item.userFullName,
                        item.phone,
                        // formatCurrency(item.revenue),
                        item.status,
                        item.nameEmployee,
                        formatDate(item.day),
                        `<button type="button" class="btn btn-info" onclick="editOrder('${item.id}')"><i class="fa fa-edit"></i></button>
                        <button type="button" class="btn btn-danger" onclick="removeOrder('${item.id}')"><i class="fa fa-trash"></i></button>` // Actions
                    ];
                });

                // Cập nhật tổng doanh thu
                $('#totalPrice').text(formatCurrencyVND(totalRevenue));
                loadData();

                return data;
            }
        },
        "columns": [
            { "title": "STT" },
            { "title": "Khách hàng", "width":"200px"},
            { "title": "Số điện thoại" },
            // { "title": "Doanh thu" },
            { "title": "Trạng thái" },
            { "title": "Người tạo" },
            { "title": "Thời gian" },
            { "title": "Thao tác" }
        ],
        processing: true,
        serverSide: false,
        paging: true,
        searching: true,
        ordering: true,
        info: true
    });


    // Hàm định dạng ngày tháng
    function formatDate(dateString) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            // hour12: false
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    window.editOrder = function(orderId) {
        currentOrderId = orderId;
        $('#orderModal').modal('show');
        // console.log("Order ID:", orderId);

        Promise.all([
            $.ajax({
                url: `/honeyshop/api/orders/${orderId}`,
                type: 'GET'
            }),
            $.ajax({
                url: `/honeyshop/api/orders-detail/${orderId}/details`,
                type: 'GET'
            })
        ])
            .then(function([orderResponse, orderDetailResponse]) {
                // console.log("Order Data:", orderResponse);
                // console.log("Order Detail Data:", orderDetailResponse);

                const order = orderResponse.data;
                const orderDetails = orderDetailResponse.map(detail => ({
                    id: detail.id,
                    name: detail.product.name,
                    thumbnail: detail.product.thumbnail,
                    price: detail.price,
                    quantity: detail.quantity,
                    total: detail.price*detail.quantity
                }));
                saveCartHistory(orderDetails);
                // Điền dữ liệu vào form
                $('#fullname').val(order.fullname);
                $('#phone').val(order.phone);
                $('#cartContainer').show();
                $('#cartList').empty();

                if (Array.isArray(orderDetails) && orderDetails.length) {
                    let totalPrice = 0;
                    orderDetails.forEach(function(detail) {
                        const productTotal = detail.price * detail.quantity;
                        console.log(detail.id)
                        $('#cartList').append(`
                    <tr>
                        <td>${detail.name}</td>
                        <td><img src="/honeyshop/images/${detail.thumbnail}" alt="${detail.name}" width="50"></td>
                        <td>${formatCurrencyVND(detail.price)}</td>
                         <td>
                               ${detail.quantity}
                        </td>
                        <td>${formatCurrencyVND(detail.price*detail.quantity)}</td>
                      
                    </tr>
                `);
                        totalPrice += productTotal; // Cộng dồn giá trị của các sản phẩm
                    });

                    $('#totalPrice').text(formatCurrencyVND(totalPrice));
                } else {
                    // Nếu không có sản phẩm, thêm một dòng thông báo và đặt tổng tiền về 0
                    $('#cartList').append(`
                <tr>
                    <td colspan="6" class="text-center">Không có sản phẩm trong đơn hàng.</td>
                </tr>
            `);
                    $('#totalPrice').text('0 ₫');
                }
                // Gán sự kiện cho ô nhập số lượng
                $('.quantity-input').off('input').on('input', function () {
                    const newQuantity = $(this).val();
                    const productId = $(this).data('product-id');

                    if (newQuantity < 1 || isNaN(newQuantity)) {
                        $(this).val(1);  // Đảm bảo số lượng không nhỏ hơn 1
                    } else {
                        updateCartQuantity(productId, newQuantity);
                        const price = parseFloat($(this).closest('tr').find('td:eq(2)').text().replace(/[^\d.-]/g, '')) * 1000;
                        $(this).closest('tr').find('td:eq(4)').text(formatCurrencyVND(price * newQuantity));
                    }
                });
            })
            .catch(function(error) {
                console.error("Có lỗi xảy ra khi lấy dữ liệu đơn hàng:", error);
            });
    };


    window.removeOrder = function(orderId) {
        swal({
            title: "Bạn có chắc muốn xóa không?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url: `/honeyshop/api/orders/${orderId}`,
                        method: "DELETE",
                        contentType: "application/json",
                        dataType: "json",
                        // headers: {
                        //     'Authorization': 'Bearer ' + getToken()
                        // },
                        success: function () {
                            swal("Xóa đơn đặt hàng thành công!", {
                                icon: "success",
                            });
                            $('#dataTable').DataTable().ajax.reload();
                        },
                        error: function () {
                            swal("Xóa đơn đặt hàng thất bại!", {
                                icon: "error",
                            });
                        }
                    })
                }
            });
    }


});

function loadData() {
    // Nếu DataTable đã được khởi tạo, hãy hủy khởi tạo trước khi tiếp tục
    if ($.fn.DataTable.isDataTable('#dataTable1')) {
        $('#dataTable1').DataTable().clear().destroy();
    }

    $.ajax({
        url: productsApiUrl,
        type: "GET",
        success: function(json) {
            // console.log("API response:", json);

            if (!Array.isArray(json)) {
                if (json.data && Array.isArray(json.data)) {
                    json = json.data;
                } else {
                    console.error("API response is not an array:", json);
                    json = []; // Đặt json thành mảng rỗng nếu dữ liệu không hợp lệ
                }
            }

            saveCartHistory(json);

            const data = json.map((item, index) => {
                return [
                    index + 1, // STT
                    item.name || 'N/A',
                    item.thumbnail ? `<img src="/honeyshop/images/${item.thumbnail}" data-product-img="${item.thumbnail}" alt="${item.name}" style="width:50px;height:50px;">` : 'N/A',
                    item.price ? formatCurrencyVND(item.price) : 'N/A',
                    item.categories && item.categories.name ? item.categories.name : 'N/A',
                    `<input type="checkbox" class="productCheckbox" data-product-id="${item.id}">`
                ];
            });

            $('#dataTable1').DataTable({
                data: data,
                "columns": [
                    {"title ": "STT"},
                    { "title": "Tên sản phẩm" },
                    { "title": "Hình ảnh", "orderable": false },
                    { "title": "Đơn giá" },
                    { "title": "Loại sản phẩm" },
                    // { "title": "Thao tác", "orderable": false }
                ],
                processing: true,
                serverSide: false,
                paging: true,
                searching: true,
                ordering: true,
                info: true,
            });
        },
        error: function(error) {
            console.error("Error fetching data from API:", error);
        }
    });
}

function formatCurrencyVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

$('#addToCart').click(function () {
    var selectedProducts = [];
    var cartData = localStorage.getItem('cart-history');
    var cartArray = cartData ? JSON.parse(cartData) : [];

    $('.productCheckbox:checked').each(function () {
        var $row = $(this).closest('tr');
        var productId = $(this).data('product-id');
        var productName = $row.find('td:eq(1)').text();
        var productImg = $(this).closest('tr').find('img').data('product-img');
        var productPrice = parseFloat($row.find('td:eq(3)').text().replace(/[^\d.-]/g, '')) * 1000;
        var productQuantity = 1;
        var productTotal = productPrice * productQuantity;

        // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
        var existingProductIndex = cartArray.findIndex(product => product.id === productId);

        if (existingProductIndex > -1) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng và tổng giá
            cartArray[existingProductIndex].quantity += productQuantity;
            cartArray[existingProductIndex].total += productTotal;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng mới
            var product = {
                id: productId,
                name: productName,
                thumbnail: productImg,
                price: productPrice,
                quantity: productQuantity,
                total: productTotal
            };

            selectedProducts.push(product);
        }
    });

    if (selectedProducts.length > 0) {
        cartArray = cartArray.concat(selectedProducts);
    }


    // Chuyển đổi dữ liệu thành chuỗi JSON và lưu vào localStorage
    localStorage.setItem('cart-history', JSON.stringify(cartArray));

    // Kiểm tra nội dung của localStorage
    loadCartFromLocalStorage();
    $("#addUserPanel").hide();

    swal("Thêm vào giỏ thành công", "", "success");
});






function saveCartHistory(data) {
    localStorage.setItem('cart-history', JSON.stringify(data));
}

// function loadCart() {
//     // Lấy dữ liệu giỏ hàng từ localStorage
//     let cartData = localStorage.getItem('cart-history');
//     let cartArray = cartData ? JSON.parse(cartData) : [];
//
//     // Kiểm tra nếu không có sản phẩm trong giỏ hàng
//     if (cartArray.length === 0) {
//         $('#cartList').empty().append(`
//             <tr>
//                 <td colspan="6" class="text-center">Không có sản phẩm trong đơn hàng.</td>
//             </tr>
//         `);
//         $('#totalPrice').text('0 ₫');
//         return;
//     }
//
//     // Gọi API để tải lại thông tin chi tiết đơn hàng
//     $.ajax({
//         url: `/honeyshop/api/orders/${currentOrderId}`,
//         type: 'GET',
//         success: function(orderResponse) {
//             $.ajax({
//                 url: `/honeyshop/api/orders-detail/${currentOrderId}/details`,
//                 type: 'GET',
//                 success: function(orderDetailResponse) {
//                     const order = orderResponse.data;
//                     const orderDetails = orderDetailResponse.map(detail => ({
//                         id: detail.id,
//                         name: detail.product.name,
//                         thumbnail: detail.product.thumbnail,
//                         price: detail.price,
//                         quantity: detail.quantity,
//                         total: detail.price * detail.quantity
//                     }));
//
//                     // Lưu lại dữ liệu giỏ hàng vào localStorage
//                     saveCartHistory(orderDetails);
//
//                     // Điền dữ liệu vào form
//                     $('#fullname').val(order.fullname);
//                     $('#phone').val(order.phone);
//                     $('#cartContainer').show();
//                     $('#cartList').empty();
//
//                     if (orderDetails.length) {
//                         let totalPrice = 0;
//                         orderDetails.forEach(function(detail) {
//                             const productTotal = detail.price * detail.quantity;
//                             $('#cartList').append(`
//                                 <tr>
//                                     <td>${detail.name}</td>
//                                     <td><img src="/honeyshop/images/${detail.thumbnail}" alt="${detail.name}" width="50"></td>
//                                     <td>${formatCurrencyVND(detail.price)}</td>
//                                     <td>${detail.quantity}</td>
//                                     <td>${formatCurrencyVND(detail.price * detail.quantity)}</td>
//                                     <td>
//                                         <button type="button" class="btn btn-danger" onclick="removeProductFromCart(${detail.id})" ${orderDetails.length === 1 ? 'disabled' : ''}><i class="fa fa-trash"></i></button>
//                                     </td>
//                                 </tr>
//                             `);
//                             totalPrice += productTotal;
//                         });
//                         $('#totalPrice').text(formatCurrencyVND(totalPrice));
//                     } else {
//                         $('#cartList').append(`
//                             <tr>
//                                 <td colspan="6" class="text-center">Không có sản phẩm trong đơn hàng.</td>
//                             </tr>
//                         `);
//                         $('#totalPrice').text('0 ₫');
//                     }
//                 },
//                 error: function(error) {
//                     console.error("Có lỗi xảy ra khi lấy dữ liệu chi tiết đơn hàng:", error);
//                 }
//             });
//         },
//         error: function(error) {
//             console.error("Có lỗi xảy ra khi lấy dữ liệu đơn hàng:", error);
//         }
//     });
// }


function loadCartFromLocalStorage() {
    let cartData = localStorage.getItem('cart-history');
    let cartArray = cartData ? JSON.parse(cartData) : [];

    // Kiểm tra nếu không có sản phẩm trong giỏ hàng
    if (cartArray.length === 0) {
        $('#cartList').empty().append(`
            <tr>
                <td colspan="6" class="text-center">Không có sản phẩm trong đơn hàng.</td>
            </tr>
        `);
        $('#totalPrice').text('0 ₫');
        return;
    }

    // Điền dữ liệu vào giỏ hàng
    $('#cartList').empty();
    let totalPrice = 0;

    cartArray.forEach(function(detail) {
        const productTotal = detail.price * detail.quantity;
        $('#cartList').append(`
            <tr data-product-id="${detail.id}">
                <td>${detail.name}</td>
                <td><img src="/honeyshop/images/${detail.thumbnail}" alt="${detail.name}" width="50"></td>
                <td>${formatCurrencyVND(detail.price)}</td>
                <td>
                    <input type="number" class="quantity-input" value="${detail.quantity}" min="1" step="1" data-product-id="${detail.id}" />
                </td>
                <td>${formatCurrencyVND(productTotal)}</td>
            
            </tr>
        `);
        totalPrice += productTotal;
    });

    $('#totalPrice').text(formatCurrencyVND(totalPrice));

    // Gán sự kiện thay đổi số lượng cho các ô nhập liệu
    $('.quantity-input').off('input').on('input', function () {
        const newQuantity = $(this).val();
        const productId = $(this).data('product-id');

        if (newQuantity < 1 || isNaN(newQuantity)) {
            $(this).val(1);  // Đảm bảo số lượng không nhỏ hơn 1
        } else {
            updateCartQuantity(productId, newQuantity);
            const price = parseFloat($(this).closest('tr').find('td:eq(2)').text().replace(/[^\d.-]/g, '')) * 1000;
            $(this).closest('tr').find('td:eq(4)').text(formatCurrencyVND(price * newQuantity));
        }
    });
}


// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartQuantity(productId, quantity) {
    let cartData = localStorage.getItem('cart-history');
    let cartArray = cartData ? JSON.parse(cartData) : [];

    // Cập nhật số lượng sản phẩm
    cartArray = cartArray.map(item => {
        if (item.id === productId) {
            return {...item, quantity: parseInt(quantity)};
        }
        return item;
    });

    // Lưu lại vào localStorage
    localStorage.setItem('cart-history', JSON.stringify(cartArray));

    // Cập nhật lại giá trị tổng tiền mà không làm mới bảng
    const price = cartArray.find(item => item.id === productId).price;
    const totalPrice = formatCurrencyVND(price * quantity);
    $(`tr[data-product-id="${productId}"] td:eq(4)`).text(totalPrice);

    // Cập nhật lại tổng giá của giỏ hàng
    let updatedTotalPrice = 0;
    cartArray.forEach(item => {
        updatedTotalPrice += item.price * item.quantity;
    });
    $('#totalPrice').text(formatCurrencyVND(updatedTotalPrice));
}


function removeProductFromCartOrLocal(orderDetailId) {
    console.log(orderDetailId)
    // Hiển thị thông báo xác nhận xóa
    swal({
        title: "Bạn có chắc muốn xóa không?",
        text: "Sản phẩm sẽ bị xóa khỏi giỏ hàng.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                // Thực hiện xóa sản phẩm từ DB và localStorage
                $.ajax({
                    url: `/honeyshop/api/orders-detail/${orderDetailId}`,
                    method: "DELETE",
                    contentType: "application/json",
                    dataType: "json",
                    success: function () {
                        // Xóa sản phẩm từ localStorage
                        removeProductFromCart(orderDetailId);
                        // Thông báo thành công
                        swal("Xóa sản phẩm khỏi giỏ hàng thành công!", {
                            icon: "success",
                        });
                    },
                    error: function () {
                        // Nếu xóa từ DB thất bại, chỉ xóa từ localStorage
                        removeProductFromCart(orderDetailId);
                        loadCartFromLocalStorage();
                        // Thông báo lỗi

                    },
                    complete: function () {
                        // Tải lại giỏ hàng sau khi xóa sản phẩm từ DB hoặc localStorage
                        loadCartFromLocalStorage();
                    }
                });
            } else {
                // Thông báo nếu không xóa
                swal("Sản phẩm không bị xóa.");
            }
        });
}


function removeProductFromCart(orderDetailId) {
    console.log(orderDetailId)
    // Xóa sản phẩm khỏi giỏ hàng trong localStorage
    let cartData = localStorage.getItem('cart-history');
    let cartArray = cartData ? JSON.parse(cartData) : [];

    console.log("Ccdcsd"+cartData)
    // Lọc bỏ sản phẩm với orderDetailId đã cho
    cartArray = cartArray.filter(product => product.id !== orderDetailId);

    // Cập nhật lại dữ liệu giỏ hàng trong localStorage
    localStorage.setItem('cart-history', JSON.stringify(cartArray));

    // Cập nhật lại giỏ hàng và tổng giá
    loadCartFromLocalStorage();
}






