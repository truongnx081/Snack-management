let productsApiUrl = "/honeyshop/api/products" ;

$(document).ready(function () {
    loadCart();
    loadData();

    $("#dat-hang").click(function () {
        $("#formPay").fadeIn(); // Show the panel
        loadPay();
    });

    $("#closePanel").click(function () {
        $("#formPay").fadeOut(); // Hide the panel
    });

    // Optionally close the panel when clicking outside of it
    $(window).click(function (event) {
        if (event.target.id === "formPay") {
            $("#formPay").fadeOut(); // Hide the panel
        }
    });

    $(document).on('click', '.up', function () {
        let inputElement = $(this).closest('.col-md-4').prev().find('.quantity-input');
        let newValue = parseInt(inputElement.val()) + 1;
        inputElement.val(newValue);
        // Cập nhật tổng tiền và dữ liệu trong localStorage
        updateTotalAndLocalStorage(inputElement.data('product-id'), newValue);
    });

    $(document).on('click', '.down', function () {
        let inputElement = $(this).closest('.col-md-4').prev().find('.quantity-input');
        let newValue = parseInt(inputElement.val()) - 1;
        if (newValue >= parseInt(inputElement.attr('min'))) {
            inputElement.val(newValue);
            // Cập nhật tổng tiền và dữ liệu trong localStorage
            updateTotalAndLocalStorage(inputElement.data('product-id'), newValue);
        }
    });
})

function updateTotalAndLocalStorage(productId, newQuantity) {
    // Cập nhật giá trị số lượng trong giao diện
    let price = parseFloat($("#row_" + productId + " td[data-product-price-cart]").data('product-price-cart'));
    let newTotal = price * newQuantity;
    $("#row_" + productId + " td[data-product-price-total]").html(formatCurrencyVND(newTotal));

    // Cập nhật tổng tiền chung
    let total = 0;
    $(".quantity-input").each(function () {
        let quantity = parseInt($(this).val());
        let price = parseFloat($(this).closest("tr").find("td[data-product-price-cart]").data('product-price-cart'));
        total += quantity * price;
    });
    $("#totalPrice").html(formatCurrencyVND(total));

    // Cập nhật lại localStorage
    updateLocalStorage();
}

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
//                         <tr id = 'row_${product.id}' class="odd">
//                             <td class="sorting_1">${index + 1}</td>
//                             <td>${product.name}</td>
//                             <td>
//                                 <img src = "/honeyshop/images/${product.thumbnail}" alt="Hình ảnh"
//                                 style="width: 50px; height: 50px" data-product-img="${product.thumbnail}">
//                             </td>
//                             <td data-product-price="${product.price}">
//                                 ${formatCurrencyVND(product.price)}
//                             </td>
//                             <td>${product.categories.name}</td>
//                             <td style="text-align: center; width: 30px; height: 30px">
//                                 <input type="checkbox" class="productCheckbox" data-product-id="${product.id}">
//                             </td>
//                         </tr>
//                             `;
//                     $("#dssp").html(row);
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
                // In ra dữ liệu trả về từ API để kiểm tra
                console.log("API response:", json);

                // Kiểm tra nếu dữ liệu trả về không phải là mảng
                if (!Array.isArray(json)) {
                    if (json.data && Array.isArray(json.data)) {
                        json = json.data;
                    } else {
                        console.error("API response is not an array:", json);
                        return [];
                    }
                }

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
}

// add to cart
$('#addToCart').click(function () {
    var selectedProducts = [];

    // Lấy dữ liệu hiện có từ localStorage
    var cartData = localStorage.getItem('cart');

    // Nếu có dữ liệu, chuyển đổi từ JSON sang mảng, nếu không thì tạo mảng mới
    var cartArray = cartData ? JSON.parse(cartData) : [];

    // Loop through each checkbox to check if it's checked
    $('.productCheckbox:checked').each(function () {
        // var productId = $(this).data('product-id');
        // var productName = $(this).closest('tr').find('td:eq(1)').text();
        // var productImg = $(this).closest('tr').find('img').data('product-img');
        // var productPrice = parseFloat($(this).closest('tr').find('td[data-product-price]').data('product-price'));
        // var productQuantity = 1;
        // var productTotal = productPrice * productQuantity;

        var $row = $(this).closest('tr'); // Lấy hàng chứa checkbox này
        var productId = $(this).data('product-id');
        var productName = $row.find('td:eq(1)').text();
        var productImg = $(this).closest('tr').find('img').data('product-img'); // Sử dụng data-product-img để lấy đường dẫn hình ảnh
        var productPrice = parseFloat($row.find('td:eq(3)').text().replace(/[^\d.-]/g, '')) * 1000; // Lấy giá từ cột thứ 4 và loại bỏ ký hiệu tiền tệ
        var productQuantity = 1; // Số lượng sản phẩm mặc định là 1
        var productTotal = productPrice * productQuantity;

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        var productExists = cartArray.some(function (product) {
            return product.id === productId;
        });

        if (!productExists) {
            // Create an object for the selected product
            var product = {
                id: productId,
                name: productName,
                thumbnail: productImg,
                price: productPrice,
                quantity: productQuantity,
                total: productTotal
            };

            // Add the product to selectedProducts array
            selectedProducts.push(product);
        }
    });

    // Thêm các sản phẩm mới vào mảng hiện có
    cartArray = cartArray.concat(selectedProducts);

    // Save selected products to localStorage
    localStorage.setItem('cart', JSON.stringify(cartArray));

    // Load lại giỏ hàng
    loadCart();

    // Reset lại tất cả các checkbox
    $('.productCheckbox').prop('checked', false);
    // Optionally, display a confirmation or update UI
    $("#addUserPanel").fadeOut();

    swal("Thêm vào giỏ thành công", "", "success");

});

// Load cart
function loadCart() {
    let carts = JSON.parse(localStorage.getItem("cart")); // Lấy danh sách data
    let row = '';
    let total = 0;

    if (Array.isArray(carts) && carts.length > 0) {
        carts.forEach(function (cart) {
            let rowTotal = cart.quantity * cart.price; // Tính tổng tiền của từng hàng
            total += rowTotal; // Cộng vào tổng tiền chung

            row += `
                <tr id="row_${cart.id}" class="odd">
                    <td>${cart.name}</td>
                    <td>
                        <img src="/honeyshop/images/${cart.thumbnail}" alt="Hình ảnh"
                            style="width: 50px; height: 50px" data-product-img-cart="${cart.thumbnail}">
                    </td>
                    <td data-product-price-cart="${cart.price}">
                        ${formatCurrencyVND(cart.price)}
                    </td>
                    <td class="row">
                        <div class="col-md-8">
                            <input type="number" class="quantity-input col-md-12" value="${cart.quantity}"
                                data-product-id="${cart.id}" min="1" readonly>
                        </div>
                        <div class="col-md-4">
                            <div class="col-md-12 up"><i class='fas fa-caret-up'></i></div>
                            <div class="col-md-12 down"><i class='fas fa-caret-down'></i></div>
                        </div>
                         
                    </td>
                    <td data-product-price-total="${rowTotal}">
                        ${formatCurrencyVND(rowTotal)}
                    </td>
                    <td style="text-align: center">
                        <button type="button" class="btn btn-danger" onclick='removeFromCart("${cart.id}")'>
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Cập nhật DOM một lần duy nhất sau khi xây dựng xong chuỗi HTML
        $("#cartList").html(row);
        $("#totalPrice").html(formatCurrencyVND(total));

        // Bắt sự kiện thay đổi số lượng và tính lại tổng tiền khi số lượng thay đổi
        // $(".quantity-input").on("change", function () {
        //     let productId = $(this).data("product-id");
        //     let newQuantity = parseInt($(this).val());
        //     var productPrice = parseFloat($(this).closest('tr').find('td[data-product-price-cart]').data('product-price-cart'));
        //     let newTotal = newQuantity * productPrice;
        //     $("#row_" + productId + " td[data-product-price-total]").html(formatCurrencyVND(newTotal));

        //     // Cập nhật lại tổng tiền chung
        //     total = 0;
        //     $(".quantity-input").each(function () {
        //         let quantity = parseInt($(this).val());
        //         let price = parseFloat($(this).closest("tr").find("td[data-product-price-cart]").data('product-price-cart'));
        //         total += quantity * price;
        //     });
        //     $("#totalPrice").html(formatCurrencyVND(total));

        //     // Cập nhật lại localStorage nếu cần thiết
        //     updateLocalStorage();
        // });
    } else {
        // Xử lý khi giỏ hàng trống
        $("#cartList").html('<p>Giỏ hàng của bạn trống.</p>');
        $("#totalPrice").html(formatCurrencyVND(total)); // Nếu không có sản phẩm, total vẫn là 0
    }
}

function updateLocalStorage() {
    let carts = []; // Khởi tạo một mảng rỗng để lưu trữ giỏ hàng mới

    // Lặp qua từng hàng trong bảng giỏ hàng để lấy thông tin sản phẩm và số lượng
    $("#cartList tr").each(function () {
        let productId = $(this).attr("id").replace("row_", ""); // Lấy productId từ id của hàng
        let productName = $(this).find("td:nth-child(1)").text(); // Lấy tên sản phẩm
        let thumbnail = $(this).find("td:nth-child(2) img").attr("src").split('/').pop(); // Lấy tên hình ảnh
        let price = parseFloat($(this).find("td:nth-child(3)").data("product-price-cart")); // Lấy giá sản phẩm
        let quantity = parseInt($(this).find(".quantity-input").val()); // Lấy số lượng sản phẩm
        let total = parseFloat($(this).find("td:nth-child(5)").data("product-price-total")); // Lấy tổng tiền của sản phẩm

        // Tạo đối tượng sản phẩm và thêm vào mảng giỏ hàng
        carts.push({
            id: productId,
            name: productName,
            thumbnail: thumbnail,
            price: price,
            quantity: quantity,
            total: total
        });
    });

    // Lưu mảng giỏ hàng vào localStorage
    localStorage.setItem("cart", JSON.stringify(carts));
}

// xóa sản phẩm khỏi cart
function removeFromCart(productId) {
    swal({
        title: "Bạn có chắc muốn xóa không?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            // Lấy dữ liệu từ localStorage
            var cartData = localStorage.getItem('cart');
            console.log(cartData)

            // Chuyển đổi dữ liệu từ JSON sang mảng
            var cartArray = JSON.parse(cartData);

            // Tìm và loại bỏ sản phẩm có ID cụ thể
            cartArray = cartArray.filter(function (product) {
                return product.id !== productId;
            });

            // Chuyển đổi mảng thành JSON và lưu lại vào localStorage
            localStorage.setItem('cart', JSON.stringify(cartArray));

            // Load lại giỏ hàng
            loadCart();

            // Kiểm tra nếu giỏ hàng trống, xóa hoặc cập nhật giao diện tương ứng
            if (cartArray.length === 0) {
                // Xóa giao diện giỏ hàng hoặc hiển thị thông báo giỏ hàng trống
                $('#cartTable').html('<p>Giỏ hàng của bạn trống.</p>');
            }

            // Tùy chọn, hiển thị thông báo xác nhận hoặc cập nhật giao diện người dùng
            swal("Xóa sản phẩm thành công!", "", "success");
        }
    });
}

// Load pay
function loadPay() {
    let carts = JSON.parse(localStorage.getItem("cart")); // Lấy danh sách data
    let total = 0;
    let row = '';

    if (Array.isArray(carts) && carts.length > 0) {
        carts.forEach(function (cart) {
            let rowTotal = cart.quantity * cart.price; // Tính tổng tiền của từng hàng
            total += rowTotal; // Cộng vào tổng tiền chung

            row += `
                <tr id="row_${cart.id}" class="odd">
                    <td>${cart.name}</td>
                    <td>
                        <img src="/honeyshop/images/${cart.thumbnail}" alt="Hình ảnh"
                            style="width: 50px; height: 50px" data-product-img-cart="${cart.thumbnail}">
                    </td>
                    <td data-product-price-cart="${cart.price}">
                        ${formatCurrencyVND(cart.price)}
                    </td>
                    <td >
                        ${cart.quantity}
                    </td>
                    <td data-product-price-total="${rowTotal}">
                        ${formatCurrencyVND(rowTotal)}
                    </td>
                </tr>
            `;
        });

        //Load hóa đơn
        $("#dsdh").html(row);
        $("#total").html(formatCurrencyVND(total));
    } else {
        //Load hóa đơn
        $("#dsdh").html('<p>Giỏ hàng của bạn trống.</p>');
        $("#total").html(formatCurrencyVND(total));
    }
}

// create and cancel the bill
function createTheBill(status, messages) {
    // Gỡ bỏ các sự kiện submit đã gán trước đó
    $("#thanh-toan").off('submit');
    let total = 0;
    var selectedProducts = [];
    let carts = JSON.parse(localStorage.getItem("cart")); // Lấy danh sách data

    if (Array.isArray(carts) && carts.length > 0) {
        carts.forEach(function (cart) {
            let rowTotal = cart.quantity * cart.price; // Tính tổng tiền của từng hàng
            total += rowTotal; // Cộng vào tổng tiền chung

            var product = {
                productId: cart.id,
                quantity: cart.quantity,
                price: cart.price
            }
            selectedProducts.push(product);
        });
    }

    let order = {
        fullname: $("#fullname").val(),
        phone: $("#phone").val(),
        gender: $('input[name="gender"]:checked').val(),
        age: Number.parseInt($("#age").val()),
        totalAmount: total,
        status: status,
        orderDetails: selectedProducts
    }

    $.ajax({
        url: '/honeyshop/api/orders',
        method: 'POST',
        data: JSON.stringify(order),
        dataType: 'json',
        contentType: 'application/json',
        // headers: {
        //     'Authorization': 'Bearer ' + token
        // },
        success: function (response) {
            console.log(response)
            if (response.code === 1000) {
                swal(messages + " thành công", "", "success");
                localStorage.removeItem('cart');
                loadCart();
                loadPay();
                $("#formPay").fadeOut();
                $("#form_order")[0].reset();
            } else {
                swal(messages + " thất bại", response.messages, "error");
            }
        },
        error: function (e) {
            swal(messages + " thất bại", "", "error");
            console.log("error: ", e);
        }
    })
}

function removeTheCart() {
    swal({
        title: "Bạn có chắc muốn xóa không?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            swal("Xóa giỏ hàng thành công", "", "success");
            localStorage.removeItem('cart');
            loadCart();
            loadPay();
        }
    });
}