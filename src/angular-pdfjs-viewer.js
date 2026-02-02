/**
 * angular-pdfjs
 * https://github.com/legalthings/angular-pdfjs
 * Copyright (c) 2015 ; Licensed MIT
 */

+function () {
    'use strict';

    var module = angular.module('pdfjsViewer', []);
    
    module.provider('pdfjsViewerConfig', function() {
        var config = {
            workerSrc: null,
            cmapDir: null,
            imageResourcesPath: null,
            disableWorker: false,
            verbosity: null
        };
        
        this.setWorkerSrc = function(src) {
            config.workerSrc = src;
        };
        
        this.setCmapDir = function(dir) {
            config.cmapDir = dir;
        };
        
        this.setImageDir = function(dir) {
            config.imageDir = dir;
        };
        
        this.disableWorker = function(value) {
            if (typeof value === 'undefined') value = true;
            config.disableWorker = value;
        };
        
        this.setVerbosity = function(level) {
            config.verbosity = level;
        };
        
        this.$get = function() {
            return config;
        }
    });
    
    module.run(['pdfjsViewerConfig', function(pdfjsViewerConfig) {
        var PDFJS = window.PDFJS || window.pdfjsLib;
        var AppOptions = window.PDFViewerApplicationOptions;

        if (pdfjsViewerConfig.workerSrc) {
            if (AppOptions && typeof AppOptions.set === 'function') {
                AppOptions.set('workerSrc', pdfjsViewerConfig.workerSrc);
            } else if (PDFJS) {
                try {
                    if (PDFJS.GlobalWorkerOptions) PDFJS.GlobalWorkerOptions.workerSrc = pdfjsViewerConfig.workerSrc;
                    else PDFJS.workerSrc = pdfjsViewerConfig.workerSrc;
                } catch (e) {}
            }
        }

        if (pdfjsViewerConfig.cmapDir) {
            if (AppOptions && typeof AppOptions.set === 'function') {
                AppOptions.set('cMapUrl', pdfjsViewerConfig.cmapDir);
            } else if (PDFJS) {
                try { PDFJS.cMapUrl = pdfjsViewerConfig.cmapDir; } catch (e) {}
            }
        }

        if (pdfjsViewerConfig.imageDir) {
            if (AppOptions && typeof AppOptions.set === 'function') {
                AppOptions.set('standardFontDataUrl', pdfjsViewerConfig.imageDir);
            } else if (PDFJS) {
                try { PDFJS.imageResourcesPath = pdfjsViewerConfig.imageDir; } catch (e) {}
            }
        }
        
        if (pdfjsViewerConfig.disableWorker) {
            if (AppOptions && typeof AppOptions.set === 'function') {
                AppOptions.set('disableWorker', true);
            } else if (PDFJS) {
                try { PDFJS.disableWorker = true; } catch (e) {}
            }
        }

        if (pdfjsViewerConfig.verbosity !== null) {
            var level = pdfjsViewerConfig.verbosity;
            if (AppOptions && typeof AppOptions.set === 'function') {
                AppOptions.set('verbosity', level);
            } else if (PDFJS) {
                try {
                    if (typeof level === 'string' && PDFJS.VERBOSITY_LEVELS) level = PDFJS.VERBOSITY_LEVELS[level];
                    PDFJS.verbosity = level;
                } catch (e) {}
            }
        }
    }]);
    
    module.directive('pdfjsViewer', ['$interval', '$timeout', function ($interval, $timeout) {
        return {
            templateUrl: file.folder + '../../pdf.js-viewer/viewer.html',
            restrict: 'E',
            scope: {
                onInit: '&',
                onPageLoad: '&',
                scale: '=?',
                src: '@?',
                data: '=?'
            },
            link: function ($scope, $element, $attrs) {
                $element.children().wrap('<div class="pdfjs" style="width: 100%; height: 100%;"></div>');
                
                var initialised = false;
                var loaded = {};
                var numLoaded = 0;

                var PDFJS = window.PDFJS || window.pdfjsLib;
                if (!PDFJS && !window.PDFViewerApplication) {
                    return console.warn("PDFJS is not set! Make sure that pdf.js is loaded before angular-pdfjs-viewer.js is loaded. If you are using ESM, please set window.pdfjsLib = pdfjsLib;");
                }

                // initialize the pdf viewer with (with empty source)
                var initPoller = $interval(function() {
                    if (document.getElementById('outerContainer')) {
                        $interval.cancel(initPoller);
                        
                        var loadFunc = window.webViewerLoad || (PDFJS && PDFJS.webViewerLoad);
                        if (typeof loadFunc === 'function' && (!window.PDFViewerApplication || !window.PDFViewerApplication.initialized)) {
                            loadFunc("");
                        }
                    }
                }, 100);

                function onPdfInit() {
                    initialised = true;
                    
                    if ($attrs.removeMouseListeners === "true") {
                        window.removeEventListener('DOMMouseScroll', handleMouseWheel);
                        window.removeEventListener('mousewheel', handleMouseWheel);
                        
                        var pages = document.querySelectorAll('.page');
                        angular.forEach(pages, function (page) {
                            angular.element(page).children().css('pointer-events', 'none');
                        });
                    }
                    if ($scope.onInit) $scope.onInit();
                }
                
                var poller = $interval(function () {
                    if (!window.PDFViewerApplication) {
                        return;
                    }

                    var pdfViewer = window.PDFViewerApplication.pdfViewer;
                    
                    if (pdfViewer) {
                        if ($scope.scale !== pdfViewer.currentScale) {
                            loaded = {};
                            numLoaded = 0;
                            $scope.scale = pdfViewer.currentScale;
                        }
                    }

                    var pages = document.querySelectorAll('.page');
                    angular.forEach(pages, function (page) {
                        var element = angular.element(page);
                        var pageNum = element.attr('data-page-number');
                        
                        if (!element.attr('data-loaded')) {
                            delete loaded[pageNum];
                            return;
                        }
                        
                        if (pageNum in loaded) return;

                        if (!initialised) onPdfInit();
                        
                        if ($scope.onPageLoad) {
                            if ($scope.onPageLoad({page: pageNum}) === false) return;
                        }
                        
                        loaded[pageNum] = true;
                        numLoaded++;
                    });
                }, 200);

                $element.on('$destroy', function() {
                    $interval.cancel(poller);
                });

                // watch pdf source
                $scope.$watchGroup([
                    function () { return $scope.src; },
                    function () { return $scope.data; }
                ], function (values) {
                    var src = values[0];
                    var data = values[1];

                    if ((!src || src === "") && !data) {
                        return;
                    }

                    if (window.PDFViewerApplication && typeof window.PDFViewerApplication.open === 'function') {
                        var openArgs = {};
                        if (src) openArgs.url = src;
                        if (data) openArgs.data = data;
                        
                        window.PDFViewerApplication.open(openArgs);
                    }
                });

                // watch other attributes
                $scope.$watch(function () {
                    return $attrs;
                }, function () {
                    if ($attrs.open === 'false') {
                        document.getElementById('openFile').setAttribute('hidden', 'true');
                        document.getElementById('secondaryOpenFile').setAttribute('hidden', 'true');
                    }

                    if ($attrs.download === 'false') {
                        document.getElementById('download').setAttribute('hidden', 'true');
                        document.getElementById('secondaryDownload').setAttribute('hidden', 'true');
                    }

                    if ($attrs.print === 'false') {
                        document.getElementById('print').setAttribute('hidden', 'true');
                        document.getElementById('secondaryPrint').setAttribute('hidden', 'true');
                    }

                    if ($attrs.width) {
                        document.getElementById('outerContainer').style.width = $attrs.width;
                    }

                    if ($attrs.height) {
                        document.getElementById('outerContainer').style.height = $attrs.height;
                    }
                });
            }
        };
    }]);

    // === get current script file ===
    var file = {};
    file.scripts = document.querySelectorAll('script[src]');
    file.path = file.scripts[file.scripts.length - 1].src;
    file.filename = getFileName(file.path);
    file.folder = getLocation(file.path).pathname.replace(file.filename, '');

    function getFileName(url) {
        var anchor = url.indexOf('#');
        var query = url.indexOf('?');
        var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);

        return url.substring(url.lastIndexOf('/', end) + 1, end);
    }

    function getLocation(href) {
        var location = document.createElement("a");
        location.href = href;

        if (!location.host) location.href = location.href; // Weird assigment

        return location;
    }
    // ======
}();
