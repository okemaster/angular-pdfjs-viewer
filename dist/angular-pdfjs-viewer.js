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
            template: '  <pdfjs-wrapper>\n' +
'    <div id="outerContainer">\n' +
'      <span id="viewer-alert" class="visuallyHidden" role="alert"></span>\n' +
'\n' +
'      <div id="sidebarContainer">\n' +
'        <div id="toolbarSidebar" class="toolbarHorizontalGroup">\n' +
'          <div id="toolbarSidebarLeft">\n' +
'            <div id="sidebarViewButtons" class="toolbarHorizontalGroup toggled" role="radiogroup">\n' +
'              <button\n' +
'                id="viewThumbnail"\n' +
'                class="toolbarButton toggled"\n' +
'                type="button"\n' +
'                tabindex="0"\n' +
'                data-l10n-id="pdfjs-thumbs-button"\n' +
'                role="radio"\n' +
'                aria-checked="true"\n' +
'                aria-controls="thumbnailView"\n' +
'              >\n' +
'                <span data-l10n-id="pdfjs-thumbs-button-label"></span>\n' +
'              </button>\n' +
'              <button\n' +
'                id="viewOutline"\n' +
'                class="toolbarButton"\n' +
'                type="button"\n' +
'                tabindex="0"\n' +
'                data-l10n-id="pdfjs-document-outline-button"\n' +
'                role="radio"\n' +
'                aria-checked="false"\n' +
'                aria-controls="outlineView"\n' +
'              >\n' +
'                <span data-l10n-id="pdfjs-document-outline-button-label"></span>\n' +
'              </button>\n' +
'              <button\n' +
'                id="viewAttachments"\n' +
'                class="toolbarButton"\n' +
'                type="button"\n' +
'                tabindex="0"\n' +
'                data-l10n-id="pdfjs-attachments-button"\n' +
'                role="radio"\n' +
'                aria-checked="false"\n' +
'                aria-controls="attachmentsView"\n' +
'              >\n' +
'                <span data-l10n-id="pdfjs-attachments-button-label"></span>\n' +
'              </button>\n' +
'              <button\n' +
'                id="viewLayers"\n' +
'                class="toolbarButton"\n' +
'                type="button"\n' +
'                tabindex="0"\n' +
'                data-l10n-id="pdfjs-layers-button"\n' +
'                role="radio"\n' +
'                aria-checked="false"\n' +
'                aria-controls="layersView"\n' +
'              >\n' +
'                <span data-l10n-id="pdfjs-layers-button-label"></span>\n' +
'              </button>\n' +
'              <button\n' +
'                id="viewFilter"\n' +
'                class="toolbarButton"\n' +
'                type="button"\n' +
'                tabindex="0"\n' +
'                data-l10n-id="pdfjs-filter-button"\n' +
'                role="radio"\n' +
'                aria-checked="false"\n' +
'                aria-controls="filterView"\n' +
'              >\n' +
'                <span data-l10n-id="pdfjs-filter-button-label"></span>\n' +
'              </button>\n' +
'            </div>\n' +
'          </div>\n' +
'\n' +
'          <div id="toolbarSidebarRight">\n' +
'            <div id="outlineOptionsContainer" class="toolbarHorizontalGroup">\n' +
'              <div class="verticalToolbarSeparator"></div>\n' +
'\n' +
'              <button\n' +
'                id="currentOutlineItem"\n' +
'                class="toolbarButton"\n' +
'                type="button"\n' +
'                disabled="disabled"\n' +
'                tabindex="0"\n' +
'                data-l10n-id="pdfjs-current-outline-item-button"\n' +
'              >\n' +
'                <span data-l10n-id="pdfjs-current-outline-item-button-label"></span>\n' +
'              </button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'        <div id="sidebarContent">\n' +
'          <div id="thumbnailView"></div>\n' +
'          <div id="outlineView" class="hidden"></div>\n' +
'          <div id="attachmentsView" class="hidden"></div>\n' +
'          <div id="layersView" class="hidden"></div>\n' +
'          <div id="filterView" class="hidden"></div>\n' +
'        </div>\n' +
'        <div id="sidebarResizer"></div>\n' +
'      </div>\n' +
'      <!-- sidebarContainer -->\n' +
'\n' +
'      <div id="mainContainer">\n' +
'        <div class="toolbar">\n' +
'          <div id="toolbarContainer">\n' +
'            <div id="toolbarViewer" class="toolbarHorizontalGroup">\n' +
'              <div id="toolbarViewerLeft" class="toolbarHorizontalGroup">\n' +
'                <button\n' +
'                  id="sidebarToggleButton"\n' +
'                  class="toolbarButton"\n' +
'                  type="button"\n' +
'                  tabindex="0"\n' +
'                  data-l10n-id="pdfjs-toggle-sidebar-button"\n' +
'                  aria-expanded="false"\n' +
'                  aria-haspopup="true"\n' +
'                  aria-controls="sidebarContainer"\n' +
'                >\n' +
'                  <span data-l10n-id="pdfjs-toggle-sidebar-button-label"></span>\n' +
'                </button>\n' +
'                <div class="toolbarButtonSpacer"></div>\n' +
'                <div class="toolbarButtonWithContainer">\n' +
'                  <button\n' +
'                    id="viewFindButton"\n' +
'                    class="toolbarButton"\n' +
'                    type="button"\n' +
'                    tabindex="0"\n' +
'                    data-l10n-id="pdfjs-findbar-button"\n' +
'                    aria-expanded="false"\n' +
'                    aria-controls="findbar"\n' +
'                  >\n' +
'                    <span data-l10n-id="pdfjs-findbar-button-label"></span>\n' +
'                  </button>\n' +
'                  <div class="hidden doorHanger toolbarHorizontalGroup" id="findbar">\n' +
'                    <div id="findInputContainer" class="toolbarHorizontalGroup">\n' +
'                      <span class="loadingInput end toolbarHorizontalGroup">\n' +
'                        <input id="findInput" class="toolbarField" tabindex="0" data-l10n-id="pdfjs-find-input" aria-invalid="false" />\n' +
'                      </span>\n' +
'                      <div class="toolbarHorizontalGroup">\n' +
'                        <button id="findPreviousButton" class="toolbarButton" type="button" tabindex="0" data-l10n-id="pdfjs-find-previous-button">\n' +
'                          <span data-l10n-id="pdfjs-find-previous-button-label"></span>\n' +
'                        </button>\n' +
'                        <div class="splitToolbarButtonSeparator"></div>\n' +
'                        <button id="findNextButton" class="toolbarButton" type="button" tabindex="0" data-l10n-id="pdfjs-find-next-button">\n' +
'                          <span data-l10n-id="pdfjs-find-next-button-label"></span>\n' +
'                        </button>\n' +
'                      </div>\n' +
'                    </div>\n' +
'\n' +
'                    <div id="findbarOptionsOneContainer" class="toolbarHorizontalGroup">\n' +
'                      <div class="toggleButton toolbarLabel">\n' +
'                        <input type="checkbox" id="findHighlightAll" tabindex="0" />\n' +
'                        <label for="findHighlightAll" data-l10n-id="pdfjs-find-highlight-checkbox"></label>\n' +
'                      </div>\n' +
'                      <div class="toggleButton toolbarLabel">\n' +
'                        <input type="checkbox" id="findMatchCase" tabindex="0" />\n' +
'                        <label for="findMatchCase" data-l10n-id="pdfjs-find-match-case-checkbox-label"></label>\n' +
'                      </div>\n' +
'                    </div>\n' +
'                    <div id="findbarOptionsTwoContainer" class="toolbarHorizontalGroup">\n' +
'                      <div class="toggleButton toolbarLabel">\n' +
'                        <input type="checkbox" id="findMatchDiacritics" tabindex="0" />\n' +
'                        <label for="findMatchDiacritics" data-l10n-id="pdfjs-find-match-diacritics-checkbox-label"></label>\n' +
'                      </div>\n' +
'                      <div class="toggleButton toolbarLabel">\n' +
'                        <input type="checkbox" id="findEntireWord" tabindex="0" />\n' +
'                        <label for="findEntireWord" data-l10n-id="pdfjs-find-entire-word-checkbox-label"></label>\n' +
'                      </div>\n' +
'                    </div>\n' +
'\n' +
'                    <div id="findbarMessageContainer" class="toolbarHorizontalGroup" aria-live="polite">\n' +
'                      <span id="findResultsCount" class="toolbarLabel"></span>\n' +
'                      <span id="findMsg" class="toolbarLabel"></span>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <!-- findbar -->\n' +
'                </div>\n' +
'                <div class="toolbarHorizontalGroup hiddenSmallView">\n' +
'                  <button class="toolbarButton" type="button" id="previous" tabindex="0" data-l10n-id="pdfjs-previous-button">\n' +
'                    <span data-l10n-id="pdfjs-previous-button-label"></span>\n' +
'                  </button>\n' +
'                  <div class="splitToolbarButtonSeparator"></div>\n' +
'                  <button class="toolbarButton" type="button" id="next" tabindex="0" data-l10n-id="pdfjs-next-button">\n' +
'                    <span data-l10n-id="pdfjs-next-button-label"></span>\n' +
'                  </button>\n' +
'                </div>\n' +
'                <div class="toolbarHorizontalGroup">\n' +
'                  <span class="loadingInput start toolbarHorizontalGroup">\n' +
'                    <input\n' +
'                      type="number"\n' +
'                      id="pageNumber"\n' +
'                      class="toolbarField"\n' +
'                      value="1"\n' +
'                      min="1"\n' +
'                      tabindex="0"\n' +
'                      data-l10n-id="pdfjs-page-input"\n' +
'                      autocomplete="off"\n' +
'                    />\n' +
'                  </span>\n' +
'                  <span id="numPages" class="toolbarLabel"></span>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div id="toolbarViewerMiddle" class="toolbarHorizontalGroup">\n' +
'                <div class="toolbarHorizontalGroup">\n' +
'                  <button id="zoomOutButton" class="toolbarButton" type="button" tabindex="0" data-l10n-id="pdfjs-zoom-out-button">\n' +
'                    <span data-l10n-id="pdfjs-zoom-out-button-label"></span>\n' +
'                  </button>\n' +
'                  <div class="splitToolbarButtonSeparator"></div>\n' +
'                  <button id="zoomInButton" class="toolbarButton" type="button" tabindex="0" data-l10n-id="pdfjs-zoom-in-button">\n' +
'                    <span data-l10n-id="pdfjs-zoom-in-button-label"></span>\n' +
'                  </button>\n' +
'                </div>\n' +
'                <span id="scaleSelectContainer" class="dropdownToolbarButton">\n' +
'                  <select id="scaleSelect" tabindex="0" data-l10n-id="pdfjs-zoom-select">\n' +
'                    <option id="pageAutoOption" value="auto" selected="selected" data-l10n-id="pdfjs-page-scale-auto"></option>\n' +
'                    <option id="pageActualOption" value="page-actual" data-l10n-id="pdfjs-page-scale-actual"></option>\n' +
'                    <option id="pageFitOption" value="page-fit" data-l10n-id="pdfjs-page-scale-fit"></option>\n' +
'                    <option id="pageWidthOption" value="page-width" data-l10n-id="pdfjs-page-scale-width"></option>\n' +
'                    <option\n' +
'                      id="customScaleOption"\n' +
'                      value="custom"\n' +
'                      disabled="disabled"\n' +
'                      hidden="true"\n' +
'                      data-l10n-id="pdfjs-page-scale-percent"\n' +
'                      data-l10n-args=\'{ "scale": 0 }\'\n' +
'                    ></option>\n' +
'                    <option value="0.5" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 50 }\'></option>\n' +
'                    <option value="0.75" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 75 }\'></option>\n' +
'                    <option value="1" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 100 }\'></option>\n' +
'                    <option value="1.25" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 125 }\'></option>\n' +
'                    <option value="1.5" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 150 }\'></option>\n' +
'                    <option value="2" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 200 }\'></option>\n' +
'                    <option value="3" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 300 }\'></option>\n' +
'                    <option value="4" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args=\'{ "scale": 400 }\'></option>\n' +
'                  </select>\n' +
'                </span>\n' +
'              </div>\n' +
'              <div id="toolbarViewerRight" class="toolbarHorizontalGroup">\n' +
'                <div id="editorModeButtons" class="toolbarHorizontalGroup">\n' +
'                  <div id="editorComment" class="toolbarButtonWithContainer" hidden="true">\n' +
'                    <button\n' +
'                      id="editorCommentButton"\n' +
'                      class="toolbarButton"\n' +
'                      type="button"\n' +
'                      tabindex="0"\n' +
'                      disabled="disabled"\n' +
'                      aria-expanded="false"\n' +
'                      aria-haspopup="true"\n' +
'                      aria-controls="editorCommentParamsToolbar"\n' +
'                      data-l10n-id="pdfjs-editor-comment-button"\n' +
'                    >\n' +
'                      <span data-l10n-id="pdfjs-editor-comment-button-label"></span>\n' +
'                    </button>\n' +
'                    <div class="editorParamsToolbar hidden menu" id="editorCommentParamsToolbar">\n' +
'                      <div id="editorCommentsSidebar" class="menuContainer comment sidebar" role="landmark" aria-labelledby="editorCommentsSidebarHeader">\n' +
'                        <div id="editorCommentsSidebarResizer" class="sidebarResizer"></div>\n' +
'                        <div id="editorCommentsSidebarHeader" role="heading" aria-level="2">\n' +
'                          <span class="commentCount">\n' +
'                            <span id="editorCommentsSidebarTitle" data-l10n-id="pdfjs-editor-comments-sidebar-title" data-l10n-args=\'{ "count": 0 }\'></span>\n' +
'                            <span id="editorCommentsSidebarCount"></span>\n' +
'                          </span>\n' +
'                          <button id="editorCommentsSidebarCloseButton" type="button" tabindex="0" data-l10n-id="pdfjs-editor-comments-sidebar-close-button">\n' +
'                            <span data-l10n-id="pdfjs-editor-comments-sidebar-close-button-label"></span>\n' +
'                          </button>\n' +
'                        </div>\n' +
'                        <div id="editorCommentsSidebarListContainer" tabindex="-1">\n' +
'                          <ul id="editorCommentsSidebarList"></ul>\n' +
'                        </div>\n' +
'                      </div>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <div id="editorSignature" class="toolbarButtonWithContainer" hidden="true">\n' +
'                    <button\n' +
'                      id="editorSignatureButton"\n' +
'                      class="toolbarButton"\n' +
'                      type="button"\n' +
'                      tabindex="0"\n' +
'                      disabled="disabled"\n' +
'                      aria-expanded="false"\n' +
'                      aria-haspopup="true"\n' +
'                      aria-controls="editorSignatureParamsToolbar"\n' +
'                      data-l10n-id="pdfjs-editor-signature-button"\n' +
'                    >\n' +
'                      <span data-l10n-id="pdfjs-editor-signature-button-label"></span>\n' +
'                    </button>\n' +
'                    <div class="editorParamsToolbar hidden doorHangerRight menu" id="editorSignatureParamsToolbar">\n' +
'                      <div id="addSignatureDoorHanger" class="menuContainer" role="region" data-l10n-id="pdfjs-editor-add-signature-container">\n' +
'                        <button\n' +
'                          id="editorSignatureAddSignature"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-editor-signature-add-signature-button"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-editor-signature-add-signature-button-label" class="editorParamsLabel"></span>\n' +
'                        </button>\n' +
'                      </div>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <div id="saveSelection" class="toolbarButtonWithContainer">\n' +
'                    <button\n' +
'                      id="saveSelectionButton"\n' +
'                      class="toolbarButton"\n' +
'                      type="button"\n' +
'                      tabindex="0"\n' +
'                      title="Save Selection as JSON"\n' +
'                      data-l10n-id="pdfjs-save-selection-button"\n' +
'                    >\n' +
'                      <span data-l10n-id="pdfjs-save-selection-button-label">Save Selection</span>\n' +
'                    </button>\n' +
'                  </div>\n' +
'                  <div id="editorHighlight" class="toolbarButtonWithContainer">\n' +
'                    <button\n' +
'                      id="editorHighlightButton"\n' +
'                      class="toolbarButton"\n' +
'                      type="button"\n' +
'                      disabled="disabled"\n' +
'                      aria-expanded="false"\n' +
'                      aria-haspopup="true"\n' +
'                      aria-controls="editorHighlightParamsToolbar"\n' +
'                      tabindex="0"\n' +
'                      data-l10n-id="pdfjs-editor-highlight-button"\n' +
'                    >\n' +
'                      <span data-l10n-id="pdfjs-editor-highlight-button-label"></span>\n' +
'                    </button>\n' +
'                    <div class="editorParamsToolbar hidden doorHangerRight" id="editorHighlightParamsToolbar">\n' +
'                      <div id="highlightParamsToolbarContainer" class="editorParamsToolbarContainer">\n' +
'                        <div id="editorHighlightColorPicker" class="colorPicker">\n' +
'                          <span id="highlightColorPickerLabel" class="editorParamsLabel" data-l10n-id="pdfjs-editor-highlight-colorpicker-label"></span>\n' +
'                        </div>\n' +
'                        <div id="editorHighlightThickness">\n' +
'                          <label\n' +
'                            for="editorFreeHighlightThickness"\n' +
'                            class="editorParamsLabel"\n' +
'                            data-l10n-id="pdfjs-editor-free-highlight-thickness-input"\n' +
'                          ></label>\n' +
'                          <div class="thicknessPicker">\n' +
'                            <input\n' +
'                              type="range"\n' +
'                              id="editorFreeHighlightThickness"\n' +
'                              class="editorParamsSlider"\n' +
'                              data-l10n-id="pdfjs-editor-free-highlight-thickness-title"\n' +
'                              value="12"\n' +
'                              min="8"\n' +
'                              max="24"\n' +
'                              step="1"\n' +
'                              tabindex="0"\n' +
'                            />\n' +
'                          </div>\n' +
'                        </div>\n' +
'                        <div id="editorHighlightVisibility">\n' +
'                          <div class="divider"></div>\n' +
'                          <div class="toggler">\n' +
'                            <label for="editorHighlightShowAll" class="editorParamsLabel" data-l10n-id="pdfjs-editor-highlight-show-all-button-label"></label>\n' +
'                            <button\n' +
'                              id="editorHighlightShowAll"\n' +
'                              class="toggle-button"\n' +
'                              type="button"\n' +
'                              data-l10n-id="pdfjs-editor-highlight-show-all-button"\n' +
'                              aria-pressed="true"\n' +
'                              tabindex="0"\n' +
'                            ></button>\n' +
'                          </div>\n' +
'                        </div>\n' +
'                      </div>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <div id="editorFreeText" class="toolbarButtonWithContainer">\n' +
'                    <button\n' +
'                      id="editorFreeTextButton"\n' +
'                      class="toolbarButton"\n' +
'                      type="button"\n' +
'                      disabled="disabled"\n' +
'                      aria-expanded="false"\n' +
'                      aria-haspopup="true"\n' +
'                      aria-controls="editorFreeTextParamsToolbar"\n' +
'                      tabindex="0"\n' +
'                      data-l10n-id="pdfjs-editor-free-text-button"\n' +
'                    >\n' +
'                      <span data-l10n-id="pdfjs-editor-free-text-button-label"></span>\n' +
'                    </button>\n' +
'                    <div class="editorParamsToolbar hidden doorHangerRight" id="editorFreeTextParamsToolbar">\n' +
'                      <div class="editorParamsToolbarContainer">\n' +
'                        <div class="editorParamsSetter">\n' +
'                          <label for="editorFreeTextColor" class="editorParamsLabel" data-l10n-id="pdfjs-editor-free-text-color-input"></label>\n' +
'                          <input type="color" id="editorFreeTextColor" class="editorParamsColor" tabindex="0" />\n' +
'                        </div>\n' +
'                        <div class="editorParamsSetter">\n' +
'                          <label for="editorFreeTextFontSize" class="editorParamsLabel" data-l10n-id="pdfjs-editor-free-text-size-input"></label>\n' +
'                          <input type="range" id="editorFreeTextFontSize" class="editorParamsSlider" value="10" min="5" max="100" step="1" tabindex="0" />\n' +
'                        </div>\n' +
'                      </div>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <div id="editorInk" class="toolbarButtonWithContainer">\n' +
'                    <button\n' +
'                      id="editorInkButton"\n' +
'                      class="toolbarButton"\n' +
'                      type="button"\n' +
'                      disabled="disabled"\n' +
'                      aria-expanded="false"\n' +
'                      aria-haspopup="true"\n' +
'                      aria-controls="editorInkParamsToolbar"\n' +
'                      tabindex="0"\n' +
'                      data-l10n-id="pdfjs-editor-ink-button"\n' +
'                    >\n' +
'                      <span data-l10n-id="pdfjs-editor-ink-button-label"></span>\n' +
'                    </button>\n' +
'                    <div class="editorParamsToolbar hidden doorHangerRight" id="editorInkParamsToolbar">\n' +
'                      <div class="editorParamsToolbarContainer">\n' +
'                        <div class="editorParamsSetter">\n' +
'                          <label for="editorInkColor" class="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-color-input"></label>\n' +
'                          <input type="color" id="editorInkColor" class="editorParamsColor" tabindex="0" />\n' +
'                        </div>\n' +
'                        <div class="editorParamsSetter">\n' +
'                          <label for="editorInkThickness" class="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-thickness-input"></label>\n' +
'                          <input type="range" id="editorInkThickness" class="editorParamsSlider" value="1" min="1" max="20" step="1" tabindex="0" />\n' +
'                        </div>\n' +
'                        <div class="editorParamsSetter">\n' +
'                          <label for="editorInkOpacity" class="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-opacity-input"></label>\n' +
'                          <input type="range" id="editorInkOpacity" class="editorParamsSlider" value="1" min="0.05" max="1" step="0.05" tabindex="0" />\n' +
'                        </div>\n' +
'                      </div>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <div id="editorStamp" class="toolbarButtonWithContainer">\n' +
'                    <button\n' +
'                      id="editorStampButton"\n' +
'                      class="toolbarButton"\n' +
'                      type="button"\n' +
'                      disabled="disabled"\n' +
'                      aria-expanded="false"\n' +
'                      aria-haspopup="true"\n' +
'                      aria-controls="editorStampParamsToolbar"\n' +
'                      tabindex="0"\n' +
'                      data-l10n-id="pdfjs-editor-stamp-button"\n' +
'                    >\n' +
'                      <span data-l10n-id="pdfjs-editor-stamp-button-label"></span>\n' +
'                    </button>\n' +
'                    <div class="editorParamsToolbar hidden doorHangerRight menu" id="editorStampParamsToolbar">\n' +
'                      <div class="menuContainer">\n' +
'                        <button\n' +
'                          id="editorStampAddImage"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-editor-stamp-add-image-button"\n' +
'                        >\n' +
'                          <span class="editorParamsLabel" data-l10n-id="pdfjs-editor-stamp-add-image-button-label"></span>\n' +
'                        </button>\n' +
'                      </div>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                </div>\n' +
'\n' +
'                <div id="editorModeSeparator" class="verticalToolbarSeparator"></div>\n' +
'\n' +
'                <div class="toolbarHorizontalGroup hiddenMediumView">\n' +
'                  <button id="printButton" class="toolbarButton" type="button" tabindex="0" data-l10n-id="pdfjs-print-button">\n' +
'                    <span data-l10n-id="pdfjs-print-button-label"></span>\n' +
'                  </button>\n' +
'\n' +
'                  <button id="downloadButton" class="toolbarButton" type="button" tabindex="0" data-l10n-id="pdfjs-save-button">\n' +
'                    <span data-l10n-id="pdfjs-save-button-label"></span>\n' +
'                  </button>\n' +
'                </div>\n' +
'\n' +
'                <div class="verticalToolbarSeparator hiddenMediumView"></div>\n' +
'\n' +
'                <div id="secondaryToolbarToggle" class="toolbarButtonWithContainer">\n' +
'                  <button\n' +
'                    id="secondaryToolbarToggleButton"\n' +
'                    class="toolbarButton"\n' +
'                    type="button"\n' +
'                    tabindex="0"\n' +
'                    data-l10n-id="pdfjs-tools-button"\n' +
'                    aria-expanded="false"\n' +
'                    aria-haspopup="true"\n' +
'                    aria-controls="secondaryToolbar"\n' +
'                  >\n' +
'                    <span data-l10n-id="pdfjs-tools-button-label"></span>\n' +
'                  </button>\n' +
'                  <div id="secondaryToolbar" class="hidden doorHangerRight menu">\n' +
'                    <div id="secondaryToolbarButtonContainer" class="menuContainer">\n' +
'                      <button id="secondaryOpenFile" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-open-file-button">\n' +
'                        <span data-l10n-id="pdfjs-open-file-button-label"></span>\n' +
'                      </button>\n' +
'\n' +
'                      <div class="visibleMediumView">\n' +
'                        <button id="secondaryPrint" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-print-button">\n' +
'                          <span data-l10n-id="pdfjs-print-button-label"></span>\n' +
'                        </button>\n' +
'\n' +
'                        <button id="secondaryDownload" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-save-button">\n' +
'                          <span data-l10n-id="pdfjs-save-button-label"></span>\n' +
'                        </button>\n' +
'\n' +
'                      </div>\n' +
'\n' +
'                      <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'                      <button id="presentationMode" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-presentation-mode-button">\n' +
'                        <span data-l10n-id="pdfjs-presentation-mode-button-label"></span>\n' +
'                      </button>\n' +
'\n' +
'                      <a href="#" id="viewBookmark" class="toolbarButton labeled" tabindex="0" data-l10n-id="pdfjs-bookmark-button">\n' +
'                        <span data-l10n-id="pdfjs-bookmark-button-label"></span>\n' +
'                      </a>\n' +
'\n' +
'                      <div id="viewBookmarkSeparator" class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'                      <button id="firstPage" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-first-page-button">\n' +
'                        <span data-l10n-id="pdfjs-first-page-button-label"></span>\n' +
'                      </button>\n' +
'                      <button id="lastPage" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-last-page-button">\n' +
'                        <span data-l10n-id="pdfjs-last-page-button-label"></span>\n' +
'                      </button>\n' +
'\n' +
'                      <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'                      <button id="pageRotateCw" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-page-rotate-cw-button">\n' +
'                        <span data-l10n-id="pdfjs-page-rotate-cw-button-label"></span>\n' +
'                      </button>\n' +
'                      <button id="pageRotateCcw" class="toolbarButton labeled" type="button" tabindex="0" data-l10n-id="pdfjs-page-rotate-ccw-button">\n' +
'                        <span data-l10n-id="pdfjs-page-rotate-ccw-button-label"></span>\n' +
'                      </button>\n' +
'\n' +
'                      <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'                      <div id="cursorToolButtons" role="radiogroup">\n' +
'                        <button\n' +
'                          id="cursorSelectTool"\n' +
'                          class="toolbarButton labeled toggled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-cursor-text-select-tool-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="true"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-cursor-text-select-tool-button-label"></span>\n' +
'                        </button>\n' +
'                        <button\n' +
'                          id="cursorHandTool"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-cursor-hand-tool-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="false"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-cursor-hand-tool-button-label"></span>\n' +
'                        </button>\n' +
'                      </div>\n' +
'\n' +
'                      <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'                      <div id="scrollModeButtons" role="radiogroup">\n' +
'                        <button\n' +
'                          id="scrollPage"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-scroll-page-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="false"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-scroll-page-button-label"></span>\n' +
'                        </button>\n' +
'                        <button\n' +
'                          id="scrollVertical"\n' +
'                          class="toolbarButton labeled toggled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-scroll-vertical-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="true"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-scroll-vertical-button-label"></span>\n' +
'                        </button>\n' +
'                        <button\n' +
'                          id="scrollHorizontal"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-scroll-horizontal-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="false"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-scroll-horizontal-button-label"></span>\n' +
'                        </button>\n' +
'                        <button\n' +
'                          id="scrollWrapped"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-scroll-wrapped-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="false"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-scroll-wrapped-button-label"></span>\n' +
'                        </button>\n' +
'                      </div>\n' +
'\n' +
'                      <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'                      <div id="spreadModeButtons" role="radiogroup">\n' +
'                        <button\n' +
'                          id="spreadNone"\n' +
'                          class="toolbarButton labeled toggled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-spread-none-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="true"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-spread-none-button-label"></span>\n' +
'                        </button>\n' +
'                        <button\n' +
'                          id="spreadOdd"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-spread-odd-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="false"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-spread-odd-button-label"></span>\n' +
'                        </button>\n' +
'                        <button\n' +
'                          id="spreadEven"\n' +
'                          class="toolbarButton labeled"\n' +
'                          type="button"\n' +
'                          tabindex="0"\n' +
'                          data-l10n-id="pdfjs-spread-even-button"\n' +
'                          role="radio"\n' +
'                          aria-checked="false"\n' +
'                        >\n' +
'                          <span data-l10n-id="pdfjs-spread-even-button-label"></span>\n' +
'                        </button>\n' +
'                      </div>\n' +
'\n' +
'                      <div id="imageAltTextSettingsSeparator" class="horizontalToolbarSeparator hidden"></div>\n' +
'                      <button\n' +
'                        id="imageAltTextSettings"\n' +
'                        type="button"\n' +
'                        class="toolbarButton labeled hidden"\n' +
'                        tabindex="0"\n' +
'                        data-l10n-id="pdfjs-image-alt-text-settings-button"\n' +
'                        aria-controls="altTextSettingsDialog"\n' +
'                      >\n' +
'                        <span data-l10n-id="pdfjs-image-alt-text-settings-button-label"></span>\n' +
'                      </button>\n' +
'\n' +
'                      <div class="horizontalToolbarSeparator"></div>\n' +
'\n' +
'                      <button\n' +
'                        id="documentProperties"\n' +
'                        class="toolbarButton labeled"\n' +
'                        type="button"\n' +
'                        tabindex="0"\n' +
'                        data-l10n-id="pdfjs-document-properties-button"\n' +
'                        aria-controls="documentPropertiesDialog"\n' +
'                      >\n' +
'                        <span data-l10n-id="pdfjs-document-properties-button-label"></span>\n' +
'                      </button>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <!-- secondaryToolbar -->\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'            <div id="loadingBar">\n' +
'              <div class="progress">\n' +
'                <div class="glimmer"></div>\n' +
'              </div>\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'\n' +
'        <div id="viewerContainer" tabindex="0">\n' +
'          <div id="viewer" class="pdfViewer"></div>\n' +
'        </div>\n' +
'      </div>\n' +
'      <!-- mainContainer -->\n' +
'\n' +
'      <div id="dialogContainer">\n' +
'        <dialog id="passwordDialog">\n' +
'          <div class="row">\n' +
'            <label for="password" id="passwordText" data-l10n-id="pdfjs-password-label"></label>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <input type="password" id="password" class="toolbarField" />\n' +
'          </div>\n' +
'          <div class="buttonRow">\n' +
'            <button id="passwordCancel" class="dialogButton" type="button"><span data-l10n-id="pdfjs-password-cancel-button"></span></button>\n' +
'            <button id="passwordSubmit" class="dialogButton" type="button"><span data-l10n-id="pdfjs-password-ok-button"></span></button>\n' +
'          </div>\n' +
'        </dialog>\n' +
'        <dialog id="documentPropertiesDialog">\n' +
'          <div class="row">\n' +
'            <span id="fileNameLabel" data-l10n-id="pdfjs-document-properties-file-name"></span>\n' +
'            <p id="fileNameField" aria-labelledby="fileNameLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="fileSizeLabel" data-l10n-id="pdfjs-document-properties-file-size"></span>\n' +
'            <p id="fileSizeField" aria-labelledby="fileSizeLabel">-</p>\n' +
'          </div>\n' +
'          <div class="separator"></div>\n' +
'          <div class="row">\n' +
'            <span id="titleLabel" data-l10n-id="pdfjs-document-properties-title"></span>\n' +
'            <p id="titleField" aria-labelledby="titleLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="authorLabel" data-l10n-id="pdfjs-document-properties-author"></span>\n' +
'            <p id="authorField" aria-labelledby="authorLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="subjectLabel" data-l10n-id="pdfjs-document-properties-subject"></span>\n' +
'            <p id="subjectField" aria-labelledby="subjectLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="keywordsLabel" data-l10n-id="pdfjs-document-properties-keywords"></span>\n' +
'            <p id="keywordsField" aria-labelledby="keywordsLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="creationDateLabel" data-l10n-id="pdfjs-document-properties-creation-date"></span>\n' +
'            <p id="creationDateField" aria-labelledby="creationDateLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="modificationDateLabel" data-l10n-id="pdfjs-document-properties-modification-date"></span>\n' +
'            <p id="modificationDateField" aria-labelledby="modificationDateLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="creatorLabel" data-l10n-id="pdfjs-document-properties-creator"></span>\n' +
'            <p id="creatorField" aria-labelledby="creatorLabel">-</p>\n' +
'          </div>\n' +
'          <div class="separator"></div>\n' +
'          <div class="row">\n' +
'            <span id="producerLabel" data-l10n-id="pdfjs-document-properties-producer"></span>\n' +
'            <p id="producerField" aria-labelledby="producerLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="versionLabel" data-l10n-id="pdfjs-document-properties-version"></span>\n' +
'            <p id="versionField" aria-labelledby="versionLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="pageCountLabel" data-l10n-id="pdfjs-document-properties-page-count"></span>\n' +
'            <p id="pageCountField" aria-labelledby="pageCountLabel">-</p>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <span id="pageSizeLabel" data-l10n-id="pdfjs-document-properties-page-size"></span>\n' +
'            <p id="pageSizeField" aria-labelledby="pageSizeLabel">-</p>\n' +
'          </div>\n' +
'          <div class="separator"></div>\n' +
'          <div class="row">\n' +
'            <span id="linearizedLabel" data-l10n-id="pdfjs-document-properties-linearized"></span>\n' +
'            <p id="linearizedField" aria-labelledby="linearizedLabel">-</p>\n' +
'          </div>\n' +
'          <div class="buttonRow">\n' +
'            <button id="documentPropertiesClose" class="dialogButton" type="button"><span data-l10n-id="pdfjs-document-properties-close-button"></span></button>\n' +
'          </div>\n' +
'        </dialog>\n' +
'        <dialog class="dialog altText" id="altTextDialog" aria-labelledby="dialogLabel" aria-describedby="dialogDescription">\n' +
'          <div id="altTextContainer" class="mainContainer">\n' +
'            <div id="overallDescription">\n' +
'              <span id="dialogLabel" data-l10n-id="pdfjs-editor-alt-text-dialog-label" class="title"></span>\n' +
'              <span id="dialogDescription" data-l10n-id="pdfjs-editor-alt-text-dialog-description"></span>\n' +
'            </div>\n' +
'            <div id="addDescription">\n' +
'              <div class="radio">\n' +
'                <div class="radioButton">\n' +
'                  <input type="radio" id="descriptionButton" name="altTextOption" tabindex="0" aria-describedby="descriptionAreaLabel" checked />\n' +
'                  <label for="descriptionButton" data-l10n-id="pdfjs-editor-alt-text-add-description-label"></label>\n' +
'                </div>\n' +
'                <div class="radioLabel">\n' +
'                  <span id="descriptionAreaLabel" data-l10n-id="pdfjs-editor-alt-text-add-description-description"></span>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div class="descriptionArea">\n' +
'                <textarea id="descriptionTextarea" aria-labelledby="descriptionAreaLabel" data-l10n-id="pdfjs-editor-alt-text-textarea" tabindex="0"></textarea>\n' +
'              </div>\n' +
'            </div>\n' +
'            <div id="markAsDecorative">\n' +
'              <div class="radio">\n' +
'                <div class="radioButton">\n' +
'                  <input type="radio" id="decorativeButton" name="altTextOption" aria-describedby="decorativeLabel" />\n' +
'                  <label for="decorativeButton" data-l10n-id="pdfjs-editor-alt-text-mark-decorative-label"></label>\n' +
'                </div>\n' +
'                <div class="radioLabel">\n' +
'                  <span id="decorativeLabel" data-l10n-id="pdfjs-editor-alt-text-mark-decorative-description"></span>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'            <div id="buttons">\n' +
'              <button id="altTextCancel" class="secondaryButton" type="button" tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-alt-text-cancel-button"></span>\n' +
'              </button>\n' +
'              <button id="altTextSave" class="primaryButton" type="button" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-save-button"></span></button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </dialog>\n' +
'        <dialog class="dialog newAltText" id="newAltTextDialog" aria-labelledby="newAltTextTitle" aria-describedby="newAltTextDescription" tabindex="0">\n' +
'          <div id="newAltTextContainer" class="mainContainer">\n' +
'            <div class="title">\n' +
'              <span id="newAltTextTitle" data-l10n-id="pdfjs-editor-new-alt-text-dialog-edit-label" role="sectionhead" tabindex="0"></span>\n' +
'            </div>\n' +
'            <div id="mainContent">\n' +
'              <div id="descriptionAndSettings">\n' +
'                <div id="descriptionInstruction">\n' +
'                  <div id="newAltTextDescriptionContainer">\n' +
'                    <div class="altTextSpinner" role="status" aria-live="polite"></div>\n' +
'                    <textarea\n' +
'                      id="newAltTextDescriptionTextarea"\n' +
'                      aria-labelledby="descriptionAreaLabel"\n' +
'                      data-l10n-id="pdfjs-editor-new-alt-text-textarea"\n' +
'                      tabindex="0"\n' +
'                    ></textarea>\n' +
'                  </div>\n' +
'                  <span id="newAltTextDescription" role="note" data-l10n-id="pdfjs-editor-new-alt-text-description"></span>\n' +
'                  <div id="newAltTextDisclaimer" role="note">\n' +
'                    <div>\n' +
'                      <span data-l10n-id="pdfjs-editor-new-alt-text-disclaimer1"></span>\n' +
'                      <a\n' +
'                        href="https://support.mozilla.org/en-US/kb/pdf-alt-text"\n' +
'                        target="_blank"\n' +
'                        rel="noopener noreferrer"\n' +
'                        id="newAltTextLearnMore"\n' +
'                        data-l10n-id="pdfjs-editor-new-alt-text-disclaimer-learn-more-url"\n' +
'                        tabindex="0"\n' +
'                      ></a>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                </div>\n' +
'                <div id="newAltTextCreateAutomatically" class="toggler">\n' +
'                  <button id="newAltTextCreateAutomaticallyButton" class="toggle-button" type="button" aria-pressed="true" tabindex="0"></button>\n' +
'                  <label\n' +
'                    for="newAltTextCreateAutomaticallyButton"\n' +
'                    class="togglerLabel"\n' +
'                    data-l10n-id="pdfjs-editor-new-alt-text-create-automatically-button-label"\n' +
'                  ></label>\n' +
'                </div>\n' +
'                <div id="newAltTextDownloadModel" class="hidden">\n' +
'                  <span\n' +
'                    id="newAltTextDownloadModelDescription"\n' +
'                    data-l10n-id="pdfjs-editor-new-alt-text-ai-model-downloading-progress"\n' +
'                    aria-valuemin="0"\n' +
'                    data-l10n-args=\'{ "totalSize": 0, "downloadedSize": 0 }\'\n' +
'                  ></span>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div id="newAltTextImagePreview"></div>\n' +
'            </div>\n' +
'            <div id="newAltTextError" class="messageBar">\n' +
'              <div>\n' +
'                <div>\n' +
'                  <span class="title" data-l10n-id="pdfjs-editor-new-alt-text-error-title"></span>\n' +
'                  <span class="description" data-l10n-id="pdfjs-editor-new-alt-text-error-description"></span>\n' +
'                </div>\n' +
'                <button id="newAltTextCloseButton" class="closeButton" type="button" tabindex="0">\n' +
'                  <span data-l10n-id="pdfjs-editor-new-alt-text-error-close-button"></span>\n' +
'                </button>\n' +
'              </div>\n' +
'            </div>\n' +
'            <div id="newAltTextButtons" class="dialogButtonsGroup">\n' +
'              <button id="newAltTextCancel" type="button" class="secondaryButton hidden" tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-alt-text-cancel-button"></span>\n' +
'              </button>\n' +
'              <button id="newAltTextNotNow" type="button" class="secondaryButton" tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-new-alt-text-not-now-button"></span>\n' +
'              </button>\n' +
'              <button id="newAltTextSave" type="button" class="primaryButton" tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-alt-text-save-button"></span>\n' +
'              </button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </dialog>\n' +
'\n' +
'        <dialog class="dialog" id="altTextSettingsDialog" aria-labelledby="altTextSettingsTitle">\n' +
'          <div id="altTextSettingsContainer" class="mainContainer">\n' +
'            <div class="title">\n' +
'              <span id="altTextSettingsTitle" data-l10n-id="pdfjs-editor-alt-text-settings-dialog-label" role="sectionhead" tabindex="0" class="title"></span>\n' +
'            </div>\n' +
'            <div id="automaticAltText">\n' +
'              <span data-l10n-id="pdfjs-editor-alt-text-settings-automatic-title"></span>\n' +
'              <div id="automaticSettings">\n' +
'                <div id="createModelSetting">\n' +
'                  <div class="toggler">\n' +
'                    <button id="createModelButton" type="button" class="toggle-button" aria-pressed="true" tabindex="0"></button>\n' +
'                    <label for="createModelButton" class="togglerLabel" data-l10n-id="pdfjs-editor-alt-text-settings-create-model-button-label"></label>\n' +
'                  </div>\n' +
'                  <div id="createModelDescription" class="description">\n' +
'                    <span data-l10n-id="pdfjs-editor-alt-text-settings-create-model-description"></span>\n' +
'                    <a\n' +
'                      href="https://support.mozilla.org/en-US/kb/pdf-alt-text"\n' +
'                      target="_blank"\n' +
'                      rel="noopener noreferrer"\n' +
'                      id="altTextSettingsLearnMore"\n' +
'                      data-l10n-id="pdfjs-editor-new-alt-text-disclaimer-learn-more-url"\n' +
'                      tabindex="0"\n' +
'                    ></a>\n' +
'                  </div>\n' +
'                </div>\n' +
'                <div id="aiModelSettings">\n' +
'                  <div>\n' +
'                    <span data-l10n-id="pdfjs-editor-alt-text-settings-download-model-label" data-l10n-args=\'{ "totalSize": 180 }\'></span>\n' +
'                    <div id="aiModelDescription" class="description">\n' +
'                      <span data-l10n-id="pdfjs-editor-alt-text-settings-ai-model-description"></span>\n' +
'                    </div>\n' +
'                  </div>\n' +
'                  <button id="deleteModelButton" type="button" class="secondaryButton" tabindex="0">\n' +
'                    <span data-l10n-id="pdfjs-editor-alt-text-settings-delete-model-button"></span>\n' +
'                  </button>\n' +
'                  <button id="downloadModelButton" type="button" class="secondaryButton" tabindex="0">\n' +
'                    <span data-l10n-id="pdfjs-editor-alt-text-settings-download-model-button"></span>\n' +
'                  </button>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'            <div class="dialogSeparator"></div>\n' +
'            <div id="altTextEditor">\n' +
'              <span data-l10n-id="pdfjs-editor-alt-text-settings-editor-title"></span>\n' +
'              <div id="showAltTextEditor">\n' +
'                <div class="toggler">\n' +
'                  <button id="showAltTextDialogButton" type="button" class="toggle-button" aria-pressed="true" tabindex="0"></button>\n' +
'                  <label for="showAltTextDialogButton" class="togglerLabel" data-l10n-id="pdfjs-editor-alt-text-settings-show-dialog-button-label"></label>\n' +
'                </div>\n' +
'                <div id="showAltTextDialogDescription" class="description">\n' +
'                  <span data-l10n-id="pdfjs-editor-alt-text-settings-show-dialog-description"></span>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'            <div id="buttons" class="dialogButtonsGroup">\n' +
'              <button id="altTextSettingsCloseButton" type="button" class="primaryButton" tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-alt-text-settings-close-button"></span>\n' +
'              </button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </dialog>\n' +
'\n' +
'        <dialog class="dialog signatureDialog" id="addSignatureDialog" aria-labelledby="addSignatureDialogLabel">\n' +
'          <span id="addSignatureDialogLabel" data-l10n-id="pdfjs-editor-add-signature-dialog-label"></span>\n' +
'          <div id="addSignatureContainer" class="mainContainer">\n' +
'            <div class="title">\n' +
'              <span role="sectionhead" data-l10n-id="pdfjs-editor-add-signature-dialog-title" tabindex="0"></span>\n' +
'            </div>\n' +
'            <div role="tablist" id="addSignatureOptions">\n' +
'              <button\n' +
'                id="addSignatureTypeButton"\n' +
'                type="button"\n' +
'                role="tab"\n' +
'                aria-selected="true"\n' +
'                aria-controls="addSignatureTypeContainer"\n' +
'                data-l10n-id="pdfjs-editor-add-signature-type-button"\n' +
'                tabindex="0"\n' +
'              ></button>\n' +
'              <button\n' +
'                id="addSignatureDrawButton"\n' +
'                type="button"\n' +
'                role="tab"\n' +
'                aria-selected="false"\n' +
'                aria-controls="addSignatureDrawContainer"\n' +
'                data-l10n-id="pdfjs-editor-add-signature-draw-button"\n' +
'                tabindex="0"\n' +
'              ></button>\n' +
'              <button\n' +
'                id="addSignatureImageButton"\n' +
'                type="button"\n' +
'                role="tab"\n' +
'                aria-selected="false"\n' +
'                aria-controls="addSignatureImageContainer"\n' +
'                data-l10n-id="pdfjs-editor-add-signature-image-button"\n' +
'                tabindex="-1"\n' +
'              ></button>\n' +
'            </div>\n' +
'            <div id="addSignatureActionContainer" data-selected="type">\n' +
'              <div id="addSignatureTypeContainer" role="tabpanel" aria-labelledby="addSignatureTypeContainer">\n' +
'                <input id="addSignatureTypeInput" type="text" data-l10n-id="pdfjs-editor-add-signature-type-input" tabindex="0" />\n' +
'              </div>\n' +
'              <div id="addSignatureDrawContainer" role="tabpanel" aria-labelledby="addSignatureDrawButton" tabindex="-1">\n' +
'                <svg id="addSignatureDraw" xmlns="http://www.w3.org/2000/svg" aria-labelledby="addSignatureDrawPlaceholder"></svg>\n' +
'                <span id="addSignatureDrawPlaceholder" data-l10n-id="pdfjs-editor-add-signature-draw-placeholder"></span>\n' +
'                <div id="thickness">\n' +
'                  <div>\n' +
'                    <label for="addSignatureDrawThickness" data-l10n-id="pdfjs-editor-add-signature-draw-thickness-range-label"></label>\n' +
'                    <input\n' +
'                      type="range"\n' +
'                      id="addSignatureDrawThickness"\n' +
'                      min="1"\n' +
'                      max="5"\n' +
'                      step="1"\n' +
'                      value="1"\n' +
'                      data-l10n-id="pdfjs-editor-add-signature-draw-thickness-range"\n' +
'                      data-l10n-args=\'{ "thickness": 1 }\'\n' +
'                      tabindex="0"\n' +
'                    />\n' +
'                  </div>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div id="addSignatureImageContainer" role="tabpanel" aria-labelledby="addSignatureImageButton" tabindex="-1">\n' +
'                <svg id="addSignatureImage" xmlns="http://www.w3.org/2000/svg" aria-labelledby="addSignatureImagePlaceholder"></svg>\n' +
'                <div id="addSignatureImagePlaceholder">\n' +
'                  <span data-l10n-id="pdfjs-editor-add-signature-image-placeholder"></span>\n' +
'                  <label id="addSignatureImageBrowse" for="addSignatureFilePicker" tabindex="0">\n' +
'                    <a data-l10n-id="pdfjs-editor-add-signature-image-browse-link"></a>\n' +
'                  </label>\n' +
'                  <input id="addSignatureFilePicker" type="file" />\n' +
'                </div>\n' +
'              </div>\n' +
'              <div id="addSignatureControls">\n' +
'                <div id="horizontalContainer">\n' +
'                  <div id="addSignatureDescriptionContainer">\n' +
'                    <label for="addSignatureDescInput" data-l10n-id="pdfjs-editor-add-signature-description-label"></label>\n' +
'                    <span id="addSignatureDescription" class="inputWithClearButton">\n' +
'                      <input id="addSignatureDescInput" type="text" data-l10n-id="pdfjs-editor-add-signature-description-input" tabindex="0" />\n' +
'                      <button class="clearInputButton" type="button" tabindex="0" aria-hidden="true"></button>\n' +
'                    </span>\n' +
'                  </div>\n' +
'                  <button id="clearSignatureButton" type="button" data-l10n-id="pdfjs-editor-add-signature-clear-button" tabindex="0">\n' +
'                    <span data-l10n-id="pdfjs-editor-add-signature-clear-button-label"></span>\n' +
'                  </button>\n' +
'                </div>\n' +
'                <div id="addSignatureSaveContainer">\n' +
'                  <input type="checkbox" id="addSignatureSaveCheckbox" />\n' +
'                  <label for="addSignatureSaveCheckbox" data-l10n-id="pdfjs-editor-add-signature-save-checkbox"></label>\n' +
'                  <span></span>\n' +
'                  <span id="addSignatureSaveWarning" data-l10n-id="pdfjs-editor-add-signature-save-warning-message"></span>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div id="addSignatureError" hidden="true" class="messageBar">\n' +
'                <div>\n' +
'                  <div>\n' +
'                    <span id="addSignatureErrorTitle" class="title" data-l10n-id="pdfjs-editor-add-signature-image-upload-error-title"></span>\n' +
'                    <span id="addSignatureErrorDescription" class="description" data-l10n-id="pdfjs-editor-add-signature-image-upload-error-description"></span>\n' +
'                  </div>\n' +
'                  <button id="addSignatureErrorCloseButton" class="closeButton" type="button" tabindex="0">\n' +
'                    <span data-l10n-id="pdfjs-editor-add-signature-error-close-button"></span>\n' +
'                  </button>\n' +
'                </div>\n' +
'              </div>\n' +
'              <div class="dialogButtonsGroup">\n' +
'                <button id="addSignatureCancelButton" type="button" class="secondaryButton" tabindex="0">\n' +
'                  <span data-l10n-id="pdfjs-editor-add-signature-cancel-button"></span>\n' +
'                </button>\n' +
'                <button id="addSignatureAddButton" type="button" class="primaryButton" disabled tabindex="0">\n' +
'                  <span data-l10n-id="pdfjs-editor-add-signature-add-button"></span>\n' +
'                </button>\n' +
'              </div>\n' +
'            </div>\n' +
'          </div>\n' +
'        </dialog>\n' +
'\n' +
'        <dialog class="dialog signatureDialog" id="editSignatureDescriptionDialog" aria-labelledby="editSignatureDescriptionTitle">\n' +
'          <div id="editSignatureDescriptionContainer" class="mainContainer">\n' +
'            <div class="title">\n' +
'              <span id="editSignatureDescriptionTitle" role="sectionhead" data-l10n-id="pdfjs-editor-edit-signature-dialog-title" tabindex="0"></span>\n' +
'            </div>\n' +
'            <div id="editSignatureDescriptionAndView">\n' +
'              <div id="editSignatureDescriptionContainer">\n' +
'                <label for="editSignatureDescInput" data-l10n-id="pdfjs-editor-add-signature-description-label"></label>\n' +
'                <span id="editSignatureDescription" class="inputWithClearButton">\n' +
'                  <input id="editSignatureDescInput" type="text" data-l10n-id="pdfjs-editor-add-signature-description-input" tabindex="0" />\n' +
'                  <button class="clearInputButton" type="button" tabindex="0" aria-hidden="true"></button>\n' +
'                </span>\n' +
'              </div>\n' +
'              <svg id="editSignatureView" xmlns="http://www.w3.org/2000/svg"></svg>\n' +
'            </div>\n' +
'            <div class="dialogButtonsGroup">\n' +
'              <button id="editSignatureCancelButton" type="button" class="secondaryButton" tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-add-signature-cancel-button"></span>\n' +
'              </button>\n' +
'              <button id="editSignatureUpdateButton" type="button" class="primaryButton" disabled tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-edit-signature-update-button"></span>\n' +
'              </button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </dialog>\n' +
'\n' +
'        <dialog class="dialog commentManager" id="commentManagerDialog" aria-labelledby="commentManagerTitle">\n' +
'          <div class="mainContainer">\n' +
'            <div class="title" id="commentManagerToolbar">\n' +
'              <span id="commentManagerTitle" role="sectionhead" data-l10n-id="pdfjs-editor-edit-comment-dialog-title-when-adding"></span>\n' +
'            </div>\n' +
'            <textarea id="commentManagerTextInput" data-l10n-id="pdfjs-editor-edit-comment-dialog-text-input" tabindex="0"></textarea>\n' +
'            <div class="dialogButtonsGroup">\n' +
'              <button id="commentManagerCancelButton" type="button" class="secondaryButton" tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-edit-comment-dialog-cancel-button"></span>\n' +
'              </button>\n' +
'              <button id="commentManagerSaveButton" type="button" class="primaryButton" disabled tabindex="0">\n' +
'                <span data-l10n-id="pdfjs-editor-edit-comment-dialog-save-button-when-adding"></span>\n' +
'              </button>\n' +
'            </div>\n' +
'          </div>\n' +
'        </dialog>\n' +
'\n' +
'        <dialog id="printServiceDialog" style="min-width: 200px">\n' +
'          <div class="row">\n' +
'            <span data-l10n-id="pdfjs-print-progress-message"></span>\n' +
'          </div>\n' +
'          <div class="row">\n' +
'            <progress value="0" max="100"></progress>\n' +
'            <span data-l10n-id="pdfjs-print-progress-percent" data-l10n-args=\'{ "progress": 0 }\' class="relative-progress">0%</span>\n' +
'          </div>\n' +
'          <div class="buttonRow">\n' +
'            <button id="printCancel" class="dialogButton" type="button"><span data-l10n-id="pdfjs-print-progress-close-button"></span></button>\n' +
'          </div>\n' +
'        </dialog>\n' +
'      </div>\n' +
'      <!-- dialogContainer -->\n' +
'\n' +
'      <div id="editorUndoBar" class="messageBar" role="status" aria-labelledby="editorUndoBarMessage" tabindex="-1" hidden>\n' +
'        <div>\n' +
'          <div>\n' +
'            <span id="editorUndoBarMessage" class="description"></span>\n' +
'          </div>\n' +
'          <button id="editorUndoBarUndoButton" class="undoButton" type="button" tabindex="0" data-l10n-id="pdfjs-editor-undo-bar-undo-button">\n' +
'            <span data-l10n-id="pdfjs-editor-undo-bar-undo-button-label"></span>\n' +
'          </button>\n' +
'          <button id="editorUndoBarCloseButton" class="closeButton" type="button" tabindex="0" data-l10n-id="pdfjs-editor-undo-bar-close-button">\n' +
'            <span data-l10n-id="pdfjs-editor-undo-bar-close-button-label"></span>\n' +
'          </button>\n' +
'        </div>\n' +
'      </div>\n' +
'      <!-- editorUndoBar -->\n' +
'    </div>\n' +
'    <!-- outerContainer -->\n' +
'    <div id="printContainer"></div>\n' +
'  </pdfjs-wrapper>',
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

    // 
}();
