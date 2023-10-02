let host = "http://localhost:8080/CodeWalkers";
const app = angular.module("app", ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/home", {
            templateUrl: "page/home.html",
            controller: "LayOutController"
        })
        .when("/product-detail/:productId", {
            templateUrl: "page/detail.html",
            controller: "DetailController"
        })
        .when("/cart", {
            templateUrl: "page/cart-item.html",
            controller: "CartController"
        })
        .when("/payment", {
            templateUrl: "page/payment.html",
            controller: "LayOutController"
        })
        .when("/product", {
            templateUrl: "page/product.html",
            controller: "ProductController"
        })
})
app.controller("LayOutController", function ($scope, $http, $routeParams, $location, $anchorScroll) {
    // Logic của controller ở đây
    $anchorScroll("pageContent");
    $scope.items = [];
    $scope.itemsBs = [];
    $scope.loadAllPrBs = function () {
        var url = `${host}/api/product_bs`;
        $http.get(url).then(res => {
            $scope.itemsBs = res.data;
            console.log(res.data);
            console.log("Success", res);
            // Gọi loadDetail sau khi tải dữ liệu thành công
            $scope.loadDetail();
            $scope.numVisibleItems = 4;
        }).catch(error => {
            console.log("Error", error);
        });
    }
    $scope.loadAllPrBs();
});
app.filter('vndCurrency', function () {
    return function (input) {
        if (!input) return '';
        return input.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };
});
