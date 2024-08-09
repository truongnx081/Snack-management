var ApigetUser = "/honeyshop/api/users";
var ApideleteUser = "/honeyshop/api/users/"
$(document).ready(function () {
    loadUser();
    $("#addUser").click(function () {
        resetForm(); // Reset form khi thêm mới người dùng
        $('#addUserPanel').show();
        $('#password').val('');
    });

    // Cập nhật form submit để xử lý cả insert và update
    $("#form_create_user").submit(function (event) {
        event.preventDefault();
        saveUser();
    });
});
function resetForm() {
    $('#form_create_user')[0].reset();
    $('#email').prop('disabled', false);
    $('#save').data('user-id', null);
    $('#save').data('old-password', null);
    $('#roles').prop('disabled', true); // Vô hiệu hóa trường roles
    $('#chon-anh').empty();
    $('#img').val('');  // Xóa ảnh đã chọn trong input file
}

// function loadUser() {
//     $.ajax({
//         url: ApigetUser,
//         method: "GET",
//         contentType: "application/json",
//         dataType: "json",
//
//         success: function (response) {
//
//             let users = response.data;
//             $("#userTableBody").empty();
//             let userRow = '';
//             if (Array.isArray(users)) {
//                 users.forEach(function (user, index) {
//                     var roleName = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0].name : "N/A";
//
//                     var userRow = `
//                               <tr id = 'userrow_${user.id}'>
//                                 <td>${index + 1}</td>
//                                 <td>${user.fullname}</td>
//                                 <td><img src="/honeyshop/images/${user.thumbnail}" alt="Avatar" width="60" height="60"></td>
//                                 <td>${user.gender ? 'Nam' : 'Nữ'}</td>
//                                 <td>
//                                     ${(roleName === 'ADMIN') ? 'ADMIN' : ((roleName === 'STAFF') ? 'Nhân viên' : 'Khách hàng')}
//                                 </td>
//                                 <td>
//                                     <button
//                                         type="button" id="editUser"
//                                         class="btn btn-info"
//                                         onclick="editUser('${user.id}')">
//                                         <i class="fa fa-edit"></i>
//                                     </button>
//                                     <button
//                                         type="button"
//                                         class="btn btn-danger"
//                                         data-toggle="modal"
//                                         onclick="removeUser('${user.id}')">
//                                         <i class="fa fa-trash"></i>
//                                     </button>
//
//                                 </td>
//                             </tr>`;
//                     $("#userTableBody").append(userRow);
//                 });
//             } else {
//                 console.error("Response không phải là một mảng");
//             }
//         },
//         error: function (error) {
//             console.error("There was an error loading the user data: ", error);
//         }
//     });
// }

function loadUser() {
    // Xóa DataTable cũ nếu tồn tại
    if ($.fn.DataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
        $('#userTableBody').empty();
    }
    var table =$('#dataTable').DataTable({
        "ajax": {
            "url": ApigetUser,
            "type": "GET",
            "dataType": "json",
            "dataSrc": function(json) {
                // Log dữ liệu để kiểm tra
                console.log("Dữ liệu phản hồi từ API:", json);

                // Kiểm tra cấu trúc dữ liệu trả về
                if (!json.data || !Array.isArray(json.data)) {
                    console.error("Dữ liệu API không có thuộc tính 'data' hoặc không phải là một mảng.");
                    return [];
                }

                let users = json.data;
                let totalUser = users.length;
                $('#totalUser').text(totalUser);
                // Xử lý dữ liệu cho DataTable
                return users.map(function(user, index) {
                    totalUser +=totalUser;
                    var roleName = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0].name : "N/A";
                    // if (roleName === "STAFF") {
                    //     roleName = "Nhân viên";
                    // } else if (roleName === "CUSTOMER") {
                    //     roleName = "Khách hàng";
                    // }
                    // else  roleName = "ADMIN";
                    return [
                        index + 1,
                        user.fullname,
                        `<img src="/honeyshop/images/${user.thumbnail}" alt="Avatar" width="60" height="60">`,
                        user.gender ? 'Nam' : 'Nữ',
                        (roleName === 'ADMIN') ? 'ADMIN' : ((roleName === 'STAFF') ? 'Nhân viên' : 'Khách hàng'),
                        `<button type="button" class="btn btn-info" onclick="editUser('${user.id}')"><i class="fa fa-edit"></i></button>
                                 <button type="button" class="btn btn-danger" data-toggle="modal" onclick="removeUser('${user.id}')"><i class="fa fa-trash"></button>` // Actions
                    ];
                });

            },
            error: function(xhr, status, error) {
                console.error("Có lỗi xảy ra khi gọi API:", status, error);
            }
        },
        "columns": [
            { "title": "STT" },
            { "title": "Họ và tên" },
            { "title": "Avatar" },
            { "title": "Giới tính" },
            { "title": "Vai trò" },
            { "title": "Thao tác" }
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
        $('#totalUser').text(info.recordsDisplay);
    });
}

function removeUser(id) {
    console.log(`removeUser function called with ID ${id}`);
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
                    url: ApideleteUser + id,
                    method: "DELETE",
                    contentType: "application/json",
                    dataType: "json",
                    // headers: {
                    //     'Authorization': 'Bearer ' + getToken()
                    // },
                    success: function () {
                        $("#userrow_" + id).remove();
                        // swal("Xóa người dùng thành công!", {
                        //     icon: "success",
                        // });
                        showToast("Xóa người dùng thành công!");
                        loadUser();
                    },
                    error: function () {
                        swal("Xóa người dùng thất bại!", {
                            icon: "error",
                        });
                    }
                })
            }
        });
}


function editUser(id) {
    $(".create").hide();
    $(".update").show();
    $('#password').val('password');

    $.ajax({
        url: "/honeyshop/api/users/" + id,
        method: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            let user = response.data;

            $('#fullname').val(user.fullname);
            $('#email').val(user.email).prop('disabled', true);
            $('#phone').val(user.phone);
            $('#address').val(user.address);
            $('#birthday').val(user.dob);
            $('input[name="gender"][value="' + (user.gender ? 'true' : 'false') + '"]').prop('checked', true);
            $('#roles').val(user.roles[0].name);
            $('#roles').prop('disabled', false);
            if (user.thumbnail) {
                $('#chon-anh').html(`<img src="/honeyshop/images/${user.thumbnail}" alt="Avatar" width="100" height="100">`); // Hiển thị ảnh nếu có
            } else {
                $('#chon-anh').empty(); // Xóa ảnh nếu không có
            }

            $('#save').data('user-id', id);
            $('#save').data('old-password', user.password);

            $('#addUserPanel').show(); // Hiển thị form nếu nó bị ẩn
        },
        error: function (error) {
            console.error("Có lỗi xảy ra khi tải dữ liệu người dùng: ", error);
        }
    });
}
function saveUser() {

    let formData = new FormData(document.getElementById('form_create_user'));
    let user = {
        fullname: $("#fullname").val(),
        // email: $("#email").val(),
        password: $('#password').val(),
        phone: $("#phone").val(),
        dob: $("#birthday").val(),
        address: $("#address").val(),
        gender: $('input[name="gender"]:checked').val(),
        roles: $('#roles').val()
    };

    if (user.roles && !Array.isArray(user.roles)) {
        user.roles = [user.roles];
    }

    // Thêm email nếu là thêm mới người dùng
    let userId = $('#save').data('user-id');
    if (!userId) {
        user.email = $("#email").val();
    }

    formData.append('data', new Blob([JSON.stringify(user)], { type: 'application/json' }));

    let fileInput = document.getElementById('img');
    if (fileInput.files.length > 0) {
        formData.append('img', fileInput.files[0]);
    }

    if (userId) {
        if (validationPassword()) {
            $.ajax({
                url: ApideleteUser + userId,
                method: "PUT",
                data: formData,

                processData: false, // Prevent jQuery from automatically transforming the data into a query string
                contentType: false,  // Chuyển đổi dữ liệu người dùng thành JSON
                success: function (response) {
                    // swal("Cập nhật người dùng thành công", "", "success");
                    showToast("Cập nhật người dùng thành công!");
                    loadUser();
                    $('#addUserPanel').hide();
                },
                error: function (e) {
                    console.error("Lỗi khi cập nhật người dùng: ", e);
                    swal("Cập nhật người dùng thất bại", "", "error");
                    // showToast("Cập nhật người dùng thất bại!");
                }
            });
        }
        else
            console.log("error: bị lỗi");
    } else {
        if (validationEmail() && validationPassword()) {
            $.ajax({
                url: ApigetUser,
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    // swal("Thêm người dùng thành công", "", "success");
                    showToast("Thêm người dùng thành công!");
                    $("#form_create_user")[0].reset();
                    loadUser();
                    $('#addUserPanel').hide();
                },
                error: function (xhr, status, error) {
                    console.error("Lỗi khi thêm người dùng: ", {
                        status: status,
                        error: error,
                        responseText: xhr.responseText,
                        responseJSON: xhr.responseJSON
                    });
                    swal("Thêm người dùng thất bại", `Lỗi: ${xhr.responseJSON.message}`, "error");
                }
            });
        }
        else
            console.log("error: bị lỗi");
    }

}


let textPassword;
let textEmail;
let emailPattern = /^\w+@\w+(\.\w{2,4}){1,2}$/;

function validationEmail() {
    let email = $("#email").val();

    if (email === '') {
        textEmail = "Vui lòng nhập email!";
        $("#textEmail").html(textEmail);
    }
    else if (email) {
        if (!emailPattern.test(email)) {
            textEmail = "Email không hợp lệ!";
            $("#textEmail").html(textEmail);
        }
        else {
            $.ajax({
                url: '/honeyshop/api/users/check-email/' + email,
                method: 'GET',
                dataType: 'json',
                contentType: "application/json",
                // data: { username: username },
                // headers: {
                //     'Authorization': 'Bearer ' + token
                // },
                success: function (response) {
                    let result = response.data;
                    if (result) {
                        textEmail = "Email này đã tồn tại!";
                    } else
                        textEmail = '';
                    $("#textEmail").html(textEmail);
                },
                error: function (e) {
                    console.log("error: ", e);
                }
            })
        }
    }
    return textEmail === '';
}

function validationPassword() {
    let password = $("#password").val();

    if (password === '') {
        textPassword = "Vui lòng nhập mật khẩu!";
    }
    else if (password.length < 5) {
        textPassword = "Mật khẩu phải có ít nhất 5 ký tự";
    }
    else
        textPassword = '';
    $("#textPassword").html(textPassword);
    return textPassword === '';
}