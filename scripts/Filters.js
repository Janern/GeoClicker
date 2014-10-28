angular.module('peanutsFilter', []).filter('peanutsCurrency', function () {
    return function (input, decimals) {
        return '' + (input / 80000).toFixed(decimals);
    };
});
angular.module('henvendelseFilter', []).filter('henvendelseNumber', function () {
    return function (input, decimals) {
        return Math.floor(input).toFixed(decimals);
    };
});