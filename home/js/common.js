function showPleaseWait() {
    Swal.fire({
        title: "Vui lòng đợi trong giây lát...",
        text: 'Đang xử lý...',
        showClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        }
    });
}