(function () {
    var app = angular.module("geoClicker", ['peanutsFilter', 'henvendelseFilter']);
    app.controller("IncrementalCtrl", function ($rootScope) {
        $rootScope.henvendelseBaseRate = 1;
        $rootScope.graveskadeBaseRate = 0.1;
        $rootScope.paavisningBaseRate = 0.5;
        $rootScope.geoCash = 0;
        $rootScope.behandledeHenvendelser = 0;
        $rootScope.ubehandledeHenvendelser = 0;
        $rootScope.henvendelsePris = 10;
        $rootScope.behandledeGraveskader = 0;
        $rootScope.ubehandledeGraveskader = 0;
        $rootScope.graveskadePris = 10;
        $rootScope.behandledePaavisninger = 0;
        $rootScope.ubehandledePaavisninger = 0;
        $rootScope.paavisningPris = 10;

        $rootScope.tjenPenger = function (antall) {
            $rootScope.geoCash += antall;
        };
        $rootScope.brukPenger = function (antall) {
            $rootScope.geoCash -= antall;
        };

        $rootScope.erTomForCash = function () {
            return $rootScope.geoCash <= 0;
        };

        $rootScope.harRaad = function (kostnad) {
            return $rootScope.geoCash >= kostnad;
        }

    });

    app.controller("TabCtrl", function () {
        this.tab = 1;

        this.isSet = function (tab) {
            return this.tab === tab;
        };

        this.setTab = function (tab) {
            this.tab = tab;
        };
    });

    app.controller("InquiriesCtrl", function ($rootScope, $scope, $interval) {
        $scope.antallSaksbehandlere = 0;
        $scope.saksbehandlerRate = 1;
        $scope.saksbehandlerKostnad = 100;
        $scope.saksbehandlerKostnadsfaktor = 1.1;
        $scope.saksbehandlerLonnsavgift = 2;

        $scope.antallErfarneSaksbehandlere = 0;
        $scope.erfarenSaksbehandlerRate = 5;
        $scope.erfarenSaksbehandlerKostnad = 250;
        $scope.erfarenSaksbehandlerKostnadsfaktor = 1.2;
        $scope.erfarenSaksbehandlerLonnsavgift = 10;

        $scope.behandleHenvendelser = function (antall) {
            if (Math.floor($rootScope.ubehandledeHenvendelser) >= antall) {
                for (var i = 0; i < antall; i++) {
                    $scope.behandleHenvendelse();
                }
            } else if (Math.floor($rootScope.ubehandledeHenvendelser) > 0) {
                for (i = 0; i < Math.floor($rootScope.ubehandledeHenvendelser); i++) {
                    $scope.behandleHenvendelse();
                }
            }
        };

        $scope.behandleHenvendelse = function () {
            $rootScope.ubehandledeHenvendelser--;
            $rootScope.behandledeHenvendelser++;
            if (Math.random() < $rootScope.paavisningBaseRate) {
                $rootScope.ubehandledePaavisninger++;
            }
            if (Math.random() < $rootScope.graveskadeBaseRate) {
                $rootScope.ubehandledeGraveskader++;
            }
        };

        $scope.ansettSaksbehandler = function (antall) {
            $scope.antallSaksbehandlere += antall;
            $scope.brukPenger($scope.saksbehandlerKostnad * antall);
            $scope.saksbehandlerKostnad = Math.ceil($scope.saksbehandlerKostnad * $scope.saksbehandlerKostnadsfaktor);
        };

        $scope.ansettErfarenSaksbehandler = function (antall) {
            $scope.antallErfarneSaksbehandlere += antall;
            $scope.brukPenger($scope.erfarenSaksbehandlerKostnad * antall);
            $scope.erfarenSaksbehandlerKostnad = Math.ceil($scope.erfarenSaksbehandlerKostnad * $scope.erfarenSaksbehandlerKostnadsfaktor);
        };

        // Run UI update code every 1000ms
        $interval(function () {
            $rootScope.ubehandledeHenvendelser += ($rootScope.henvendelseBaseRate);
            $scope.behandleHenvendelser($scope.antallSaksbehandlere * $scope.saksbehandlerRate);
            $scope.behandleHenvendelser($scope.antallErfarneSaksbehandlere * $scope.erfarenSaksbehandlerRate);
            $rootScope.brukPenger($scope.antallSaksbehandlere * $scope.saksbehandlerLonnsavgift);
            $rootScope.brukPenger($scope.antallErfarneSaksbehandlere * $scope.erfarenSaksbehandlerLonnsavgift);
        }, 1000);
    });

    app.controller("DamagesCtrl", function ($rootScope, $scope, $interval) {
        $scope.antallGraveskadeSaksbehandlere = 0;
        $scope.graveskadeSaksbehandlerRate = 1;
        $scope.graveskadeSaksbehandlerKostnad = 100;
        $scope.graveskadeSaksbehandlerKostnadsfaktor = 1.1;
        $scope.graveskadeSaksbehandlerLonnsavgift = 3;

        $scope.behandleGraveskader = function (antall) {
            if (Math.floor($rootScope.ubehandledeGraveskader) >= antall) {
                for (var i = 0; i < antall; i++) {
                    $scope.behandleGraveskade();
                }
            } else if (Math.floor($rootScope.ubehandledeGraveskader) > 0) {
                for (i = 0; i < Math.floor($rootScope.ubehandledeGraveskader); i++) {
                    $scope.behandleGraveskade();
                }
            }
        };

        $scope.behandleGraveskade = function () {
            $rootScope.ubehandledeGraveskader--;
            $rootScope.behandledeGraveskader++;
        };

        $scope.ansettGraveskadeSaksbehandler = function (antall) {
            $scope.antallGraveskadeSaksbehandlere += antall;
            $scope.brukPenger($scope.graveskadeSaksbehandlerKostnad * antall);
            $scope.graveskadeSaksbehandlerKostnad = Math.ceil($scope.graveskadeSaksbehandlerKostnad * $scope.graveskadeSaksbehandlerKostnadsfaktor);
        };

        // Run UI update code every 1000ms
        $interval(function () {
            $scope.behandleGraveskader($scope.antallGraveskadeSaksbehandlere * $scope.graveskadeSaksbehandlerRate);
            $rootScope.brukPenger($scope.antallGraveskadeSaksbehandlere * $scope.graveskadeSaksbehandlerLonnsavgift);
        }, 1000);
    });

    app.controller("CableDetectionsCtrl", function ($rootScope, $scope, $interval) {
        $rootScope.behandledePaavisninger = 0;
        $scope.antallPaavisere = 0;
        $scope.paaviserRate = 1;
        $scope.paaviserKostnad = 1000;
        $scope.paaviserKostnadsfaktor = 1.3;
        $scope.paaviserLonnsavgift = 50;

        $scope.behandlePaavisninger = function (antall) {
            if (Math.floor($rootScope.ubehandledePaavisninger) >= antall) {
                for (var i = 0; i < antall; i++) {
                    $scope.behandlePaavisning();
                }
            } else if (Math.floor($rootScope.ubehandledePaavisninger) > 0) {
                for (i = 0; i < Math.floor($rootScope.ubehandledePaavisninger); i++) {
                    $scope.behandlePaavisning();
                }
            }
        };

        $scope.behandlePaavisning = function () {
            $rootScope.ubehandledePaavisninger--;
            $rootScope.behandledePaavisninger++;
        };

        $scope.ansettPaaviser = function (antall) {
            $scope.antallPaavisere += antall;
            $scope.brukPenger($scope.paaviserKostnad * antall);
            $scope.paaviserKostnad = Math.ceil($scope.paaviserKostnad * $scope.paaviserKostnadsfaktor);
        };

        // Run UI update code every 1000ms
        $interval(function () {
            $scope.behandlePaavisninger($scope.antallPaavisere * $scope.paaviserRate);
            $scope.brukPenger($scope.antallPaavisere * $scope.paaviserLonnsavgift);
        }, 1000);
    });

    app.controller("ReportCtrl", function ($rootScope, $scope) {
        $scope.fakturerHenvendelser = function () {
            $scope.tjenPenger(Math.floor($rootScope.behandledeHenvendelser) * $scope.henvendelsePris);
            $rootScope.behandledeHenvendelser -= Math.floor($rootScope.behandledeHenvendelser);
        };
        $scope.fakturerGraveskader = function () {
            $scope.tjenPenger(Math.floor($rootScope.behandledeGraveskader) * $scope.graveskadePris);
            $rootScope.behandledeGraveskader -= Math.floor($rootScope.behandledeGraveskader);
        };
        $scope.fakturerPaavisninger = function () {
            $scope.tjenPenger(Math.floor($rootScope.behandledePaavisninger) * $scope.paavisningPris);
            $rootScope.behandledePaavisninger -= Math.floor($rootScope.behandledePaavisninger);
        };
    });

    app.controller("IncomingInquiriesCtrl", function ($rootScope, $scope) {
        $scope.lagHenvendelse = function (antall) {
            $rootScope.ubehandledeHenvendelser += antall;
        };
        $scope.lagGraveskade = function (antall) {
            $rootScope.ubehandledeGraveskader += antall;
        };
        $scope.lagPaavisning = function (antall) {
            $rootScope.ubehandledePaavisninger += antall;
        };
    });

    app.directive("tabs", function () {
        return {
            restrict: 'E',
            templateUrl: "Views/Tabs.html"
        };
    });

    app.directive("tabsBody", function () {
        return {
            restrict: 'E',
            templateUrl: "Views/TabsContent.html"
        };
    });

    app.directive("sidebar", function () {
        return {
            restrict: 'E',
            templateUrl: "Views/Sidebar.html"
        };
    });

})();