
window.productDetailController = function ($scope, $http, $window) {


    $scope.listProductDetail= [];
    $scope.pageNo = 0;
    $scope.sizePage = 5;
    $scope.lastIndex =0; // phần tử cuối của mảng
    $scope.sizeProduct =[];
    $scope.colorProduct =[];
    $scope.materialProduct =[];
    $scope.promotionalProduct =[];
    $scope.statusProduct =[];
    $scope.Product=[];

     // Kiểm tra nếu form là form thêm mới (ví dụ: nếu không có sản phẩm trong danh sách)
    

    $scope.formProductDetail = {
        quantity: "",
        price: "",
        product: {id:""},
        material: {id:""},
        size:  {id:""},
        color: {id:""},
        promotional : {id:""},
        status : {id:""},
    };
  
    $scope.formPdDetailUpdate = {
      id: "",
      quantity: "",
      price: "",
      product: {id:""},
      material:  {id:""},
      size:  {id:""},
      color:  {id:""},
      promotional : {id:""},
      status :  {id:""},
    }
    // phân trang start
    $scope.totalPage = 0;
    $scope.pageCurrent = 0;
    $scope.itemsPerPage = 3; // Số lượng trang bạn muốn hiển thị
    
    $scope.pageRange = function () {
      var startPage = Math.max(1, $scope.pageCurrent - Math.floor($scope.itemsPerPage / 2));
      var endPage = Math.min($scope.totalPage, startPage + $scope.itemsPerPage - 1);
      var pages = [];
    
      if ($scope.pageCurrent + Math.floor($scope.itemsPerPage / 2) > $scope.totalPage) {
        startPage = Math.max(1, $scope.totalPage - $scope.itemsPerPage + 1);
        endPage = $scope.totalPage;
      }
    
      // Bắt đầu từ trang đầu tiên nếu trang hiện tại là quá giữa danh sách
      if (startPage > 1) {
        startPage = Math.max(1, startPage - 1);
      }
    
      for (var i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    
      return pages;
    };
    
    
    
    $scope.nextPage = function () {
      if ($scope.pageCurrent < $scope.totalPage - 1) {
        $scope.pageCurrent++;
        $scope.hienThi($scope.pageCurrent,$scope.sizePage);
      }
    };
    
    $scope.previousPage = function () {
      if ($scope.pageCurrent > 0) {
        $scope.pageCurrent--;
      }
        $scope.hienThi($scope.pageCurrent,$scope.sizePage);
    };
    
    $scope.hoveredPage = null;
  
    $scope.onHover = function (index) {
      $scope.hoveredPage = index;
    };
    
    $scope.onLeave = function () {
      $scope.hoveredPage = null;
    };
  
    // hàm thay đổi số phần tử của trang
    $scope.onSizePageChange = function () {
      // Làm cái gì đó với giá trị mới của sizePage
      console.log("New Size Page: " + $scope.sizePage);
      $scope.hienThi($scope.pageNo,$scope.sizePage);
      // Gọi các hàm khác cần thiết với giá trị mới của sizePage
  };
  
    
    // end phân trang
   
    $scope.hienThi = function (pageNo,sizePage) {
      let apiUrl = apiProductDetails + "?pageNo=" + pageNo+"&sizePage=" + sizePage;
      $http.get(apiUrl).then(
        function (response) {
          // Kiểm tra dữ liệu có được in ra không
          $scope.listProductDetail = response.data.productDetailList;
          $scope.totalPage = response.data.totalPages;
          $scope.lastIndex = $scope.listProductDetail[$scope.listProductDetail.length - 1].id;
          $scope.sizeProduct =response.data.sizeList;
          $scope.colorProduct =response.data.colorList;
          $scope.materialProduct =response.data.materialList;
          $scope.promotionalProduct =response.data.promotionalList;
          $scope.statusProduct =response.data.statusList;
          $scope.Product =response.data.productList;

          console.log(response.data);
          console.log(response.data.totalPages);
          
        },
        function (error) {
          console.log(error);
        }
      );
    };
    
    $scope.PageNo = function (pageNo, sizePage) {
      $scope.pageCurrent = pageNo; // Cập nhật pageCurrent khi chọn trang cụ thể
      $scope.sizePage = sizePage; // Cập nhật sizePage
      $scope.hienThi(pageNo, sizePage);
      $scope.hoveredPage = pageNo; // Truyền giá trị pageNo vào hàm hienThi
  };
  
    // Gọi hàm hienThi() để lấy dữ liệu ban đầu
    $scope.hienThi($scope.pageNo,$scope.sizePage);
    
  
    //delete data
  
    $scope.removeStaff = function (event, item) {
      event.preventDefault();
  
      console.log(item);
      let productDt = item.id;
      let api = apiProductDetails + "/delete/" + productDt;
  
      Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
      }).then((result) => {
        if (result.isConfirmed) {
          // Hành động khi người dùng ấn "Có"
          $http.delete(api).then(function (response) {
            Swal.fire('Xóa thành công!', '', 'success');
            $scope.hienThi($scope.pageCurrent,$scope.sizePage);
            console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
          $scope.hienThi($scope.pageNo);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Hành động khi người dùng ấn "Không"
          Swal.fire('Hủy bỏ', '', 'error');
        }
      });
      
    };
  
    // show form add
    $scope.showForm = false; // Mặc định ẩn form
    $scope.toggleForm = function () {
      if ($scope.showFormUpdate) {
        // Nếu form cập nhật đang mở, đóng nó trước khi mở form thêm mới
        $scope.showFormUpdate = false;
      }
      $scope.showForm = !$scope.showForm; // Khi click, đảo ngược trạng thái của form thêm mới
      $scope.formProductDetail={};
    };
    // add one product
  
    $scope.addUser = function (event) {
      event.preventDefault();
      console.log($scope.formProductDetail);
    
      Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
      }).then((result) => {
        if (result.isConfirmed) {
          $http.post(apiProductDetails + "/insert", JSON.stringify($scope.formProductDetail))
            .then(function (response) {
              console.log("Success Response:", response.data); // Assuming the data property contains the relevant information
              Swal.fire({
                icon: 'success',
                title: 'Thêm thành công!',
                text: 'Thông tin người dùng đã được thêm.'
              });
              $scope.hienThi($scope.pageCurrent, $scope.sizePage);
              $scope.formProductDetail = {};
            })
            .catch(function (error) {
              console.error("Error:", error);
              Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Đã xảy ra lỗi khi thêm người dùng. Vui lòng thử lại sau."
              });
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Hủy bỏ', '', 'error');
        }
      });
    };
    
  
  // show form user and load detail
  $scope.showFormUpdate = false;
  $scope.activeItem = -1;
  $scope.formPdDetailUpdate = {};
  
  $scope.toggleFormUpdate = function (event, item) {
    event.preventDefault();
   
    if ($scope.showForm) {
      // Nếu form thêm mới đang mở, đóng nó trước khi mở form cập nhật
      $scope.showForm = false;
    }
  
    if (item && $scope.activeItem === item && $scope.showFormUpdate) {
      // Trường hợp ấn lại dòng đã chọn và form đang hiển thị, đóng form và xóa dữ liệu
      $scope.showFormUpdate = false;
      $scope.activeItem = null;
      $scope.formPdDetailUpdate = {};
    } else if (item) {
      // Trường hợp ấn dòng khác hoặc form chưa hiển thị, hiển thị và nạp dữ liệu của dòng được chọn
      $scope.showFormUpdate = true;
      $scope.activeItem = item;
  
      // Nạp dữ liệu của dòng được chọn vào biểu mẫu
     // Nạp dữ liệu của dòng được chọn vào biểu mẫu
     $scope.formPdDetailUpdate = {
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: {id:item.product.id},
        material:  {id:item.material.id},
        size:  {id:item.size.id},
        color:  {id:item.color.id},
        promotional : {id:item.promotional.id},
        status :  {id:item.status.id},
    };
    console.log($scope.formPdDetailUpdate)
    } else {
      // Trường hợp không có đối tượng được chọn, đóng form và xóa dữ liệu
      $scope.showFormUpdate = false;
      $scope.activeItem = null;
      $scope.formPdDetailUpdate = {};
    }
  };
  
    // update
    $scope.UpdateUser = function (event) {
      event.preventDefault();
      console.log($scope.formPdDetailUpdate);
    
      Swal.fire({
        title: 'Xác nhận',
        text: 'Bạn có chắc chắn muốn thực hiện hành động này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không'
      }).then((result) => {
        if (result.isConfirmed) {
          $http.put(apiProductDetails + "/update", JSON.stringify($scope.formPdDetailUpdate))
            .then(function (response) {
              console.log("Success Response:", response.data); // Assuming the data property contains the relevant information
              Swal.fire({
                icon: 'success',
                title: 'Cập nhật thành công!',
                text: 'Thông tin người dùng đã được cập nhật.'
              });
              $scope.formPdDetailUpdate = {};
              $scope.hienThi($scope.pageCurrent, $scope.sizePage);
            })
            .catch(function (error) {
              console.error("Error:", error);
              Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Đã xảy ra lỗi khi cập nhật người dùng. Vui lòng thử lại sau."
              });
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Hủy bỏ', '', 'error');
        }
      });
    };
    
  
  // import exel
  
  $scope.importing = false; // Biến để theo dõi trạng thái của animation
  $scope.importInProgress = false; // Flag để kiểm soát quá trình import
  $scope.errorShown = false; // Flag để kiểm soát việc hiển thị lỗi
  
  $scope.import = function (files) {
    // Check if an import is already in progress
    if ($scope.importInProgress) {
      return;
    }
  
    $scope.importInProgress = true; // Set the flag to true
  
    $scope.importing = true; // Bắt đầu animation
    $scope.errorShown = false; // Reset the error flag
  
    var reader = new FileReader();
    reader.onloadend = async () => {
      try {
        var workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(reader.result);
        const worksheet = workbook.getWorksheet('Sheet1');
        worksheet.eachRow((row, index) => {
          if (index > 1) {
            let productDt = {
                    quantity: rơw.getCell(1).getValue,
                    price: rơw.getCell(2).getValue,
                    product: {id:rơw.getCell(3).getValue},
                    material:  {id:rơw.getCell(4).getValue},
                    size:  {id:rơw.getCell(5).getValue},
                    color:  {id:rơw.getCell(6).getValue},
                    promotional : {id:rơw.getCell(7).getValue},
                    status :  {id:1},
           
            };
            $http.post(apiProductDetails + "/insert", JSON.stringify(productDt))
              .then(function (response) {
                if (!$scope.errorShown) {
                  Swal.fire({
                    icon: "success",
                    title: "Ok",
                    text: "Đã import thành công",
                  });
                }
              })
              .catch(function (error) {
                if (!$scope.errorShown) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Đã xảy ra lỗi!",
                  });
                  console.log(error);
                  $scope.errorShown = true; // Set the error flag
                }
              });
          }
        });
      } catch (error) {
        if (!$scope.errorShown) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Đã xảy ra lỗi!",
          });
          console.error('Error reading file:', error);
          $scope.errorShown = true; // Set the error flag
        }
      } finally {
        $scope.importing = false; // Kết thúc animation
        $scope.importInProgress = false; // Reset the flag
        $scope.$apply(); // Cập nhật scope
        // Xóa file sau khi đã xử lý xong
        document.getElementById('input-file').value = '';
      }
    };
    reader.readAsArrayBuffer(files[0]);
    $scope.hienThi($scope.pageNo);
  };
  
  
  // sort column
  $scope.sortColumn = '';
  $scope.reverseSort = false;
  
  $scope.sortData = function (column) {
      $scope.reverseSort = ($scope.sortColumn === column) ? !$scope.reverseSort : false;
      $scope.sortColumn = column;
  };
  
  $scope.getSortClass = function (column) {
      if ($scope.sortColumn === column) {
          return $scope.reverseSort ? 'sort-down' : 'sort-up';
      }
      return 'sort-none';
  };              
  
  // export pdf
  $scope.exportToPDF = function () {
    const tableId = 'DTProductTable';
    const fileName = 'exported_data';
  
    // Tạo đối tượng jsPDF
    const pdf = new $window.jsPDF('p', 'pt', 'letter');
  
    // Thêm bảng vào PDF
    pdf.autoTable({ html: `#${tableId}` });
  
    // Tải file PDF
    pdf.save(`${fileName}.pdf`);
  };
  
  $scope.exportToExcel = function() {
    // Lấy bảng theo ID
    var table = document.getElementById('DTProductTable'); // Thay id table bảng của bạn vào đây
  
    // Lấy dữ liệu từ bảng
    var data = [];
    for (var i = 0; i < table.rows.length; i++) {
      var rowData = [];
      for (var j = 0; j < table.rows[i].cells.length; j++) {
        rowData.push(table.rows[i].cells[j].innerText);
      }
      data.push(rowData);
    }
  
    // Tạo một workbook và một worksheet
    var ws = XLSX.utils.aoa_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Xuất file Excel
    XLSX.writeFile(wb, 'exported_data.xlsx');
  };
  
  $scope.exportToSVG = function() {
    // Lấy bảng theo ID
    var table = document.getElementById('DTProductTable'); // Thay id table bảng của bạn vào đây
  
    // Tạo một đối tượng SVG
    var svg = SVG().size(2000, 1500); // Kích thước SVG
  
    // Lấy số cột của bảng
    var numColumns = table.rows.length > 0 ? table.rows[0].cells.length : 0;
  
    // Xác định chiều rộng của cột rộng nhất
    var maxWidth = 0;
    for (var i = 0; i < table.rows.length; i++) {
      var cellWidth = table.rows[i].cells[0].offsetWidth;
      maxWidth = Math.max(maxWidth, cellWidth);
    }
  
    // Thêm các đối tượng SVG từ các cột của bảng
    for (var i = 0; i < table.rows.length; i++) {
      for (var j = 0; j < table.rows[i].cells.length; j++) {
        // Tính toán vị trí dựa trên chỉ số của cột
        var xPosition = 10 + j * (maxWidth + 180); // 10 là khoảng cách giữa các cột
        var yPosition = 30 * i + 40;
  
        // Thêm văn bản từ cột của bảng vào SVG
        svg.text(table.rows[i].cells[j].innerText).move(xPosition, yPosition);
      }
    }
  
    // Xuất nội dung SVG dưới dạng chuỗi
    var svgString = svg.svg();
  
    // Xuất file SVG
    var blob = new Blob([svgString], { type: 'image/svg+xml' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'exported_svg.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  
    // thu vien jQuery không đụng vào
    (function ($) {
      "use strict";
      $(function () {
        $('[data-toggle="offcanvas"]').on("click", function () {
          $(".sidebar-offcanvas").toggleClass("active");
        });
      });
    })(jQuery);
  
    (function ($) {
      "use strict";
      $(function () {
        var body = $("body");
        var contentWrapper = $(".content-wrapper");
        var scroller = $(".container-scroller");
        var footer = $(".footer");
        var sidebar = $(".sidebar");
  
        //Add active class to nav-link based on url dynamically
        //Active class can be hard coded directly in html file also as required
  
        function addActiveClass(element) {
          if (current === "") {
            //for root url
            if (element.attr("href").indexOf("index.html") !== -1) {
              element.parents(".nav-item").last().addClass("active");
              if (element.parents(".sub-menu").length) {
                element.closest(".collapse").addClass("show");
                element.addClass("active");
              }
            }
          } else {
            //for other url
            if (element.attr("href").indexOf(current) !== -1) {
              element.parents(".nav-item").last().addClass("active");
              if (element.parents(".sub-menu").length) {
                element.closest(".collapse").addClass("show");
                element.addClass("active");
              }
              if (element.parents(".submenu-item").length) {
                element.addClass("active");
              }
            }
          }
        }
  
        $(".horizontal-menu .nav li a").each(function () {
          var $this = $(this);
          addActiveClass($this);
        });
  
        //Close other submenu in sidebar on opening any
  
        sidebar.on("show.bs.collapse", ".collapse", function () {
          sidebar.find(".collapse.show").collapse("hide");
        });
  
        //Change sidebar and content-wrapper height
        applyStyles();
  
        function applyStyles() {
          //Applying perfect scrollbar
          if (!body.hasClass("rtl")) {
            if (
              $(".settings-panel .tab-content .tab-pane.scroll-wrapper").length
            ) {
              const settingsPanelScroll = new PerfectScrollbar(
                ".settings-panel .tab-content .tab-pane.scroll-wrapper"
              );
            }
            if ($(".chats").length) {
              const chatsScroll = new PerfectScrollbar(".chats");
            }
            if (body.hasClass("sidebar-fixed")) {
              if ($("#sidebar").length) {
                var fixedSidebarScroll = new PerfectScrollbar("#sidebar .nav");
              }
            }
          }
        }
  
        $('[data-toggle="minimize"]').on("click", function () {
          if (
            body.hasClass("sidebar-toggle-display") ||
            body.hasClass("sidebar-absolute")
          ) {
            body.toggleClass("sidebar-hidden");
          } else {
            body.toggleClass("sidebar-icon-only");
          }
        });
  
        //checkbox and radios
        $(".form-check label,.form-radio label").append(
          '<i class="input-helper"></i>'
        );
  
        //Horizontal menu in mobile
        $('[data-toggle="horizontal-menu-toggle"]').on("click", function () {
          $(".horizontal-menu .bottom-navbar").toggleClass("header-toggled");
        });
        // Horizontal menu navigation in mobile menu on click
        var navItemClicked = $(".horizontal-menu .page-navigation >.nav-item");
        navItemClicked.on("click", function (event) {
          if (window.matchMedia("(max-width: 991px)").matches) {
            if (!$(this).hasClass("show-submenu")) {
              navItemClicked.removeClass("show-submenu");
            }
            $(this).toggleClass("show-submenu");
          }
        });
  
        $(window).scroll(function () {
          if (window.matchMedia("(min-width: 992px)").matches) {
            var header = $(".horizontal-menu");
            if ($(window).scrollTop() >= 70) {
              $(header).addClass("fixed-on-scroll");
            } else {
              $(header).removeClass("fixed-on-scroll");
            }
          }
        });
      });
  
      // focus input when clicking on search icon
      $("#navbar-search-icon").click(function () {
        $("#navbar-search-input").focus();
      });
    })(jQuery);
  
    (function ($) {
      "use strict";
      $(function () {
        $(".nav-settings").on("click", function () {
          $("#right-sidebar").toggleClass("open");
        });
        $(".settings-close").on("click", function () {
          $("#right-sidebar,#theme-settings").removeClass("open");
        });
  
        $("#settings-trigger").on("click", function () {
          $("#theme-settings").toggleClass("open");
        });
  
        //background constants
        var navbar_classes =
          "navbar-danger navbar-success navbar-warning navbar-dark navbar-light navbar-primary navbar-info navbar-pink";
        var sidebar_classes = "sidebar-light sidebar-dark";
        var $body = $("body");
  
        //sidebar backgrounds
        $("#sidebar-light-theme").on("click", function () {
          $body.removeClass(sidebar_classes);
          $body.addClass("sidebar-light");
          $(".sidebar-bg-options").removeClass("selected");
          $(this).addClass("selected");
        });
        $("#sidebar-dark-theme").on("click", function () {
          $body.removeClass(sidebar_classes);
          $body.addClass("sidebar-dark");
          $(".sidebar-bg-options").removeClass("selected");
          $(this).addClass("selected");
        });
  
        //Navbar Backgrounds
        $(".tiles.primary").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".navbar").addClass("navbar-primary");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
        $(".tiles.success").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".navbar").addClass("navbar-success");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
        $(".tiles.warning").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".navbar").addClass("navbar-warning");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
        $(".tiles.danger").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".navbar").addClass("navbar-danger");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
        $(".tiles.light").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".navbar").addClass("navbar-light");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
        $(".tiles.info").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".navbar").addClass("navbar-info");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
        $(".tiles.dark").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".navbar").addClass("navbar-dark");
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
        $(".tiles.default").on("click", function () {
          $(".navbar").removeClass(navbar_classes);
          $(".tiles").removeClass("selected");
          $(this).addClass("selected");
        });
      });
    })(jQuery);
  
    (function ($) {
      "use strict";
      //Open submenu on hover in compact sidebar mode and horizontal menu mode
      $(document).on(
        "mouseenter mouseleave",
        ".sidebar .nav-item",
        function (ev) {
          var body = $("body");
          var sidebarIconOnly = body.hasClass("sidebar-icon-only");
          var sidebarFixed = body.hasClass("sidebar-fixed");
          if (!("ontouchstart" in document.documentElement)) {
            if (sidebarIconOnly) {
              if (sidebarFixed) {
                if (ev.type === "mouseenter") {
                  body.removeClass("sidebar-icon-only");
                }
              } else {
                var $menuItem = $(this);
                if (ev.type === "mouseenter") {
                  $menuItem.addClass("hover-open");
                } else {
                  $menuItem.removeClass("hover-open");
                }
              }
            }
          }
        }
      );
    })(jQuery);
  
    (function ($) {
      showSwal = function (type) {
        "use strict";
        if (type === "basic") {
          swal({
            text: "Any fool can use a computer",
            button: {
              text: "OK",
              value: true,
              visible: true,
              className: "btn btn-primary",
            },
          });
        } else if (type === "title-and-text") {
          swal({
            title: "Read the alert!",
            text: "Click OK to close this alert",
            button: {
              text: "OK",
              value: true,
              visible: true,
              className: "btn btn-primary",
            },
          });
        } else if (type === "success-message") {
          swal({
            title: "Congratulations!",
            text: "You entered the correct answer",
            icon: "success",
            button: {
              text: "Continue",
              value: true,
              visible: true,
              className: "btn btn-primary",
            },
          });
        } else if (type === "auto-close") {
          swal({
            title: "Auto close alert!",
            text: "I will close in 2 seconds.",
            timer: 2000,
            button: false,
          }).then(
            function () {},
            // handling the promise rejection
            function (dismiss) {
              if (dismiss === "timer") {
                console.log("I was closed by the timer");
              }
            }
          );
        } else if (type === "warning-message-and-cancel") {
          swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3f51b5",
            cancelButtonColor: "#ff4081",
            confirmButtonText: "Great ",
            buttons: {
              cancel: {
                text: "Cancel",
                value: null,
                visible: true,
                className: "btn btn-danger",
                closeModal: true,
              },
              confirm: {
                text: "OK",
                value: true,
                visible: true,
                className: "btn btn-primary",
                closeModal: true,
              },
            },
          });
        } else if (type === "custom-html") {
          swal({
            content: {
              element: "input",
              attributes: {
                placeholder: "Type your password",
                type: "password",
                class: "form-control",
              },
            },
            button: {
              text: "OK",
              value: true,
              visible: true,
              className: "btn btn-primary",
            },
          });
        }
      };
    })(jQuery);
  
    (function ($) {
      "use strict";
      if ($(".grid").length) {
        var colcade = new Colcade(".grid", {
          columns: ".grid-col",
          items: ".grid-item",
        });
      }
    })(jQuery);
  
  
    (function ($) {
      "use strict";
      //Open submenu on hover in compact sidebar mode and horizontal menu mode
      $(document).on(
        "mouseenter mouseleave",
        ".sidebar .nav-item",
        function (ev) {
          var body = $("body");
          var sidebarIconOnly = body.hasClass("sidebar-icon-only");
          var sidebarFixed = body.hasClass("sidebar-fixed");
          if (!("ontouchstart" in document.documentElement)) {
            if (sidebarIconOnly) {
              if (sidebarFixed) {
                if (ev.type === "mouseenter") {
                  body.removeClass("sidebar-icon-only");
                }
              } else {
                var $menuItem = $(this);
                if (ev.type === "mouseenter") {
                  $menuItem.addClass("hover-open");
                } else {
                  $menuItem.removeClass("hover-open");
                }
              }
            }
          }
        }
      );
    })(jQuery);
  };
  