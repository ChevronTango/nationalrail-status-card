/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@formatjs/intl-utils/lib/src/diff.js":
/*!***********************************************************!*\
  !*** ./node_modules/@formatjs/intl-utils/lib/src/diff.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_THRESHOLDS: () => (/* binding */ DEFAULT_THRESHOLDS),
/* harmony export */   selectUnit: () => (/* binding */ selectUnit)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var MS_PER_SECOND = 1e3;
var SECS_PER_MIN = 60;
var SECS_PER_HOUR = SECS_PER_MIN * 60;
var SECS_PER_DAY = SECS_PER_HOUR * 24;
var SECS_PER_WEEK = SECS_PER_DAY * 7;
function selectUnit(from, to, thresholds) {
    if (to === void 0) { to = Date.now(); }
    if (thresholds === void 0) { thresholds = {}; }
    var resolvedThresholds = __assign(__assign({}, DEFAULT_THRESHOLDS), (thresholds || {}));
    var secs = (+from - +to) / MS_PER_SECOND;
    if (Math.abs(secs) < resolvedThresholds.second) {
        return {
            value: Math.round(secs),
            unit: 'second',
        };
    }
    var mins = secs / SECS_PER_MIN;
    if (Math.abs(mins) < resolvedThresholds.minute) {
        return {
            value: Math.round(mins),
            unit: 'minute',
        };
    }
    var hours = secs / SECS_PER_HOUR;
    if (Math.abs(hours) < resolvedThresholds.hour) {
        return {
            value: Math.round(hours),
            unit: 'hour',
        };
    }
    var days = secs / SECS_PER_DAY;
    if (Math.abs(days) < resolvedThresholds.day) {
        return {
            value: Math.round(days),
            unit: 'day',
        };
    }
    var fromDate = new Date(from);
    var toDate = new Date(to);
    var years = fromDate.getFullYear() - toDate.getFullYear();
    if (Math.round(Math.abs(years)) > 0) {
        return {
            value: Math.round(years),
            unit: 'year',
        };
    }
    var months = years * 12 + fromDate.getMonth() - toDate.getMonth();
    if (Math.round(Math.abs(months)) > 0) {
        return {
            value: Math.round(months),
            unit: 'month',
        };
    }
    var weeks = secs / SECS_PER_WEEK;
    return {
        value: Math.round(weeks),
        unit: 'week',
    };
}
var DEFAULT_THRESHOLDS = {
    second: 45,
    minute: 45,
    hour: 22,
    day: 5,
};


/***/ }),

/***/ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@marcokreeft/ha-editor-formbuilder/dist/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const custom_card_helpers_1 = __webpack_require__(/*! custom-card-helpers */ "./node_modules/custom-card-helpers/dist/index.m.js");
const lit_1 = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
const interfaces_1 = __webpack_require__(/*! ./interfaces */ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/interfaces.js");
const controls_1 = __webpack_require__(/*! ./utils/controls */ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/utils/controls.js");
class EditorForm extends lit_1.LitElement {
    constructor() {
        super(...arguments);
        this.controlRenderers = {
            [interfaces_1.FormControlType.Dropdown]: controls_1.renderDropdown,
            [interfaces_1.FormControlType.Radio]: controls_1.renderRadio,
            [interfaces_1.FormControlType.Checkboxes]: controls_1.renderCheckboxes,
            [interfaces_1.FormControlType.EntityDropdown]: controls_1.renderDropdown,
            [interfaces_1.FormControlType.Switch]: controls_1.renderSwitch,
            [interfaces_1.FormControlType.Textbox]: controls_1.renderTextbox,
            [interfaces_1.FormControlType.Filler]: controls_1.renderFiller,
        };
    }
    setConfig(config) {
        this._config = config;
        this.requestUpdate("_config");
    }
    set hass(hass) {
        this._hass = hass;
    }
    renderForm(formRows) {
        return (0, lit_1.html) `
            <div class="card-config">
                ${formRows.map(row => {
            const cssClass = row.cssClass ? `form-row ${row.cssClass}` : "form-row";
            return row.hidden ? '' : (0, lit_1.html) `
                        <div class="${cssClass}">
                            <label>${row.label}</label>
                            ${row.controls.map(control => this.renderControl(control))}
                        </div>
                        `;
        })}            
            </div>
            `;
    }
    renderControl(control) {
        const renderer = this.controlRenderers[control.type];
        if (!renderer) {
            throw new Error(`Unsupported control type: ${control.type}`);
        }
        return renderer(this, control);
    }
    _valueChanged(ev) {
        if (!this._config || !this._hass) {
            return;
        }
        const target = ev.target;
        const detail = ev.detail;
        if (target.tagName === "HA-CHECKBOX") {
            const index = this._config[target.configValue].indexOf(target.value);
            let newConfigValue;
            if (target.checked && index < 0) {
                newConfigValue = [...this._config[target.configValue], target.value];
            }
            else if (!target.checked && index > -1) {
                newConfigValue = [
                    ...this._config[target.configValue].slice(0, index),
                    ...this._config[target.configValue].slice(index + 1)
                ];
            }
            else {
                newConfigValue = this._config[target.configValue];
            }
            // Set the new immutable config
            this._config = {
                ...this._config,
                [target.configValue]: newConfigValue
            };
        }
        else if (target.configValue) {
            if (target.configValue.indexOf(".") > -1) {
                const [domain, configValue] = target.configValue.split(".");
                this._config = {
                    ...this._config,
                    [domain]: {
                        ...this._config[domain],
                        [configValue]: target.checked
                    }
                };
            }
            else {
                this._config = {
                    ...this._config,
                    [target.configValue]: target.checked !== undefined || !(detail === null || detail === void 0 ? void 0 : detail.value) ? target.value || target.checked : target.checked || detail.value,
                };
            }
        }
        (0, custom_card_helpers_1.fireEvent)(this, "config-changed", {
            config: this._config,
        }, {
            bubbles: true,
            composed: true,
        });
        this.requestUpdate("_config");
    }
    static get styles() {
        return (0, lit_1.css) `
            .form-row {
                margin-bottom: 10px;
            }
            .form-control {
                display: flex;
                align-items: center;
            }
            ha-switch {
                padding: 16px 6px;
            }
            .side-by-side {
                display: flex;
                flex-flow: row wrap;
            }            
            .side-by-side > label {
                width: 100%;
            }
            .side-by-side > .form-control {
                width: 49%;
                padding: 2px;
            }
            ha-textfield { 
                width: 100%;
            }
        `;
    }
}
exports["default"] = EditorForm;


/***/ }),

/***/ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/interfaces.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@marcokreeft/ha-editor-formbuilder/dist/interfaces.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormControlType = void 0;
var FormControlType;
(function (FormControlType) {
    FormControlType["Dropdown"] = "dropdown";
    FormControlType["Checkbox"] = "checkbox";
    FormControlType["Checkboxes"] = "checkboxes";
    FormControlType["Radio"] = "radio";
    FormControlType["Switch"] = "switch";
    FormControlType["Textbox"] = "textbox";
    FormControlType["Filler"] = "filler";
    FormControlType["EntityDropdown"] = "entity-dropdown";
})(FormControlType || (exports.FormControlType = FormControlType = {}));


/***/ }),

/***/ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/utils/controls.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@marcokreeft/ha-editor-formbuilder/dist/utils/controls.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.renderCheckboxes = exports.renderRadio = exports.renderDropdown = exports.renderSwitch = exports.renderTextbox = exports.renderEntityDropdown = exports.renderFiller = void 0;
const lit_1 = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
const entities_1 = __webpack_require__(/*! ./entities */ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/utils/entities.js");
const renderFiller = () => {
    return (0, lit_1.html) `<div class="form-control"></div>`;
};
exports.renderFiller = renderFiller;
const renderEntityDropdown = (card, control) => {
    var _a;
    return (0, lit_1.html) `
    <div class="form-control">
        <ha-entity-picker
            label="${control.label}"
            .value="${(_a = card._config[control.configValue]) !== null && _a !== void 0 ? _a : ''}"
            .configValue="${control.configValue}"
            .hass="${card._hass}"
            domain-filter="${control.domain}"
            @change="${card._valueChanged}">
        </ha-entity-picker>
    </div>
    `;
};
exports.renderEntityDropdown = renderEntityDropdown;
const renderTextbox = (card, control) => {
    var _a;
    return (0, lit_1.html) `
    <div class="form-control">
        <ha-textfield
            label="${control.label}"
            .value="${(_a = card._config[control.configValue]) !== null && _a !== void 0 ? _a : ''}"
            .configValue="${control.configValue}"
            @change="${card._valueChanged}">
        </ha-textfield>
    </div>
    `;
};
exports.renderTextbox = renderTextbox;
const renderSwitch = (card, control) => {
    return (0, lit_1.html) `
    <div class="form-control">
        <ha-switch
            id="${control.configValue}"
            name="${control.configValue}"
            .checked="${card._config[control.configValue]}"
            .configValue="${control.configValue}"
            @change="${card._valueChanged}"
        >
        </ha-switch>
        <label for="${control.configValue}">${control.label}</label>
    </div>
    `;
};
exports.renderSwitch = renderSwitch;
const renderDropdown = (card, control) => {
    var _a;
    const items = (_a = control.items) !== null && _a !== void 0 ? _a : (0, entities_1.getEntitiesByDomain)(card._hass, control.domain);
    return (0, lit_1.html) `  
    <div class="form-control">
        <ha-combo-box
            label="${control.label}"
            .value="${card._config[control.configValue]}"
            .configValue="${control.configValue}"
            .items="${items}"
            @value-changed="${card._valueChanged}"
            @change=${card._valueChanged}
        ></ha-combo-box>
    </div>
      `;
};
exports.renderDropdown = renderDropdown;
const renderRadio = (card, control) => {
    return (0, lit_1.html) `
        <div class="form-control">
            <label>${control.label}</label>
            ${control.items.map(item => {
        return (0, lit_1.html) `
                    <ha-radio
                        id="${control.configValue}_${item.value}"
                        name="${control.configValue}"
                        .checked="${card._config[control.configValue] === item.value}"
                        .configValue="${control.configValue}"
                        .value="${item.value}"
                        @change="${card._valueChanged}"
                    >
                    </ha-radio>
                    <label for="${control.configValue}_${item.value}">${item.label}</label>
                `;
    })}
        </div>
      `;
};
exports.renderRadio = renderRadio;
const renderCheckboxes = (card, control) => {
    return (0, lit_1.html) `
        <label>${control.label}</label>
        ${control.items.map(item => {
        var _a;
        return (0, lit_1.html) `                
            <div class="form-control">
                <ha-checkbox
                    id="${control.configValue}_${item.value}"
                    name="${control.configValue}[]"
                    .checked="${((_a = card._config[control.configValue]) === null || _a === void 0 ? void 0 : _a.indexOf(item.value)) > -1}"
                    .configValue="${control.configValue}"
                    .value="${item.value}"
                    @change="${card._valueChanged}"
                >
                </ha-checkbox>
                <label for="${control.configValue}_${item.value}">${item.label}</label>
            </div>
            `;
    })}
      `;
};
exports.renderCheckboxes = renderCheckboxes;


/***/ }),

/***/ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/utils/entities.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@marcokreeft/ha-editor-formbuilder/dist/utils/entities.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDropdownOptionsFromEnum = exports.formatList = exports.getEntitiesByDeviceClass = exports.getEntitiesByDomain = void 0;
const getEntitiesByDomain = (hass, domain) => {
    return Object.keys(hass.states)
        .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain)
        .map((item) => (0, exports.formatList)(item, hass));
};
exports.getEntitiesByDomain = getEntitiesByDomain;
const getEntitiesByDeviceClass = (hass, domain, device_class) => {
    return Object.keys(hass.states)
        .filter((eid) => eid.substr(0, eid.indexOf(".")) === domain && hass.states[eid].attributes.device_class === device_class)
        .map((item) => (0, exports.formatList)(item, hass));
};
exports.getEntitiesByDeviceClass = getEntitiesByDeviceClass;
const formatList = (entity, hass) => ({
    label: hass.states[entity].attributes.friendly_name,
    value: entity
});
exports.formatList = formatList;
const getDropdownOptionsFromEnum = (enumValues) => {
    const options = [];
    for (const [key, value] of Object.entries(enumValues)) {
        options.push({ value: value, label: key });
    }
    return options;
};
exports.getDropdownOptionsFromEnum = getDropdownOptionsFromEnum;


/***/ }),

/***/ "./node_modules/custom-card-helpers/dist/index.m.js":
/*!**********************************************************!*\
  !*** ./node_modules/custom-card-helpers/dist/index.m.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_DOMAIN_ICON: () => (/* binding */ G),
/* harmony export */   DEFAULT_PANEL: () => (/* binding */ J),
/* harmony export */   DEFAULT_VIEW_ENTITY_ID: () => (/* binding */ re),
/* harmony export */   DOMAINS_HIDE_MORE_INFO: () => (/* binding */ X),
/* harmony export */   DOMAINS_MORE_INFO_NO_HISTORY: () => (/* binding */ Y),
/* harmony export */   DOMAINS_TOGGLE: () => (/* binding */ $),
/* harmony export */   DOMAINS_WITH_CARD: () => (/* binding */ K),
/* harmony export */   DOMAINS_WITH_MORE_INFO: () => (/* binding */ Q),
/* harmony export */   NumberFormat: () => (/* binding */ t),
/* harmony export */   STATES_OFF: () => (/* binding */ Z),
/* harmony export */   TimeFormat: () => (/* binding */ r),
/* harmony export */   UNIT_C: () => (/* binding */ ee),
/* harmony export */   UNIT_F: () => (/* binding */ te),
/* harmony export */   applyThemesOnElement: () => (/* binding */ q),
/* harmony export */   computeCardSize: () => (/* binding */ A),
/* harmony export */   computeDomain: () => (/* binding */ E),
/* harmony export */   computeEntity: () => (/* binding */ j),
/* harmony export */   computeRTL: () => (/* binding */ R),
/* harmony export */   computeRTLDirection: () => (/* binding */ z),
/* harmony export */   computeStateDisplay: () => (/* binding */ W),
/* harmony export */   computeStateDomain: () => (/* binding */ L),
/* harmony export */   createThing: () => (/* binding */ oe),
/* harmony export */   debounce: () => (/* binding */ ue),
/* harmony export */   domainIcon: () => (/* binding */ me),
/* harmony export */   evaluateFilter: () => (/* binding */ se),
/* harmony export */   fireEvent: () => (/* binding */ ne),
/* harmony export */   fixedIcons: () => (/* binding */ ce),
/* harmony export */   formatDate: () => (/* binding */ a),
/* harmony export */   formatDateMonth: () => (/* binding */ f),
/* harmony export */   formatDateMonthYear: () => (/* binding */ l),
/* harmony export */   formatDateNumeric: () => (/* binding */ u),
/* harmony export */   formatDateShort: () => (/* binding */ m),
/* harmony export */   formatDateTime: () => (/* binding */ v),
/* harmony export */   formatDateTimeNumeric: () => (/* binding */ k),
/* harmony export */   formatDateTimeWithSeconds: () => (/* binding */ y),
/* harmony export */   formatDateWeekday: () => (/* binding */ n),
/* harmony export */   formatDateYear: () => (/* binding */ p),
/* harmony export */   formatNumber: () => (/* binding */ H),
/* harmony export */   formatTime: () => (/* binding */ D),
/* harmony export */   formatTimeWeekday: () => (/* binding */ I),
/* harmony export */   formatTimeWithSeconds: () => (/* binding */ F),
/* harmony export */   forwardHaptic: () => (/* binding */ le),
/* harmony export */   getLovelace: () => (/* binding */ ke),
/* harmony export */   handleAction: () => (/* binding */ he),
/* harmony export */   handleActionConfig: () => (/* binding */ pe),
/* harmony export */   handleClick: () => (/* binding */ be),
/* harmony export */   hasAction: () => (/* binding */ ve),
/* harmony export */   hasConfigOrEntityChanged: () => (/* binding */ _e),
/* harmony export */   hasDoubleClick: () => (/* binding */ ye),
/* harmony export */   isNumericState: () => (/* binding */ P),
/* harmony export */   navigate: () => (/* binding */ de),
/* harmony export */   numberFormatToLocale: () => (/* binding */ U),
/* harmony export */   relativeTime: () => (/* binding */ M),
/* harmony export */   round: () => (/* binding */ B),
/* harmony export */   stateIcon: () => (/* binding */ Se),
/* harmony export */   timerTimeRemaining: () => (/* binding */ C),
/* harmony export */   toggleEntity: () => (/* binding */ ge),
/* harmony export */   turnOnOffEntities: () => (/* binding */ we),
/* harmony export */   turnOnOffEntity: () => (/* binding */ fe)
/* harmony export */ });
/* harmony import */ var _formatjs_intl_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @formatjs/intl-utils */ "./node_modules/@formatjs/intl-utils/lib/src/diff.js");
var t,r,n=function(e,t){return i(t).format(e)},i=function(e){return new Intl.DateTimeFormat(e.language,{weekday:"long",month:"long",day:"numeric"})},a=function(e,t){return o(t).format(e)},o=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric"})},u=function(e,t){return c(t).format(e)},c=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"numeric",day:"numeric"})},m=function(e,t){return s(t).format(e)},s=function(e){return new Intl.DateTimeFormat(e.language,{day:"numeric",month:"short"})},l=function(e,t){return d(t).format(e)},d=function(e){return new Intl.DateTimeFormat(e.language,{month:"long",year:"numeric"})},f=function(e,t){return g(t).format(e)},g=function(e){return new Intl.DateTimeFormat(e.language,{month:"long"})},p=function(e,t){return h(t).format(e)},h=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric"})};!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(t||(t={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(r||(r={}));var b=function(e){if(e.time_format===r.language||e.time_format===r.system){var t=e.time_format===r.language?e.language:void 0,n=(new Date).toLocaleString(t);return n.includes("AM")||n.includes("PM")}return e.time_format===r.am_pm},v=function(e,t){return _(t).format(e)},_=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric",hour:b(e)?"numeric":"2-digit",minute:"2-digit",hour12:b(e)})},y=function(e,t){return w(t).format(e)},w=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric",hour:b(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:b(e)})},k=function(e,t){return x(t).format(e)},x=function(e){return new Intl.DateTimeFormat(e.language,{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:b(e)})},D=function(e,t){return S(t).format(e)},S=function(e){return new Intl.DateTimeFormat(e.language,{hour:"numeric",minute:"2-digit",hour12:b(e)})},F=function(e,t){return T(t).format(e)},T=function(e){return new Intl.DateTimeFormat(e.language,{hour:b(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:b(e)})},I=function(e,t){return N(t).format(e)},N=function(e){return new Intl.DateTimeFormat(e.language,{hour:b(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:b(e)})},M=function(t,r,n,i){void 0===i&&(i=!0);var a=(0,_formatjs_intl_utils__WEBPACK_IMPORTED_MODULE_0__.selectUnit)(t,n);return i?function(e){return new Intl.RelativeTimeFormat(e.language,{numeric:"auto"})}(r).format(a.value,a.unit):Intl.NumberFormat(r.language,{style:"unit",unit:a.unit,unitDisplay:"long"}).format(Math.abs(a.value))};function C(e){var t,r=3600*(t=e.attributes.remaining.split(":").map(Number))[0]+60*t[1]+t[2];if("active"===e.state){var n=(new Date).getTime(),i=new Date(e.last_changed).getTime();r=Math.max(r-(n-i)/1e3,0)}return r}function O(){return(O=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}var q=function(e,t,r,n){void 0===n&&(n=!1),e._themes||(e._themes={});var i=t.default_theme;("default"===r||r&&t.themes[r])&&(i=r);var a=O({},e._themes);if("default"!==i){var o=t.themes[i];Object.keys(o).forEach(function(t){var r="--"+t;e._themes[r]="",a[r]=o[t]})}if(e.updateStyles?e.updateStyles(a):window.ShadyCSS&&window.ShadyCSS.styleSubtree(e,a),n){var u=document.querySelector("meta[name=theme-color]");if(u){u.hasAttribute("default-content")||u.setAttribute("default-content",u.getAttribute("content"));var c=a["--primary-color"]||u.getAttribute("default-content");u.setAttribute("content",c)}}},A=function(e){return"function"==typeof e.getCardSize?e.getCardSize():4};function E(e){return e.substr(0,e.indexOf("."))}function j(e){return e.substr(e.indexOf(".")+1)}function R(e){var t,r=(null==e||null==(t=e.locale)?void 0:t.language)||"en";return e.translationMetadata.translations[r]&&e.translationMetadata.translations[r].isRTL||!1}function z(e){return R(e)?"rtl":"ltr"}function L(e){return E(e.entity_id)}var P=function(e){return!!e.attributes.unit_of_measurement||!!e.attributes.state_class},U=function(e){switch(e.number_format){case t.comma_decimal:return["en-US","en"];case t.decimal_comma:return["de","es","it"];case t.space_comma:return["fr","sv","cs"];case t.system:return;default:return e.language}},B=function(e,t){return void 0===t&&(t=2),Math.round(e*Math.pow(10,t))/Math.pow(10,t)},H=function(e,r,n){var i=r?U(r):void 0;if(Number.isNaN=Number.isNaN||function e(t){return"number"==typeof t&&e(t)},(null==r?void 0:r.number_format)!==t.none&&!Number.isNaN(Number(e))&&Intl)try{return new Intl.NumberFormat(i,V(e,n)).format(Number(e))}catch(t){return console.error(t),new Intl.NumberFormat(void 0,V(e,n)).format(Number(e))}return"string"==typeof e?e:B(e,null==n?void 0:n.maximumFractionDigits).toString()+("currency"===(null==n?void 0:n.style)?" "+n.currency:"")},V=function(e,t){var r=O({maximumFractionDigits:2},t);if("string"!=typeof e)return r;if(!t||!t.minimumFractionDigits&&!t.maximumFractionDigits){var n=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=n,r.maximumFractionDigits=n}return r},W=function(e,t,r,n){var i=void 0!==n?n:t.state;if("unknown"===i||"unavailable"===i)return e("state.default."+i);if(P(t)){if("monetary"===t.attributes.device_class)try{return H(i,r,{style:"currency",currency:t.attributes.unit_of_measurement})}catch(e){}return H(i,r)+(t.attributes.unit_of_measurement?" "+t.attributes.unit_of_measurement:"")}var o=L(t);if("input_datetime"===o){var u;if(void 0===n)return t.attributes.has_date&&t.attributes.has_time?(u=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day,t.attributes.hour,t.attributes.minute),v(u,r)):t.attributes.has_date?(u=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day),a(u,r)):t.attributes.has_time?((u=new Date).setHours(t.attributes.hour,t.attributes.minute),D(u,r)):t.state;try{var c=n.split(" ");if(2===c.length)return v(new Date(c.join("T")),r);if(1===c.length){if(n.includes("-"))return a(new Date(n+"T00:00"),r);if(n.includes(":")){var m=new Date;return D(new Date(m.toISOString().split("T")[0]+"T"+n),r)}}return n}catch(e){return n}}return"humidifier"===o&&"on"===i&&t.attributes.humidity?t.attributes.humidity+" %":"counter"===o||"number"===o||"input_number"===o?H(i,r):t.attributes.device_class&&e("component."+o+".state."+t.attributes.device_class+"."+i)||e("component."+o+".state._."+i)||i},G="mdi:bookmark",J="lovelace",K=["climate","cover","configurator","input_select","input_number","input_text","lock","media_player","scene","script","timer","vacuum","water_heater","weblink"],Q=["alarm_control_panel","automation","camera","climate","configurator","cover","fan","group","history_graph","input_datetime","light","lock","media_player","script","sun","updater","vacuum","water_heater","weather"],X=["input_number","input_select","input_text","scene","weblink"],Y=["camera","configurator","history_graph","scene"],Z=["closed","locked","off"],$=new Set(["fan","input_boolean","light","switch","group","automation"]),ee="°C",te="°F",re="group.default_view",ne=function(e,t,r,n){n=n||{},r=null==r?{}:r;var i=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return i.detail=r,e.dispatchEvent(i),i},ie=new Set(["call-service","divider","section","weblink","cast","select"]),ae={alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"},oe=function(e,t){void 0===t&&(t=!1);var r=function(e,t){return n("hui-error-card",{type:"error",error:e,config:t})},n=function(e,t){var n=window.document.createElement(e);try{if(!n.setConfig)return;n.setConfig(t)}catch(n){return console.error(e,n),r(n.message,t)}return n};if(!e||"object"!=typeof e||!t&&!e.type)return r("No type defined",e);var i=e.type;if(i&&i.startsWith("custom:"))i=i.substr("custom:".length);else if(t)if(ie.has(i))i="hui-"+i+"-row";else{if(!e.entity)return r("Invalid config given.",e);var a=e.entity.split(".",1)[0];i="hui-"+(ae[a]||"text")+"-entity-row"}else i="hui-"+i+"-card";if(customElements.get(i))return n(i,e);var o=r("Custom element doesn't exist: "+e.type+".",e);o.style.display="None";var u=setTimeout(function(){o.style.display=""},2e3);return customElements.whenDefined(e.type).then(function(){clearTimeout(u),ne(o,"ll-rebuild",{},o)}),o},ue=function(e,t,r){var n;return void 0===r&&(r=!1),function(){var i=[].slice.call(arguments),a=this,o=function(){n=null,r||e.apply(a,i)},u=r&&!n;clearTimeout(n),n=setTimeout(o,t),u&&e.apply(a,i)}},ce={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function me(e,t){if(e in ce)return ce[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell"}case"binary_sensor":return t&&"off"===t?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===t?"mdi:window-closed":"mdi:window-open";case"lock":return t&&"unlocked"===t?"mdi:lock-open":"mdi:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"mdi:cast-connected":"mdi:cast";case"zwave":switch(t){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+e+" ("+t+")"),"mdi:bookmark"}}var se=function(e,t){var r=t.value||t,n=t.attribute?e.attributes[t.attribute]:e.state;switch(t.operator||"=="){case"==":return n===r;case"<=":return n<=r;case"<":return n<r;case">=":return n>=r;case">":return n>r;case"!=":return n!==r;case"regex":return n.match(r);default:return!1}},le=function(e){ne(window,"haptic",e)},de=function(e,t,r){void 0===r&&(r=!1),r?history.replaceState(null,"",t):history.pushState(null,"",t),ne(window,"location-changed",{replace:r})},fe=function(e,t,r){void 0===r&&(r=!0);var n,i=E(t),a="group"===i?"homeassistant":i;switch(i){case"lock":n=r?"unlock":"lock";break;case"cover":n=r?"open_cover":"close_cover";break;default:n=r?"turn_on":"turn_off"}return e.callService(a,n,{entity_id:t})},ge=function(e,t){var r=Z.includes(e.states[t].state);return fe(e,t,r)},pe=function(e,t,r,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some(function(e){return e.user===t.user.id})||(le("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(r.entity||r.camera_image)&&ne(e,"hass-more-info",{entityId:r.entity?r.entity:r.camera_image});break;case"navigate":n.navigation_path&&de(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":r.entity&&(ge(t,r.entity),le("success"));break;case"call-service":if(!n.service)return void le("failure");var i=n.service.split(".",2);t.callService(i[0],i[1],n.service_data,n.target),le("success");break;case"fire-dom-event":ne(e,"ll-custom",n)}},he=function(e,t,r,n){var i;"double_tap"===n&&r.double_tap_action?i=r.double_tap_action:"hold"===n&&r.hold_action?i=r.hold_action:"tap"===n&&r.tap_action&&(i=r.tap_action),pe(e,t,r,i)},be=function(e,t,r,n,i){var a;if(i&&r.double_tap_action?a=r.double_tap_action:n&&r.hold_action?a=r.hold_action:!n&&r.tap_action&&(a=r.tap_action),a||(a={action:"more-info"}),!a.confirmation||a.confirmation.exemptions&&a.confirmation.exemptions.some(function(e){return e.user===t.user.id})||confirm(a.confirmation.text||"Are you sure you want to "+a.action+"?"))switch(a.action){case"more-info":(a.entity||r.entity||r.camera_image)&&(ne(e,"hass-more-info",{entityId:a.entity?a.entity:r.entity?r.entity:r.camera_image}),a.haptic&&le(a.haptic));break;case"navigate":a.navigation_path&&(de(0,a.navigation_path),a.haptic&&le(a.haptic));break;case"url":a.url_path&&window.open(a.url_path),a.haptic&&le(a.haptic);break;case"toggle":r.entity&&(ge(t,r.entity),a.haptic&&le(a.haptic));break;case"call-service":if(!a.service)return;var o=a.service.split(".",2),u=o[0],c=o[1],m=O({},a.service_data);"entity"===m.entity_id&&(m.entity_id=r.entity),t.callService(u,c,m,a.target),a.haptic&&le(a.haptic);break;case"fire-dom-event":ne(e,"ll-custom",a),a.haptic&&le(a.haptic)}};function ve(e){return void 0!==e&&"none"!==e.action}function _e(e,t,r){if(t.has("config")||r)return!0;if(e.config.entity){var n=t.get("hass");return!n||n.states[e.config.entity]!==e.hass.states[e.config.entity]}return!1}function ye(e){return void 0!==e&&"none"!==e.action}var we=function(e,t,r){void 0===r&&(r=!0);var n={};t.forEach(function(t){if(Z.includes(e.states[t].state)===r){var i=E(t),a=["cover","lock"].includes(i)?i:"homeassistant";a in n||(n[a]=[]),n[a].push(t)}}),Object.keys(n).forEach(function(t){var i;switch(t){case"lock":i=r?"unlock":"lock";break;case"cover":i=r?"open_cover":"close_cover";break;default:i=r?"turn_on":"turn_off"}e.callService(t,i,{entity_id:n[t]})})},ke=function(){var e=document.querySelector("home-assistant");if(e=(e=(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-root")){var t=e.lovelace;return t.current_view=e.___curView,t}return null},xe={humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",temperature:"mdi:thermometer",pressure:"mdi:gauge",power:"mdi:flash",signal_strength:"mdi:wifi"},De={binary_sensor:function(e,t){var r="off"===e;switch(null==t?void 0:t.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"cold":return r?"mdi:thermometer":"mdi:snowflake";case"connectivity":return r?"mdi:server-network-off":"mdi:server-network";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:check-circle":"mdi:smoke";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:walk":"mdi:run";case"occupancy":return r?"mdi:home-outline":"mdi:home";case"opening":return r?"mdi:square":"mdi:square-outline";case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}},cover:function(e){var t="closed"!==e.state;switch(e.attributes.device_class){case"garage":return t?"mdi:garage-open":"mdi:garage";case"door":return t?"mdi:door-open":"mdi:door-closed";case"shutter":return t?"mdi:window-shutter-open":"mdi:window-shutter";case"blind":return t?"mdi:blinds-open":"mdi:blinds";case"window":return t?"mdi:window-open":"mdi:window-closed";default:return me("cover",e.state)}},sensor:function(e){var t=e.attributes.device_class;if(t&&t in xe)return xe[t];if("battery"===t){var r=Number(e.state);if(isNaN(r))return"mdi:battery-unknown";var n=10*Math.round(r/10);return n>=100?"mdi:battery":n<=0?"mdi:battery-alert":"hass:battery-"+n}var i=e.attributes.unit_of_measurement;return"°C"===i||"°F"===i?"mdi:thermometer":me("sensor")},input_datetime:function(e){return e.attributes.has_date?e.attributes.has_time?me("input_datetime"):"mdi:calendar":"mdi:clock"}},Se=function(e){if(!e)return"mdi:bookmark";if(e.attributes.icon)return e.attributes.icon;var t=E(e.entity_id);return t in De?De[t](e):me(t,e.state)};
//# sourceMappingURL=index.m.js.map


/***/ }),

/***/ "./src/index-editor.js":
/*!*****************************!*\
  !*** ./src/index-editor.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NationalrailStatusCardEditor)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
/* harmony import */ var _marcokreeft_ha_editor_formbuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @marcokreeft/ha-editor-formbuilder */ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/index.js");
/* harmony import */ var _marcokreeft_ha_editor_formbuilder_dist_interfaces_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @marcokreeft/ha-editor-formbuilder/dist/interfaces.js */ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/interfaces.js");
/* harmony import */ var _marcokreeft_ha_editor_formbuilder_dist_utils_entities_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @marcokreeft/ha-editor-formbuilder/dist/utils/entities.js */ "./node_modules/@marcokreeft/ha-editor-formbuilder/dist/utils/entities.js");







function filterTrainEntities(_hass, items) {
  return items.filter(item => {
    return item.value.startsWith("sensor.train_schedule");
  });
}

class NationalrailStatusCardEditor extends _marcokreeft_ha_editor_formbuilder__WEBPACK_IMPORTED_MODULE_1__["default"] {

  static get properties() {
    return { _hass: {}, _config: {} };
  }

  setConfig(config) {
    this._config = config;
  }

  render() {
    if (!this._hass || !this._config) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)``;
    }
    return this.renderForm([
      { controls: [{ label: "Entity", configValue: "entity", type: _marcokreeft_ha_editor_formbuilder_dist_interfaces_js__WEBPACK_IMPORTED_MODULE_2__.FormControlType.Dropdown, items: filterTrainEntities(this._hass, (0,_marcokreeft_ha_editor_formbuilder_dist_utils_entities_js__WEBPACK_IMPORTED_MODULE_3__.getEntitiesByDomain)(this._hass, "sensor")) }] },
      { controls: [{ label: "Number of trains to shown", configValue: "limit", type: _marcokreeft_ha_editor_formbuilder_dist_interfaces_js__WEBPACK_IMPORTED_MODULE_2__.FormControlType.Textbox }] },
    ])
  };
}

/***/ }),

/***/ "./src/style.js":
/*!**********************!*\
  !*** ./src/style.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");




const style = (0,lit__WEBPACK_IMPORTED_MODULE_0__.css)`
#nationalrail-status {
  padding:16px;
}
.train {
  display:flex;
  flex-direction:column;
  padding:5px;
  border:1px white solid;
  border-radius: 5px;
  margin: 2px 0px;
}
.top-heading {
  display:flex;
  flex-direction:row;
  flex-basis:100%;
  margin-bottom:5px;
}
.scheduled-container {
  display:flex;
  flex-basis:100%;
}
.scheduled-status {
  padding-left: 5px;
}
.platform-container {
  display:flex;
}
.platform-label {
  padding-right: 5px;
}
.details {
  margin-top:5px;
}
h3, h4 {
  margin:0;
}
h4 {
  font-style: italic;
  font-weight: 500;
}
.peturbed {
color: #ff4141;
}
.warning {
color: #f3f345;
}
.good {
color: #52ff52;
}
`;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (style);


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   destinationPresent: () => (/* binding */ destinationPresent),
/* harmony export */   lengthJourney: () => (/* binding */ lengthJourney),
/* harmony export */   parseToTime: () => (/* binding */ parseToTime),
/* harmony export */   status: () => (/* binding */ status)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");


const parseToTime = (input) => {
  const d = new Date(input);

  const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
  const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  return h + ':' + m;
}

const destinationPresent = (dest, start) => {
  const time_at_destination = parseToTime(dest.time_at_destination);
  const scheduled_time_at_destination = parseToTime(dest.scheduled_time_at_destination);
  let output = `${dest.name} (`
  if (!Date.parse(dest.time_at_destination)) {
    output += `${scheduled_time_at_destination} ${dest.time_at_destination}`
  }
  else if (scheduled_time_at_destination !== time_at_destination) {
    output += `${time_at_destination}`
  }
  else {
    output += `${scheduled_time_at_destination}`
  }
  const length = lengthJourney(start, dest.time_at_destination, dest.scheduled_time_at_destination);
  if (length !== '?') {
    output += ' - ' + length + 'm';
  }
  output += ')';
  return output;
}

const status = (train) => {
  if (train.perturbation) {
    if (!Date.parse(train.expected)) {
      return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="peturbed">${train.expected}</span>`;
    }
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="peturbed">Expected ${parseToTime(train.expected)}</span>`;
  }
  else if (train.scheduled !== train.expected) {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="warning">Expected ${parseToTime(train.expected)}</span>`;
  }
  else {
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<span class="good">On Time</span>`;
  }
}


const lengthJourney = (start, end, scheduled) => {
  const startTime = Date.parse(start);
  const endTime = Date.parse(end) ?? Date.parse(scheduled);
  if (!endTime) {
    return '?';
  }
  const d = endTime - startTime;

  return d / 60 / 1000;
}


/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/css-tag.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/css-tag.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* binding */ CSSResult),
/* harmony export */   adoptStyles: () => (/* binding */ adoptStyles),
/* harmony export */   css: () => (/* binding */ css),
/* harmony export */   getCompatibleStyle: () => (/* binding */ getCompatibleStyle),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* binding */ supportsAdoptingStyleSheets),
/* harmony export */   unsafeCSS: () => (/* binding */ unsafeCSS)
/* harmony export */ });
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const NODE_MODE = false;
// Allows minifiers to rename references to globalThis
const global = globalThis;
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = global.ShadowRoot &&
    (global.ShadyCSS === undefined || global.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
const cssTagCache = new WeakMap();
/**
 * A container for a string of CSS text, that may be used to create a CSSStyleSheet.
 *
 * CSSResult is the return value of `css`-tagged template literals and
 * `unsafeCSS()`. In order to ensure that CSSResults are only created via the
 * `css` tag and `unsafeCSS()`, CSSResult cannot be constructed directly.
 */
class CSSResult {
    constructor(cssText, strings, safeToken) {
        // This property needs to remain unminified.
        this['_$cssResult$'] = true;
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
        this._strings = strings;
    }
    // This is a getter so that it's lazy. In practice, this means stylesheets
    // are not created until the first element instance is made.
    get styleSheet() {
        // If `supportsAdoptingStyleSheets` is true then we assume CSSStyleSheet is
        // constructable.
        let styleSheet = this._styleSheet;
        const strings = this._strings;
        if (supportsAdoptingStyleSheets && styleSheet === undefined) {
            const cacheable = strings !== undefined && strings.length === 1;
            if (cacheable) {
                styleSheet = cssTagCache.get(strings);
            }
            if (styleSheet === undefined) {
                (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
                if (cacheable) {
                    cssTagCache.set(strings, styleSheet);
                }
            }
        }
        return styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    // This property needs to remain unminified.
    if (value['_$cssResult$'] === true) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ` +
            `${value}. Use 'unsafeCSS' to pass non-literal values, but take care ` +
            `to ensure page security.`);
    }
};
/**
 * Wrap a value for interpolation in a {@linkcode css} tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => new CSSResult(typeof value === 'string' ? value : String(value), undefined, constructionToken);
/**
 * A template literal tag which can be used with LitElement's
 * {@linkcode LitElement.styles} property to set element styles.
 *
 * For security reasons, only literal string values and number may be used in
 * embedded expressions. To incorporate non-literal values {@linkcode unsafeCSS}
 * may be used inside an expression.
 */
const css = (strings, ...values) => {
    const cssText = strings.length === 1
        ? strings[0]
        : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, strings, constructionToken);
};
/**
 * Applies the given styles to a `shadowRoot`. When Shadow DOM is
 * available but `adoptedStyleSheets` is not, styles are appended to the
 * `shadowRoot` to [mimic spec behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
 * Note, when shimming is used, any styles that are subsequently placed into
 * the shadowRoot should be placed *before* any shimmed adopted styles. This
 * will match spec behavior that gives adopted sheets precedence over styles in
 * shadowRoot.
 */
const adoptStyles = (renderRoot, styles) => {
    if (supportsAdoptingStyleSheets) {
        renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    }
    else {
        for (const s of styles) {
            const style = document.createElement('style');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nonce = global['litNonce'];
            if (nonce !== undefined) {
                style.setAttribute('nonce', nonce);
            }
            style.textContent = s.cssText;
            renderRoot.appendChild(style);
        }
    }
};
const cssResultFromStyleSheet = (sheet) => {
    let cssText = '';
    for (const rule of sheet.cssRules) {
        cssText += rule.cssText;
    }
    return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets ||
    (NODE_MODE && global.CSSStyleSheet === undefined)
    ? (s) => s
    : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
//# sourceMappingURL=css-tag.js.map

/***/ }),

/***/ "./node_modules/@lit/reactive-element/development/reactive-element.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@lit/reactive-element/development/reactive-element.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   ReactiveElement: () => (/* binding */ ReactiveElement),
/* harmony export */   adoptStyles: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   defaultConverter: () => (/* binding */ defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   notEqual: () => (/* binding */ notEqual),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _css_tag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css-tag.js */ "./node_modules/@lit/reactive-element/development/css-tag.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Use this module if you want to create your own base class extending
 * {@link ReactiveElement}.
 * @packageDocumentation
 */

// In the Node build, this import will be injected by Rollup:
// import {HTMLElement, customElements} from '@lit-labs/ssr-dom-shim';

// TODO (justinfagnani): Add `hasOwn` here when we ship ES2022
const { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf, } = Object;
const NODE_MODE = false;
// Lets a minifier replace globalThis references with a minified name
const global = globalThis;
if (NODE_MODE) {
    global.customElements ??= customElements;
}
const DEV_MODE = true;
let issueWarning;
const trustedTypes = global
    .trustedTypes;
// Temporary workaround for https://crbug.com/993268
// Currently, any attribute starting with "on" is considered to be a
// TrustedScript source. Such boolean attributes must be set to the equivalent
// trusted emptyScript value.
const emptyStringForBooleanAttribute = trustedTypes
    ? trustedTypes.emptyScript
    : '';
const polyfillSupport = DEV_MODE
    ? global.reactiveElementPolyfillSupportDevMode
    : global.reactiveElementPolyfillSupport;
if (DEV_MODE) {
    // Ensure warnings are issued only 1x, even if multiple versions of Lit
    // are loaded.
    const issuedWarnings = (global.litIssuedWarnings ??=
        new Set());
    // Issue a warning, if we haven't already.
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!issuedWarnings.has(warning)) {
            console.warn(warning);
            issuedWarnings.add(warning);
        }
    };
    issueWarning('dev-mode', `Lit is in dev mode. Not recommended for production!`);
    // Issue polyfill support warning.
    if (global.ShadyDOM?.inUse && polyfillSupport === undefined) {
        issueWarning('polyfill-support-missing', `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
            `the \`polyfill-support\` module has not been loaded.`);
    }
}
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent = DEV_MODE
    ? (event) => {
        const shouldEmit = global
            .emitLitDebugLogEvents;
        if (!shouldEmit) {
            return;
        }
        global.dispatchEvent(new CustomEvent('lit-debug', {
            detail: event,
        }));
    }
    : undefined;
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                value = value ? emptyStringForBooleanAttribute : null;
                break;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                value = value == null ? value : JSON.stringify(value);
                break;
        }
        return value;
    },
    fromAttribute(value, type) {
        let fromValue = value;
        switch (type) {
            case Boolean:
                fromValue = value !== null;
                break;
            case Number:
                fromValue = value === null ? null : Number(value);
                break;
            case Object:
            case Array:
                // Do *not* generate exception when invalid JSON is set as elements
                // don't normally complain on being mis-configured.
                // TODO(sorvell): Do generate exception in *dev mode*.
                try {
                    // Assert to adhere to Bazel's "must type assert JSON parse" rule.
                    fromValue = JSON.parse(value);
                }
                catch (e) {
                    fromValue = null;
                }
                break;
        }
        return fromValue;
    },
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => !is(value, old);
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual,
};
// Ensure metadata is enabled. TypeScript does not polyfill
// Symbol.metadata, so we must ensure that it exists.
Symbol.metadata ??= Symbol('metadata');
// Map from a class's metadata object to property options
// Note that we must use nullish-coalescing assignment so that we only use one
// map even if we load multiple version of this module.
global.litPropertyMetadata ??= new WeakMap();
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclasses to render updates as desired.
 * @noInheritDoc
 */
class ReactiveElement
// In the Node build, this `extends` clause will be substituted with
// `(globalThis.HTMLElement ?? HTMLElement)`.
//
// This way, we will first prefer any global `HTMLElement` polyfill that the
// user has assigned, and then fall back to the `HTMLElement` shim which has
// been imported (see note at the top of this file about how this import is
// generated by Rollup). Note that the `HTMLElement` variable has been
// shadowed by this import, so it no longer refers to the global.
 extends HTMLElement {
    /**
     * Adds an initializer function to the class that is called during instance
     * construction.
     *
     * This is useful for code that runs against a `ReactiveElement`
     * subclass, such as a decorator, that needs to do work for each
     * instance, such as setting up a `ReactiveController`.
     *
     * ```ts
     * const myDecorator = (target: typeof ReactiveElement, key: string) => {
     *   target.addInitializer((instance: ReactiveElement) => {
     *     // This is run during construction of the element
     *     new MyController(instance);
     *   });
     * }
     * ```
     *
     * Decorating a field will then cause each instance to run an initializer
     * that adds a controller:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   @myDecorator foo;
     * }
     * ```
     *
     * Initializers are stored per-constructor. Adding an initializer to a
     * subclass does not add it to a superclass. Since initializers are run in
     * constructors, initializers will run in order of the class hierarchy,
     * starting with superclasses and progressing to the instance's class.
     *
     * @nocollapse
     */
    static addInitializer(initializer) {
        this.__prepare();
        (this._initializers ??= []).push(initializer);
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     * @category attributes
     */
    static get observedAttributes() {
        // Ensure we've created all properties
        this.finalize();
        // this.__attributeToPropertyMap is only undefined after finalize() in
        // ReactiveElement itself. ReactiveElement.observedAttributes is only
        // accessed with ReactiveElement as the receiver when a subclass or mixin
        // calls super.observedAttributes
        return (this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()]);
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a {@linkcode PropertyDeclaration} for the property with the
     * given options. The property setter calls the property's `hasChanged`
     * property option or uses a strict identity check to determine whether or not
     * to request an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * ```ts
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // If this is a state property, force the attribute to false.
        if (options.state) {
            options.attribute = false;
        }
        this.__prepare();
        this.elementProperties.set(name, options);
        if (!options.noAccessor) {
            const key = DEV_MODE
                ? // Use Symbol.for in dev mode to make it easier to maintain state
                    // when doing HMR.
                    Symbol.for(`${String(name)} (@property() cache)`)
                : Symbol();
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                defineProperty(this.prototype, name, descriptor);
            }
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     * ```ts
     * class MyElement extends LitElement {
     *   static getPropertyDescriptor(name, key, options) {
     *     const defaultDescriptor =
     *         super.getPropertyDescriptor(name, key, options);
     *     const setter = defaultDescriptor.set;
     *     return {
     *       get: defaultDescriptor.get,
     *       set(value) {
     *         setter.call(this, value);
     *         // custom action.
     *       },
     *       configurable: true,
     *       enumerable: true
     *     }
     *   }
     * }
     * ```
     *
     * @nocollapse
     * @category properties
     */
    static getPropertyDescriptor(name, key, options) {
        const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
            get() {
                return this[key];
            },
            set(v) {
                this[key] = v;
            },
        };
        if (DEV_MODE && get == null) {
            if ('value' in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
                throw new Error(`Field ${JSON.stringify(String(name))} on ` +
                    `${this.name} was declared as a reactive property ` +
                    `but it's actually declared as a value on the prototype. ` +
                    `Usually this is due to using @property or @state on a method.`);
            }
            issueWarning('reactive-property-without-getter', `Field ${JSON.stringify(String(name))} on ` +
                `${this.name} was declared as a reactive property ` +
                `but it does not have a getter. This will be an error in a ` +
                `future version of Lit.`);
        }
        return {
            get() {
                return get?.call(this);
            },
            set(value) {
                const oldValue = get?.call(this);
                set.call(this, value);
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a `PropertyDeclaration` via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override
     * {@linkcode createProperty}.
     *
     * @nocollapse
     * @final
     * @category properties
     */
    static getPropertyOptions(name) {
        return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
    }
    /**
     * Initializes static own properties of the class used in bookkeeping
     * for element properties, initializers, etc.
     *
     * Can be called multiple times by code that needs to ensure these
     * properties exist before using them.
     *
     * This method ensures the superclass is finalized so that inherited
     * property metadata can be copied down.
     * @nocollapse
     */
    static __prepare() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('elementProperties', this))) {
            // Already prepared
            return;
        }
        // Finalize any superclasses
        const superCtor = getPrototypeOf(this);
        superCtor.finalize();
        // Create own set of initializers for this class if any exist on the
        // superclass and copy them down. Note, for a small perf boost, avoid
        // creating initializers unless needed.
        if (superCtor._initializers !== undefined) {
            this._initializers = [...superCtor._initializers];
        }
        // Initialize elementProperties from the superclass
        this.elementProperties = new Map(superCtor.elementProperties);
    }
    /**
     * Finishes setting up the class so that it's ready to be registered
     * as a custom element and instantiated.
     *
     * This method is called by the ReactiveElement.observedAttributes getter.
     * If you override the observedAttributes getter, you must either call
     * super.observedAttributes to trigger finalization, or call finalize()
     * yourself.
     *
     * @nocollapse
     */
    static finalize() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this))) {
            return;
        }
        this.finalized = true;
        this.__prepare();
        // Create properties from the static properties block:
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            const propKeys = [
                ...getOwnPropertyNames(props),
                ...getOwnPropertySymbols(props),
            ];
            for (const p of propKeys) {
                this.createProperty(p, props[p]);
            }
        }
        // Create properties from standard decorator metadata:
        const metadata = this[Symbol.metadata];
        if (metadata !== null) {
            const properties = litPropertyMetadata.get(metadata);
            if (properties !== undefined) {
                for (const [p, options] of properties) {
                    this.elementProperties.set(p, options);
                }
            }
        }
        // Create the attribute-to-property map
        this.__attributeToPropertyMap = new Map();
        for (const [p, options] of this.elementProperties) {
            const attr = this.__attributeNameForProperty(p, options);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
            }
        }
        this.elementStyles = this.finalizeStyles(this.styles);
        if (DEV_MODE) {
            if (this.hasOwnProperty('createProperty')) {
                issueWarning('no-override-create-property', 'Overriding ReactiveElement.createProperty() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
            if (this.hasOwnProperty('getPropertyDescriptor')) {
                issueWarning('no-override-get-property-descriptor', 'Overriding ReactiveElement.getPropertyDescriptor() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
        }
    }
    /**
     * Takes the styles the user supplied via the `static styles` property and
     * returns the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * Styles are deduplicated preserving the _last_ instance in the list. This
     * is a performance optimization to avoid duplicated styles that can occur
     * especially when composing via subclassing. The last item is kept to try
     * to preserve the cascade order with the assumption that it's most important
     * that last added styles override previous styles.
     *
     * @nocollapse
     * @category styles
     */
    static finalizeStyles(styles) {
        const elementStyles = [];
        if (Array.isArray(styles)) {
            // Dedupe the flattened array in reverse order to preserve the last items.
            // Casting to Array<unknown> works around TS error that
            // appears to come from trying to flatten a type CSSResultArray.
            const set = new Set(styles.flat(Infinity).reverse());
            // Then preserve original order by adding the set items in reverse order.
            for (const s of set) {
                elementStyles.unshift((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(s));
            }
        }
        else if (styles !== undefined) {
            elementStyles.push((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(styles));
        }
        return elementStyles;
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
                ? attribute
                : typeof name === 'string'
                    ? name.toLowerCase()
                    : undefined;
    }
    constructor() {
        super();
        this.__instanceProperties = undefined;
        /**
         * True if there is a pending update as a result of calling `requestUpdate()`.
         * Should only be read.
         * @category updates
         */
        this.isUpdatePending = false;
        /**
         * Is set to `true` after the first update. The element code cannot assume
         * that `renderRoot` exists before the element `hasUpdated`.
         * @category updates
         */
        this.hasUpdated = false;
        /**
         * Name of currently reflecting property
         */
        this.__reflectingProperty = null;
        this.__initialize();
    }
    /**
     * Internal only override point for customizing work done when elements
     * are constructed.
     */
    __initialize() {
        this.__updatePromise = new Promise((res) => (this.enableUpdating = res));
        this._$changedProperties = new Map();
        // This enqueues a microtask that ust run before the first update, so it
        // must be called before requestUpdate()
        this.__saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdate();
        this.constructor._initializers?.forEach((i) => i(this));
    }
    /**
     * Registers a `ReactiveController` to participate in the element's reactive
     * update cycle. The element automatically calls into any registered
     * controllers during its lifecycle callbacks.
     *
     * If the element is connected when `addController()` is called, the
     * controller's `hostConnected()` callback will be immediately called.
     * @category controllers
     */
    addController(controller) {
        (this.__controllers ??= new Set()).add(controller);
        // If a controller is added after the element has been connected,
        // call hostConnected. Note, re-using existence of `renderRoot` here
        // (which is set in connectedCallback) to avoid the need to track a
        // first connected state.
        if (this.renderRoot !== undefined && this.isConnected) {
            controller.hostConnected?.();
        }
    }
    /**
     * Removes a `ReactiveController` from the element.
     * @category controllers
     */
    removeController(controller) {
        this.__controllers?.delete(controller);
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    __saveInstanceProperties() {
        const instanceProperties = new Map();
        const elementProperties = this.constructor
            .elementProperties;
        for (const p of elementProperties.keys()) {
            if (this.hasOwnProperty(p)) {
                instanceProperties.set(p, this[p]);
                delete this[p];
            }
        }
        if (instanceProperties.size > 0) {
            this.__instanceProperties = instanceProperties;
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     *
     * @return Returns a node into which to render.
     * @category rendering
     */
    createRenderRoot() {
        const renderRoot = this.shadowRoot ??
            this.attachShadow(this.constructor.shadowRootOptions);
        (0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles)(renderRoot, this.constructor.elementStyles);
        return renderRoot;
    }
    /**
     * On first connection, creates the element's renderRoot, sets up
     * element styling, and enables updating.
     * @category lifecycle
     */
    connectedCallback() {
        // Create renderRoot before controllers `hostConnected`
        this.renderRoot ??=
            this.createRenderRoot();
        this.enableUpdating(true);
        this.__controllers?.forEach((c) => c.hostConnected?.());
    }
    /**
     * Note, this method should be considered final and not overridden. It is
     * overridden on the element instance with a function that triggers the first
     * update.
     * @category updates
     */
    enableUpdating(_requestedUpdate) { }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     * @category lifecycle
     */
    disconnectedCallback() {
        this.__controllers?.forEach((c) => c.hostDisconnected?.());
    }
    /**
     * Synchronizes property values when attributes change.
     *
     * Specifically, when an attribute is set, the corresponding property is set.
     * You should rarely need to implement this callback. If this method is
     * overridden, `super.attributeChangedCallback(name, _old, value)` must be
     * called.
     *
     * See [using the lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks)
     * on MDN for more information about the `attributeChangedCallback`.
     * @category attributes
     */
    attributeChangedCallback(name, _old, value) {
        this._$attributeToProperty(name, value);
    }
    __propertyToAttribute(name, value) {
        const elemProperties = this.constructor.elementProperties;
        const options = elemProperties.get(name);
        const attr = this.constructor.__attributeNameForProperty(name, options);
        if (attr !== undefined && options.reflect === true) {
            const converter = options.converter?.toAttribute !==
                undefined
                ? options.converter
                : defaultConverter;
            const attrValue = converter.toAttribute(value, options.type);
            if (DEV_MODE &&
                this.constructor.enabledWarnings.includes('migration') &&
                attrValue === undefined) {
                issueWarning('undefined-attribute-value', `The attribute value for the ${name} property is ` +
                    `undefined on element ${this.localName}. The attribute will be ` +
                    `removed, but in the previous version of \`ReactiveElement\`, ` +
                    `the attribute would not have changed.`);
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this.__reflectingProperty = name;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /** @internal */
    _$attributeToProperty(name, value) {
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        const propName = ctor.__attributeToPropertyMap.get(name);
        // Use tracking info to avoid reflecting a property value to an attribute
        // if it was just set because the attribute changed.
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = ctor.getPropertyOptions(propName);
            const converter = typeof options.converter === 'function'
                ? { fromAttribute: options.converter }
                : options.converter?.fromAttribute !== undefined
                    ? options.converter
                    : defaultConverter;
            // mark state reflecting
            this.__reflectingProperty = propName;
            this[propName] = converter.fromAttribute(value, options.type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            );
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should be called
     * when an element should update based on some state not triggered by setting
     * a reactive property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored.
     *
     * @param name name of requesting property
     * @param oldValue old value of requesting property
     * @param options property options to use instead of the previously
     *     configured options
     * @category updates
     */
    requestUpdate(name, oldValue, options) {
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            if (DEV_MODE && name instanceof Event) {
                issueWarning(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
            }
            options ??= this.constructor.getPropertyOptions(name);
            const hasChanged = options.hasChanged ?? notEqual;
            const newValue = this[name];
            if (hasChanged(newValue, oldValue)) {
                this._$changeProperty(name, oldValue, options);
            }
            else {
                // Abort the request if the property should not be considered changed.
                return;
            }
        }
        if (this.isUpdatePending === false) {
            this.__updatePromise = this.__enqueueUpdate();
        }
    }
    /**
     * @internal
     */
    _$changeProperty(name, oldValue, options) {
        // TODO (justinfagnani): Create a benchmark of Map.has() + Map.set(
        // vs just Map.set()
        if (!this._$changedProperties.has(name)) {
            this._$changedProperties.set(name, oldValue);
        }
        // Add to reflecting properties set.
        // Note, it's important that every change has a chance to add the
        // property to `__reflectingProperties`. This ensures setting
        // attribute + property reflects correctly.
        if (options.reflect === true && this.__reflectingProperty !== name) {
            (this.__reflectingProperties ??= new Set()).add(name);
        }
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async __enqueueUpdate() {
        this.isUpdatePending = true;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this.__updatePromise;
        }
        catch (e) {
            // Refire any previous errors async so they do not disrupt the update
            // cycle. Errors are refired so developers have a chance to observe
            // them, and this can be done by implementing
            // `window.onunhandledrejection`.
            Promise.reject(e);
        }
        const result = this.scheduleUpdate();
        // If `scheduleUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this.isUpdatePending;
    }
    /**
     * Schedules an element update. You can override this method to change the
     * timing of updates by returning a Promise. The update will await the
     * returned Promise, and you should resolve the Promise to allow the update
     * to proceed. If this method is overridden, `super.scheduleUpdate()`
     * must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```ts
     * override protected async scheduleUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.scheduleUpdate();
     * }
     * ```
     * @category updates
     */
    scheduleUpdate() {
        const result = this.performUpdate();
        if (DEV_MODE &&
            this.constructor.enabledWarnings.includes('async-perform-update') &&
            typeof result?.then ===
                'function') {
            issueWarning('async-perform-update', `Element ${this.localName} returned a Promise from performUpdate(). ` +
                `This behavior is deprecated and will be removed in a future ` +
                `version of ReactiveElement.`);
        }
        return result;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * Call `performUpdate()` to immediately process a pending update. This should
     * generally not be needed, but it can be done in rare cases when you need to
     * update synchronously.
     *
     * @category updates
     */
    performUpdate() {
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this.isUpdatePending) {
            return;
        }
        debugLogEvent?.({ kind: 'update' });
        if (!this.hasUpdated) {
            // Create renderRoot before first update. This occurs in `connectedCallback`
            // but is done here to support out of tree calls to `enableUpdating`/`performUpdate`.
            this.renderRoot ??=
                this.createRenderRoot();
            if (DEV_MODE) {
                // Produce warning if any reactive properties on the prototype are
                // shadowed by class fields. Instance fields set before upgrade are
                // deleted by this point, so any own property is caused by class field
                // initialization in the constructor.
                const ctor = this.constructor;
                const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
                if (shadowedProperties.length) {
                    throw new Error(`The following properties on element ${this.localName} will not ` +
                        `trigger updates as expected because they are set using class ` +
                        `fields: ${shadowedProperties.join(', ')}. ` +
                        `Native class fields and some compiled output will overwrite ` +
                        `accessors used for detecting changes. See ` +
                        `https://lit.dev/msg/class-field-shadowing ` +
                        `for more information.`);
                }
            }
            // Mixin instance properties once, if they exist.
            if (this.__instanceProperties) {
                // TODO (justinfagnani): should we use the stored value? Could a new value
                // have been set since we stored the own property value?
                for (const [p, value] of this.__instanceProperties) {
                    this[p] = value;
                }
                this.__instanceProperties = undefined;
            }
            // Trigger initial value reflection and populate the initial
            // changedProperties map, but only for the case of experimental
            // decorators on accessors, which will not have already populated the
            // changedProperties map. We can't know if these accessors had
            // initializers, so we just set them anyway - a difference from
            // experimental decorators on fields and standard decorators on
            // auto-accessors.
            // For context why experimentalDecorators with auto accessors are handled
            // specifically also see:
            // https://github.com/lit/lit/pull/4183#issuecomment-1711959635
            const elementProperties = this.constructor
                .elementProperties;
            if (elementProperties.size > 0) {
                for (const [p, options] of elementProperties) {
                    if (options.wrapped === true &&
                        !this._$changedProperties.has(p) &&
                        this[p] !== undefined) {
                        this._$changeProperty(p, this[p], options);
                    }
                }
            }
        }
        let shouldUpdate = false;
        const changedProperties = this._$changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.willUpdate(changedProperties);
                this.__controllers?.forEach((c) => c.hostUpdate?.());
                this.update(changedProperties);
            }
            else {
                this.__markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this.__markUpdated();
            throw e;
        }
        // The update is no longer considered pending and further updates are now allowed.
        if (shouldUpdate) {
            this._$didUpdate(changedProperties);
        }
    }
    /**
     * Invoked before `update()` to compute values needed during the update.
     *
     * Implement `willUpdate` to compute property values that depend on other
     * properties and are used in the rest of the update process.
     *
     * ```ts
     * willUpdate(changedProperties) {
     *   // only need to check changed properties for an expensive computation.
     *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
     *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
     *   }
     * }
     *
     * render() {
     *   return html`SHA: ${this.sha}`;
     * }
     * ```
     *
     * @category updates
     */
    willUpdate(_changedProperties) { }
    // Note, this is an override point for polyfill-support.
    // @internal
    _$didUpdate(changedProperties) {
        this.__controllers?.forEach((c) => c.hostUpdated?.());
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
        if (DEV_MODE &&
            this.isUpdatePending &&
            this.constructor.enabledWarnings.includes('change-in-update')) {
            issueWarning('change-in-update', `Element ${this.localName} scheduled an update ` +
                `(generally because a property was set) ` +
                `after an update completed, causing a new update to be scheduled. ` +
                `This is inefficient and should be avoided unless the next update ` +
                `can only be scheduled as a side effect of the previous update.`);
        }
    }
    __markUpdated() {
        this._$changedProperties = new Map();
        this.isUpdatePending = false;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super.getUpdateComplete()`, then any subsequent state.
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    get updateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     * ```ts
     * class MyElement extends LitElement {
     *   override async getUpdateComplete() {
     *     const result = await super.getUpdateComplete();
     *     await this._myChild.updateComplete;
     *     return result;
     *   }
     * }
     * ```
     *
     * @return A promise of a boolean that resolves to true if the update completed
     *     without triggering another update.
     * @category updates
     */
    getUpdateComplete() {
        return this.__updatePromise;
    }
    /**
     * Controls whether or not `update()` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    update(_changedProperties) {
        // The forEach() expression will only run when when __reflectingProperties is
        // defined, and it returns undefined, setting __reflectingProperties to
        // undefined
        this.__reflectingProperties &&= this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p]));
        this.__markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    updated(_changedProperties) { }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * ```ts
     * firstUpdated() {
     *   this.renderRoot.getElementById('my-text-area').focus();
     * }
     * ```
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    firstUpdated(_changedProperties) { }
}
/**
 * Memoized list of all element styles.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category styles
 */
ReactiveElement.elementStyles = [];
/**
 * Options used when calling `attachShadow`. Set this property to customize
 * the options for the shadowRoot; for example, to create a closed
 * shadowRoot: `{mode: 'closed'}`.
 *
 * Note, these options are used in `createRenderRoot`. If this method
 * is customized, options should be respected if possible.
 * @nocollapse
 * @category rendering
 */
ReactiveElement.shadowRootOptions = { mode: 'open' };
// Assigned here to work around a jscompiler bug with static fields
// when compiling to ES5.
// https://github.com/google/closure-compiler/issues/3177
ReactiveElement[JSCompiler_renameProperty('elementProperties', ReactiveElement)] = new Map();
ReactiveElement[JSCompiler_renameProperty('finalized', ReactiveElement)] = new Map();
// Apply polyfills if available
polyfillSupport?.({ ReactiveElement });
// Dev mode warnings...
if (DEV_MODE) {
    // Default warning set.
    ReactiveElement.enabledWarnings = [
        'change-in-update',
        'async-perform-update',
    ];
    const ensureOwnWarnings = function (ctor) {
        if (!ctor.hasOwnProperty(JSCompiler_renameProperty('enabledWarnings', ctor))) {
            ctor.enabledWarnings = ctor.enabledWarnings.slice();
        }
    };
    ReactiveElement.enableWarning = function (warning) {
        ensureOwnWarnings(this);
        if (!this.enabledWarnings.includes(warning)) {
            this.enabledWarnings.push(warning);
        }
    };
    ReactiveElement.disableWarning = function (warning) {
        ensureOwnWarnings(this);
        const i = this.enabledWarnings.indexOf(warning);
        if (i >= 0) {
            this.enabledWarnings.splice(i, 1);
        }
    };
}
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for ReactiveElement usage.
(global.reactiveElementVersions ??= []).push('2.0.4');
if (DEV_MODE && global.reactiveElementVersions.length > 1) {
    issueWarning('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
        `is not recommended.`);
}
//# sourceMappingURL=reactive-element.js.map

/***/ }),

/***/ "./node_modules/lit-element/development/lit-element.js":
/*!*************************************************************!*\
  !*** ./node_modules/lit-element/development/lit-element.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   LitElement: () => (/* binding */ LitElement),
/* harmony export */   ReactiveElement: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement),
/* harmony export */   _$LE: () => (/* binding */ _$LE),
/* harmony export */   _$LH: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__._$LH),
/* harmony export */   adoptStyles: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   defaultConverter: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   html: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   mathml: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.mathml),
/* harmony export */   noChange: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   notEqual: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.notEqual),
/* harmony export */   nothing: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   render: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   svg: () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _globalThis$litElemen, _globalThis$litElemen2;
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * The main LitElement module, which defines the {@linkcode LitElement} base
 * class and related APIs.
 *
 * LitElement components can define a template and a set of observed
 * properties. Changing an observed property triggers a re-render of the
 * element.
 *
 * Import {@linkcode LitElement} and {@linkcode html} from this module to
 * create a component:
 *
 *  ```js
 * import {LitElement, html} from 'lit-element';
 *
 * class MyElement extends LitElement {
 *
 *   // Declare observed properties
 *   static get properties() {
 *     return {
 *       adjective: {}
 *     }
 *   }
 *
 *   constructor() {
 *     this.adjective = 'awesome';
 *   }
 *
 *   // Define the element's template
 *   render() {
 *     return html`<p>your ${adjective} template here</p>`;
 *   }
 * }
 *
 * customElements.define('my-element', MyElement);
 * ```
 *
 * `LitElement` extends {@linkcode ReactiveElement} and adds lit-html
 * templating. The `ReactiveElement` class is provided for users that want to
 * build their own custom element base classes that don't use lit-html.
 *
 * @packageDocumentation
 */




/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
var JSCompiler_renameProperty = function JSCompiler_renameProperty(prop, _obj) {
  return prop;
};
var DEV_MODE = true;
var issueWarning;
if (DEV_MODE) {
  var _globalThis$litIssued;
  // Ensure warnings are issued only 1x, even if multiple versions of Lit
  // are loaded.
  var issuedWarnings = (_globalThis$litIssued = globalThis.litIssuedWarnings) !== null && _globalThis$litIssued !== void 0 ? _globalThis$litIssued : globalThis.litIssuedWarnings = new Set();
  // Issue a warning, if we haven't already.
  issueWarning = function issueWarning(code, warning) {
    warning += " See https://lit.dev/msg/".concat(code, " for more information.");
    if (!issuedWarnings.has(warning)) {
      console.warn(warning);
      issuedWarnings.add(warning);
    }
  };
}
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the {@linkcode LitElement.properties properties} property or the
 * {@linkcode property} decorator.
 */
var LitElement = /*#__PURE__*/function (_ReactiveElement) {
  function LitElement() {
    var _this;
    _classCallCheck(this, LitElement);
    _this = _callSuper(this, LitElement, arguments);
    /**
     * @category rendering
     */
    _this.renderOptions = {
      host: _this
    };
    _this.__childPart = undefined;
    return _this;
  }
  /**
   * @category rendering
   */
  _inherits(LitElement, _ReactiveElement);
  return _createClass(LitElement, [{
    key: "createRenderRoot",
    value: function createRenderRoot() {
      var _this$renderOptions, _this$renderOptions$r;
      var renderRoot = _superPropGet(LitElement, "createRenderRoot", this, 3)([]);
      // When adoptedStyleSheets are shimmed, they are inserted into the
      // shadowRoot by createRenderRoot. Adjust the renderBefore node so that
      // any styles in Lit content render before adoptedStyleSheets. This is
      // important so that adoptedStyleSheets have precedence over styles in
      // the shadowRoot.
      (_this$renderOptions$r = (_this$renderOptions = this.renderOptions).renderBefore) !== null && _this$renderOptions$r !== void 0 ? _this$renderOptions$r : _this$renderOptions.renderBefore = renderRoot.firstChild;
      return renderRoot;
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param changedProperties Map of changed properties with old values
     * @category updates
     */
  }, {
    key: "update",
    value: function update(changedProperties) {
      // Setting properties in `render` should not trigger an update. Since
      // updates are allowed after super.update, it's important to call `render`
      // before that.
      var value = this.render();
      if (!this.hasUpdated) {
        this.renderOptions.isConnected = this.isConnected;
      }
      _superPropGet(LitElement, "update", this, 3)([changedProperties]);
      this.__childPart = (0,lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(value, this.renderRoot, this.renderOptions);
    }
    /**
     * Invoked when the component is added to the document's DOM.
     *
     * In `connectedCallback()` you should setup tasks that should only occur when
     * the element is connected to the document. The most common of these is
     * adding event listeners to nodes external to the element, like a keydown
     * event handler added to the window.
     *
     * ```ts
     * connectedCallback() {
     *   super.connectedCallback();
     *   addEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * Typically, anything done in `connectedCallback()` should be undone when the
     * element is disconnected, in `disconnectedCallback()`.
     *
     * @category lifecycle
     */
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$__childPart;
      _superPropGet(LitElement, "connectedCallback", this, 3)([]);
      (_this$__childPart = this.__childPart) === null || _this$__childPart === void 0 || _this$__childPart.setConnected(true);
    }
    /**
     * Invoked when the component is removed from the document's DOM.
     *
     * This callback is the main signal to the element that it may no longer be
     * used. `disconnectedCallback()` should ensure that nothing is holding a
     * reference to the element (such as event listeners added to nodes external
     * to the element), so that it is free to be garbage collected.
     *
     * ```ts
     * disconnectedCallback() {
     *   super.disconnectedCallback();
     *   window.removeEventListener('keydown', this._handleKeydown);
     * }
     * ```
     *
     * An element may be re-connected after being disconnected.
     *
     * @category lifecycle
     */
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this$__childPart2;
      _superPropGet(LitElement, "disconnectedCallback", this, 3)([]);
      (_this$__childPart2 = this.__childPart) === null || _this$__childPart2 === void 0 || _this$__childPart2.setConnected(false);
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `ChildPart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     * @category rendering
     */
  }, {
    key: "render",
    value: function render() {
      return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange;
    }
  }]);
}(_lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement);
// This property needs to remain unminified.
LitElement['_$litElement$'] = true;
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See @lit/reactive-element for more information.
 */
LitElement[JSCompiler_renameProperty('finalized', LitElement)] = true;
// Install hydration if available
(_globalThis$litElemen = globalThis.litElementHydrateSupport) === null || _globalThis$litElemen === void 0 || _globalThis$litElemen.call(globalThis, {
  LitElement: LitElement
});
// Apply polyfills if available
var polyfillSupport = DEV_MODE ? globalThis.litElementPolyfillSupportDevMode : globalThis.litElementPolyfillSupport;
polyfillSupport === null || polyfillSupport === void 0 || polyfillSupport({
  LitElement: LitElement
});
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _$LE object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-html, since this module re-exports all of lit-html.
 *
 * @private
 */
var _$LE = {
  _$attributeToProperty: function _$attributeToProperty(el, name, value) {
    // eslint-disable-next-line
    el._$attributeToProperty(name, value);
  },
  // eslint-disable-next-line
  _$changedProperties: function _$changedProperties(el) {
    return el._$changedProperties;
  }
};
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
((_globalThis$litElemen2 = globalThis.litElementVersions) !== null && _globalThis$litElemen2 !== void 0 ? _globalThis$litElemen2 : globalThis.litElementVersions = []).push('4.1.1');
if (DEV_MODE && globalThis.litElementVersions.length > 1) {
  issueWarning('multiple-versions', "Multiple versions of Lit loaded. Loading multiple versions " + "is not recommended.");
}

/***/ }),

/***/ "./node_modules/lit-html/development/is-server.js":
/*!********************************************************!*\
  !*** ./node_modules/lit-html/development/is-server.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isServer: () => (/* binding */ isServer)
/* harmony export */ });
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @fileoverview
 *
 * This file exports a boolean const whose value will depend on what environment
 * the module is being imported from.
 */
var NODE_MODE = false;
/**
 * A boolean that will be `true` in server environments like Node, and `false`
 * in browser environments. Note that your server environment or toolchain must
 * support the `"node"` export condition for this to be `true`.
 *
 * This can be used when authoring components to change behavior based on
 * whether or not the component is executing in an SSR context.
 */
var isServer = NODE_MODE;

/***/ }),

/***/ "./node_modules/lit-html/development/lit-html.js":
/*!*******************************************************!*\
  !*** ./node_modules/lit-html/development/lit-html.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$LH: () => (/* binding */ _$LH),
/* harmony export */   html: () => (/* binding */ html),
/* harmony export */   mathml: () => (/* binding */ mathml),
/* harmony export */   noChange: () => (/* binding */ noChange),
/* harmony export */   nothing: () => (/* binding */ nothing),
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   svg: () => (/* binding */ svg)
/* harmony export */ });
var _global$ShadyDOM, _global$ShadyDOM2, _global$litHtmlVersio;
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var DEV_MODE = true;
var ENABLE_EXTRA_SECURITY_HOOKS = true;
var ENABLE_SHADYDOM_NOPATCH = true;
var NODE_MODE = false;
// Allows minifiers to rename references to globalThis
var global = globalThis;
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
var debugLogEvent = DEV_MODE ? function (event) {
  var shouldEmit = global.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global.dispatchEvent(new CustomEvent('lit-debug', {
    detail: event
  }));
} : undefined;
// Used for connecting beginRender and endRender events when there are nested
// renders when errors are thrown preventing an endRender event from being
// called.
var debugLogRenderId = 0;
var issueWarning;
if (DEV_MODE) {
  var _global$litIssuedWarn;
  (_global$litIssuedWarn = global.litIssuedWarnings) !== null && _global$litIssuedWarn !== void 0 ? _global$litIssuedWarn : global.litIssuedWarnings = new Set();
  // Issue a warning, if we haven't already.
  issueWarning = function issueWarning(code, warning) {
    warning += code ? " See https://lit.dev/msg/".concat(code, " for more information.") : '';
    if (!global.litIssuedWarnings.has(warning)) {
      console.warn(warning);
      global.litIssuedWarnings.add(warning);
    }
  };
  issueWarning('dev-mode', "Lit is in dev mode. Not recommended for production!");
}
var wrap = ENABLE_SHADYDOM_NOPATCH && (_global$ShadyDOM = global.ShadyDOM) !== null && _global$ShadyDOM !== void 0 && _global$ShadyDOM.inUse && ((_global$ShadyDOM2 = global.ShadyDOM) === null || _global$ShadyDOM2 === void 0 ? void 0 : _global$ShadyDOM2.noPatch) === true ? global.ShadyDOM.wrap : function (node) {
  return node;
};
var trustedTypes = global.trustedTypes;
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
var policy = trustedTypes ? trustedTypes.createPolicy('lit-html', {
  createHTML: function createHTML(s) {
    return s;
  }
}) : undefined;
var identityFunction = function identityFunction(value) {
  return value;
};
var noopSanitizer = function noopSanitizer(_node, _name, _type) {
  return identityFunction;
};
/** Sets the global sanitizer factory. */
var setSanitizer = function setSanitizer(newSanitizer) {
  if (!ENABLE_EXTRA_SECURITY_HOOKS) {
    return;
  }
  if (sanitizerFactoryInternal !== noopSanitizer) {
    throw new Error("Attempted to overwrite existing lit-html security policy." + " setSanitizeDOMValueFactory should be called at most once.");
  }
  sanitizerFactoryInternal = newSanitizer;
};
/**
 * Only used in internal tests, not a part of the public API.
 */
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = function _testOnlyClearSanitizerFactoryDoNotCallOrElse() {
  sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = function createSanitizer(node, name, type) {
  return sanitizerFactoryInternal(node, name, type);
};
// Added to an attribute name to mark the attribute as bound so we can find
// it easily.
var boundAttributeSuffix = '$lit$';
// This marker is used in many syntactic positions in HTML, so it must be
// a valid element name and attribute name. We don't support dynamic names (yet)
// but this at least ensures that the parse tree is closer to the template
// intention.
var marker = "lit$".concat(Math.random().toFixed(9).slice(2), "$");
// String used to tell if a comment is a marker comment
var markerMatch = '?' + marker;
// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
var nodeMarker = "<".concat(markerMatch, ">");
var d = NODE_MODE && global.document === undefined ? {
  createTreeWalker: function createTreeWalker() {
    return {};
  }
} : document;
// Creates a dynamic marker. We never have to search for these in the DOM.
var createMarker = function createMarker() {
  return d.createComment('');
};
var isPrimitive = function isPrimitive(value) {
  return value === null || _typeof(value) != 'object' && typeof value != 'function';
};
var isArray = Array.isArray;
var isIterable = function isIterable(value) {
  return isArray(value) ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof (value === null || value === void 0 ? void 0 : value[Symbol.iterator]) === 'function';
};
var SPACE_CHAR = "[ \t\n\f\r]";
var ATTR_VALUE_CHAR = "[^ \t\n\f\r\"'`<>=]";
var NAME_CHAR = "[^\\s\"'>=/]";
// These regexes represent the five parsing states that we care about in the
// Template's HTML scanner. They match the *end* of the state they're named
// after.
// Depending on the match, we transition to a new state. If there's no match,
// we stay in the same state.
// Note that the regexes are stateful. We utilize lastIndex and sync it
// across the multiple regexes used. In addition to the five regexes below
// we also dynamically create a regex to find the matching end tags for raw
// text elements.
/**
 * End of text is: `<` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var COMMENT_START = 1;
var TAG_NAME = 2;
var DYNAMIC_TAG_NAME = 3;
var commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single `>`
 */
var comment2EndRegex = />/g;
/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a `>`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
var tagEndRegex = new RegExp(">|".concat(SPACE_CHAR, "(?:(").concat(NAME_CHAR, "+)(").concat(SPACE_CHAR, "*=").concat(SPACE_CHAR, "*(?:").concat(ATTR_VALUE_CHAR, "|(\"|')|))|$)"), 'g');
var ENTIRE_MATCH = 0;
var ATTRIBUTE_NAME = 1;
var SPACES_AND_EQUALS = 2;
var QUOTE_CHAR = 3;
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
/**
 * Matches the raw text elements.
 *
 * Comments are not parsed within raw text elements, so we need to search their
 * text content for marker strings.
 */
var rawTextElement = /^(?:script|style|textarea|title)$/i;
/** TemplateResult types */
var HTML_RESULT = 1;
var SVG_RESULT = 2;
var MATHML_RESULT = 3;
// TemplatePart types
// IMPORTANT: these must match the values in PartType
var ATTRIBUTE_PART = 1;
var CHILD_PART = 2;
var PROPERTY_PART = 3;
var BOOLEAN_ATTRIBUTE_PART = 4;
var EVENT_PART = 5;
var ELEMENT_PART = 6;
var COMMENT_PART = 7;
/**
 * Generates a template literal tag function that returns a TemplateResult with
 * the given result type.
 */
var tag = function tag(type) {
  return function (strings) {
    // Warn against templates octal escape sequences
    // We do this here rather than in render so that the warning is closer to the
    // template definition.
    if (DEV_MODE && strings.some(function (s) {
      return s === undefined;
    })) {
      console.warn('Some template strings are undefined.\n' + 'This is probably caused by illegal octal escape sequences.');
    }
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }
    if (DEV_MODE) {
      // Import static-html.js results in a circular dependency which g3 doesn't
      // handle. Instead we know that static values must have the field
      // `_$litStatic$`.
      if (values.some(function (val) {
        return val === null || val === void 0 ? void 0 : val['_$litStatic$'];
      })) {
        issueWarning('', "Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.\n" + "Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions");
      }
    }
    return _defineProperty(_defineProperty(_defineProperty({}, '_$litType$', type), "strings", strings), "values", values);
  };
};
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 *
 * ```ts
 * const header = (title: string) => html`<h1>${title}</h1>`;
 * ```
 *
 * The `html` tag returns a description of the DOM to render as a value. It is
 * lazy, meaning no work is done until the template is rendered. When rendering,
 * if a template comes from the same expression as a previously rendered result,
 * it's efficiently updated instead of replaced.
 */
var html = tag(HTML_RESULT);
/**
 * Interprets a template literal as an SVG fragment that can efficiently render
 * to and update a container.
 *
 * ```ts
 * const rect = svg`<rect width="10" height="10"></rect>`;
 *
 * const myImage = html`
 *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
 *     ${rect}
 *   </svg>`;
 * ```
 *
 * The `svg` *tag function* should only be used for SVG fragments, or elements
 * that would be contained **inside** an `<svg>` HTML element. A common error is
 * placing an `<svg>` *element* in a template tagged with the `svg` tag
 * function. The `<svg>` element is an HTML element and should be used within a
 * template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an SVG fragment from the
 * `render()` method, as the SVG fragment will be contained within the element's
 * shadow root and thus not be properly contained within an `<svg>` HTML
 * element.
 */
var svg = tag(SVG_RESULT);
/**
 * Interprets a template literal as MathML fragment that can efficiently render
 * to and update a container.
 *
 * ```ts
 * const num = mathml`<mn>1</mn>`;
 *
 * const eq = html`
 *   <math>
 *     ${num}
 *   </math>`;
 * ```
 *
 * The `mathml` *tag function* should only be used for MathML fragments, or
 * elements that would be contained **inside** a `<math>` HTML element. A common
 * error is placing a `<math>` *element* in a template tagged with the `mathml`
 * tag function. The `<math>` element is an HTML element and should be used
 * within a template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an MathML fragment from the
 * `render()` method, as the MathML fragment will be contained within the
 * element's shadow root and thus not be properly contained within a `<math>`
 * HTML element.
 */
var mathml = tag(MATHML_RESULT);
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
var noChange = Symbol["for"]('lit-noChange');
/**
 * A sentinel value that signals a ChildPart to fully clear its content.
 *
 * ```ts
 * const button = html`${
 *  user.isAdmin
 *    ? html`<button>DELETE</button>`
 *    : nothing
 * }`;
 * ```
 *
 * Prefer using `nothing` over other falsy values as it provides a consistent
 * behavior between various expression binding contexts.
 *
 * In child expressions, `undefined`, `null`, `''`, and `nothing` all behave the
 * same and render no nodes. In attribute expressions, `nothing` _removes_ the
 * attribute, while `undefined` and `null` will render an empty string. In
 * property expressions `nothing` becomes `undefined`.
 */
var nothing = Symbol["for"]('lit-nothing');
/**
 * The cache of prepared templates, keyed by the tagged TemplateStringsArray
 * and _not_ accounting for the specific template tag used. This means that
 * template tags cannot be dynamic - they must statically be one of html, svg,
 * or attr. This restriction simplifies the cache lookup, which is on the hot
 * path for rendering.
 */
var templateCache = new WeakMap();
var walker = d.createTreeWalker(d, 129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
  // A security check to prevent spoofing of Lit template results.
  // In the future, we may be able to replace this with Array.isTemplateObject,
  // though we might need to make that check inside of the html and svg
  // functions, because precompiled templates don't come in as
  // TemplateStringArray objects.
  if (!isArray(tsa) || !tsa.hasOwnProperty('raw')) {
    var message = 'invalid template strings array';
    if (DEV_MODE) {
      message = "\n          Internal Error: expected template strings to be an array\n          with a 'raw' field. Faking a template strings array by\n          calling html or svg like an ordinary function is effectively\n          the same as calling unsafeHtml and can lead to major security\n          issues, e.g. opening your code up to XSS attacks.\n          If you're using the html or svg tagged template functions normally\n          and still seeing this error, please file a bug at\n          https://github.com/lit/lit/issues/new?template=bug_report.md\n          and include information about your build tooling, if any.\n        ".trim().replace(/\n */g, '\n');
    }
    throw new Error(message);
  }
  return policy !== undefined ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
/**
 * Returns an HTML string for the given TemplateStringsArray and result type
 * (HTML or SVG), along with the case-sensitive bound attribute names in
 * template order. The HTML contains comment markers denoting the `ChildPart`s
 * and suffixes on bound attributes denoting the `AttributeParts`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing `[html, attrNames]` (array returned for terseness,
 *     to avoid object fields since this code is shared with non-minified SSR
 *     code)
 */
var getTemplateHtml = function getTemplateHtml(strings, type) {
  // Insert makers into the template HTML to represent the position of
  // bindings. The following code scans the template strings to determine the
  // syntactic position of the bindings. They can be in text position, where
  // we insert an HTML comment, attribute value position, where we insert a
  // sentinel string and re-write the attribute name, or inside a tag where
  // we insert the sentinel string.
  var l = strings.length - 1;
  // Stores the case-sensitive bound attribute names in the order of their
  // parts. ElementParts are also reflected in this array as undefined
  // rather than a string, to disambiguate from attribute bindings.
  var attrNames = [];
  var html = type === SVG_RESULT ? '<svg>' : type === MATHML_RESULT ? '<math>' : '';
  // When we're inside a raw text tag (not it's text content), the regex
  // will still be tagRegex so we can find attributes, but will switch to
  // this regex when the tag ends.
  var rawTextEndRegex;
  // The current parsing state, represented as a reference to one of the
  // regexes
  var regex = textEndRegex;
  for (var i = 0; i < l; i++) {
    var s = strings[i];
    // The index of the end of the last attribute name. When this is
    // positive at end of a string, it means we're in an attribute value
    // position and need to rewrite the attribute name.
    // We also use a special value of -2 to indicate that we encountered
    // the end of a string in attribute name position.
    var attrNameEndIndex = -1;
    var attrName = void 0;
    var lastIndex = 0;
    var match = void 0;
    // The conditions in this loop handle the current parse state, and the
    // assignments to the `regex` variable are the state transitions.
    while (lastIndex < s.length) {
      // Make sure we start searching from where we previously left off
      regex.lastIndex = lastIndex;
      match = regex.exec(s);
      if (match === null) {
        break;
      }
      lastIndex = regex.lastIndex;
      if (regex === textEndRegex) {
        if (match[COMMENT_START] === '!--') {
          regex = commentEndRegex;
        } else if (match[COMMENT_START] !== undefined) {
          // We started a weird comment, like </{
          regex = comment2EndRegex;
        } else if (match[TAG_NAME] !== undefined) {
          if (rawTextElement.test(match[TAG_NAME])) {
            // Record if we encounter a raw-text element. We'll switch to
            // this regex at the end of the tag.
            rawTextEndRegex = new RegExp("</".concat(match[TAG_NAME]), 'g');
          }
          regex = tagEndRegex;
        } else if (match[DYNAMIC_TAG_NAME] !== undefined) {
          if (DEV_MODE) {
            throw new Error('Bindings in tag names are not supported. Please use static templates instead. ' + 'See https://lit.dev/docs/templates/expressions/#static-expressions');
          }
          regex = tagEndRegex;
        }
      } else if (regex === tagEndRegex) {
        if (match[ENTIRE_MATCH] === '>') {
          // End of a tag. If we had started a raw-text element, use that
          // regex
          regex = rawTextEndRegex !== null && rawTextEndRegex !== void 0 ? rawTextEndRegex : textEndRegex;
          // We may be ending an unquoted attribute value, so make sure we
          // clear any pending attrNameEndIndex
          attrNameEndIndex = -1;
        } else if (match[ATTRIBUTE_NAME] === undefined) {
          // Attribute name position
          attrNameEndIndex = -2;
        } else {
          attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
          attrName = match[ATTRIBUTE_NAME];
          regex = match[QUOTE_CHAR] === undefined ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
        }
      } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
        regex = tagEndRegex;
      } else if (regex === commentEndRegex || regex === comment2EndRegex) {
        regex = textEndRegex;
      } else {
        // Not one of the five state regexes, so it must be the dynamically
        // created raw text regex and we're at the close of that element.
        regex = tagEndRegex;
        rawTextEndRegex = undefined;
      }
    }
    if (DEV_MODE) {
      // If we have a attrNameEndIndex, which indicates that we should
      // rewrite the attribute name, assert that we're in a valid attribute
      // position - either in a tag, or a quoted attribute value.
      console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, 'unexpected parse state B');
    }
    // We have four cases:
    //  1. We're in text position, and not in a raw text element
    //     (regex === textEndRegex): insert a comment marker.
    //  2. We have a non-negative attrNameEndIndex which means we need to
    //     rewrite the attribute name to add a bound attribute suffix.
    //  3. We're at the non-first binding in a multi-binding attribute, use a
    //     plain marker.
    //  4. We're somewhere else inside the tag. If we're in attribute name
    //     position (attrNameEndIndex === -2), add a sequential suffix to
    //     generate a unique attribute name.
    // Detect a binding next to self-closing tag end and insert a space to
    // separate the marker from the tag end:
    var end = regex === tagEndRegex && strings[i + 1].startsWith('/>') ? ' ' : '';
    html += regex === textEndRegex ? s + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s.slice(0, attrNameEndIndex) + boundAttributeSuffix + s.slice(attrNameEndIndex)) + marker + end : s + marker + (attrNameEndIndex === -2 ? i : end);
  }
  var htmlResult = html + (strings[l] || '<?>') + (type === SVG_RESULT ? '</svg>' : type === MATHML_RESULT ? '</math>' : '');
  // Returned as an array for terseness
  return [trustFromTemplateString(strings, htmlResult), attrNames];
};
var Template = /*#__PURE__*/function () {
  function Template(// This property needs to remain unminified.
  _ref2, options) {
    var strings = _ref2.strings,
      type = _ref2['_$litType$'];
    _classCallCheck(this, Template);
    this.parts = [];
    var node;
    var nodeIndex = 0;
    var attrNameIndex = 0;
    var partCount = strings.length - 1;
    var parts = this.parts;
    // Create template element
    var _getTemplateHtml = getTemplateHtml(strings, type),
      _getTemplateHtml2 = _slicedToArray(_getTemplateHtml, 2),
      html = _getTemplateHtml2[0],
      attrNames = _getTemplateHtml2[1];
    this.el = Template.createElement(html, options);
    walker.currentNode = this.el.content;
    // Re-parent SVG or MathML nodes into template root
    if (type === SVG_RESULT || type === MATHML_RESULT) {
      var wrapper = this.el.content.firstChild;
      wrapper.replaceWith.apply(wrapper, _toConsumableArray(wrapper.childNodes));
    }
    // Walk the template to find binding markers and create TemplateParts
    while ((node = walker.nextNode()) !== null && parts.length < partCount) {
      if (node.nodeType === 1) {
        if (DEV_MODE) {
          var _tag = node.localName;
          // Warn if `textarea` includes an expression and throw if `template`
          // does since these are not supported. We do this by checking
          // innerHTML for anything that looks like a marker. This catches
          // cases like bindings in textarea there markers turn into text nodes.
          if (/^(?:textarea|template)$/i.test(_tag) && node.innerHTML.includes(marker)) {
            var m = "Expressions are not supported inside `".concat(_tag, "` ") + "elements. See https://lit.dev/msg/expression-in-".concat(_tag, " for more ") + "information.";
            if (_tag === 'template') {
              throw new Error(m);
            } else issueWarning('', m);
          }
        }
        // TODO (justinfagnani): for attempted dynamic tag names, we don't
        // increment the bindingIndex, and it'll be off by 1 in the element
        // and off by two after it.
        if (node.hasAttributes()) {
          var _iterator = _createForOfIteratorHelper(node.getAttributeNames()),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var name = _step.value;
              if (name.endsWith(boundAttributeSuffix)) {
                var realName = attrNames[attrNameIndex++];
                var value = node.getAttribute(name);
                var statics = value.split(marker);
                var _m = /([.?@])?(.*)/.exec(realName);
                parts.push({
                  type: ATTRIBUTE_PART,
                  index: nodeIndex,
                  name: _m[2],
                  strings: statics,
                  ctor: _m[1] === '.' ? PropertyPart : _m[1] === '?' ? BooleanAttributePart : _m[1] === '@' ? EventPart : AttributePart
                });
                node.removeAttribute(name);
              } else if (name.startsWith(marker)) {
                parts.push({
                  type: ELEMENT_PART,
                  index: nodeIndex
                });
                node.removeAttribute(name);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        // TODO (justinfagnani): benchmark the regex against testing for each
        // of the 3 raw text element names.
        if (rawTextElement.test(node.tagName)) {
          // For raw text elements we need to split the text content on
          // markers, create a Text node for each segment, and create
          // a TemplatePart for each marker.
          var _strings = node.textContent.split(marker);
          var lastIndex = _strings.length - 1;
          if (lastIndex > 0) {
            node.textContent = trustedTypes ? trustedTypes.emptyScript : '';
            // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts
            // We can't use empty text nodes as markers because they're
            // normalized when cloning in IE (could simplify when
            // IE is no longer supported)
            for (var i = 0; i < lastIndex; i++) {
              node.append(_strings[i], createMarker());
              // Walk past the marker node we just added
              walker.nextNode();
              parts.push({
                type: CHILD_PART,
                index: ++nodeIndex
              });
            }
            // Note because this marker is added after the walker's current
            // node, it will be walked to in the outer loop (and ignored), so
            // we don't need to adjust nodeIndex here
            node.append(_strings[lastIndex], createMarker());
          }
        }
      } else if (node.nodeType === 8) {
        var data = node.data;
        if (data === markerMatch) {
          parts.push({
            type: CHILD_PART,
            index: nodeIndex
          });
        } else {
          var _i = -1;
          while ((_i = node.data.indexOf(marker, _i + 1)) !== -1) {
            // Comment node has a binding marker inside, make an inactive part
            // The binding won't work, but subsequent bindings will
            parts.push({
              type: COMMENT_PART,
              index: nodeIndex
            });
            // Move to the end of the match
            _i += marker.length - 1;
          }
        }
      }
      nodeIndex++;
    }
    if (DEV_MODE) {
      // If there was a duplicate attribute on a tag, then when the tag is
      // parsed into an element the attribute gets de-duplicated. We can detect
      // this mismatch if we haven't precisely consumed every attribute name
      // when preparing the template. This works because `attrNames` is built
      // from the template string and `attrNameIndex` comes from processing the
      // resulting DOM.
      if (attrNames.length !== attrNameIndex) {
        throw new Error("Detected duplicate attribute bindings. This occurs if your template " + "has duplicate attributes on an element tag. For example " + "\"<input ?disabled=${true} ?disabled=${false}>\" contains a " + "duplicate \"disabled\" attribute. The error was detected in " + "the following template: \n" + '`' + strings.join('${...}') + '`');
      }
    }
    // We could set walker.currentNode to another node here to prevent a memory
    // leak, but every time we prepare a template, we immediately render it
    // and re-use the walker in new TemplateInstance._clone().
    debugLogEvent && debugLogEvent({
      kind: 'template prep',
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings: strings
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  return _createClass(Template, null, [{
    key: "createElement",
    value: function createElement(html, _options) {
      var el = d.createElement('template');
      el.innerHTML = html;
      return el;
    }
  }]);
}();
function resolveDirective(part, value) {
  var _parent$__directives, _currentDirective;
  var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : part;
  var attributeIndex = arguments.length > 3 ? arguments[3] : undefined;
  // Bail early if the value is explicitly noChange. Note, this means any
  // nested directive is still attached and is not run.
  if (value === noChange) {
    return value;
  }
  var currentDirective = attributeIndex !== undefined ? (_parent$__directives = parent.__directives) === null || _parent$__directives === void 0 ? void 0 : _parent$__directives[attributeIndex] : parent.__directive;
  var nextDirectiveConstructor = isPrimitive(value) ? undefined :
  // This property needs to remain unminified.
  value['_$litDirective$'];
  if (((_currentDirective = currentDirective) === null || _currentDirective === void 0 ? void 0 : _currentDirective.constructor) !== nextDirectiveConstructor) {
    var _currentDirective2, _currentDirective2$_$;
    // This property needs to remain unminified.
    (_currentDirective2 = currentDirective) === null || _currentDirective2 === void 0 || (_currentDirective2$_$ = _currentDirective2['_$notifyDirectiveConnectionChanged']) === null || _currentDirective2$_$ === void 0 || _currentDirective2$_$.call(_currentDirective2, false);
    if (nextDirectiveConstructor === undefined) {
      currentDirective = undefined;
    } else {
      currentDirective = new nextDirectiveConstructor(part);
      currentDirective._$initialize(part, parent, attributeIndex);
    }
    if (attributeIndex !== undefined) {
      var _parent$__directives2;
      ((_parent$__directives2 = parent.__directives) !== null && _parent$__directives2 !== void 0 ? _parent$__directives2 : parent.__directives = [])[attributeIndex] = currentDirective;
    } else {
      parent.__directive = currentDirective;
    }
  }
  if (currentDirective !== undefined) {
    value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
  }
  return value;
}
/**
 * An updateable instance of a Template. Holds references to the Parts used to
 * update the template instance.
 */
var TemplateInstance = /*#__PURE__*/function () {
  function TemplateInstance(template, parent) {
    _classCallCheck(this, TemplateInstance);
    this._$parts = [];
    /** @internal */
    this._$disconnectableChildren = undefined;
    this._$template = template;
    this._$parent = parent;
  }
  // Called by ChildPart parentNode getter
  return _createClass(TemplateInstance, [{
    key: "parentNode",
    get: function get() {
      return this._$parent.parentNode;
    }
    // See comment in Disconnectable interface for why this is a getter
  }, {
    key: "_$isConnected",
    get: function get() {
      return this._$parent._$isConnected;
    }
    // This method is separate from the constructor because we need to return a
    // DocumentFragment and we don't want to hold onto it with an instance field.
  }, {
    key: "_clone",
    value: function _clone(options) {
      var _options$creationScop;
      var _this$_$template = this._$template,
        content = _this$_$template.el.content,
        parts = _this$_$template.parts;
      var fragment = ((_options$creationScop = options === null || options === void 0 ? void 0 : options.creationScope) !== null && _options$creationScop !== void 0 ? _options$creationScop : d).importNode(content, true);
      walker.currentNode = fragment;
      var node = walker.nextNode();
      var nodeIndex = 0;
      var partIndex = 0;
      var templatePart = parts[0];
      while (templatePart !== undefined) {
        var _templatePart;
        if (nodeIndex === templatePart.index) {
          var part = void 0;
          if (templatePart.type === CHILD_PART) {
            part = new ChildPart(node, node.nextSibling, this, options);
          } else if (templatePart.type === ATTRIBUTE_PART) {
            part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
          } else if (templatePart.type === ELEMENT_PART) {
            part = new ElementPart(node, this, options);
          }
          this._$parts.push(part);
          templatePart = parts[++partIndex];
        }
        if (nodeIndex !== ((_templatePart = templatePart) === null || _templatePart === void 0 ? void 0 : _templatePart.index)) {
          node = walker.nextNode();
          nodeIndex++;
        }
      }
      // We need to set the currentNode away from the cloned tree so that we
      // don't hold onto the tree even if the tree is detached and should be
      // freed.
      walker.currentNode = d;
      return fragment;
    }
  }, {
    key: "_update",
    value: function _update(values) {
      var i = 0;
      var _iterator2 = _createForOfIteratorHelper(this._$parts),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var part = _step2.value;
          if (part !== undefined) {
            debugLogEvent && debugLogEvent({
              kind: 'set part',
              part: part,
              value: values[i],
              valueIndex: i,
              values: values,
              templateInstance: this
            });
            if (part.strings !== undefined) {
              part._$setValue(values, part, i);
              // The number of values the part consumes is part.strings.length - 1
              // since values are in between template spans. We increment i by 1
              // later in the loop, so increment it by part.strings.length - 2 here
              i += part.strings.length - 2;
            } else {
              part._$setValue(values[i]);
            }
          }
          i++;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }]);
}();
var ChildPart = /*#__PURE__*/function () {
  function ChildPart(startNode, endNode, parent, options) {
    var _options$isConnected;
    _classCallCheck(this, ChildPart);
    this.type = CHILD_PART;
    this._$committedValue = nothing;
    // The following fields will be patched onto ChildParts when required by
    // AsyncDirective
    /** @internal */
    this._$disconnectableChildren = undefined;
    this._$startNode = startNode;
    this._$endNode = endNode;
    this._$parent = parent;
    this.options = options;
    // Note __isConnected is only ever accessed on RootParts (i.e. when there is
    // no _$parent); the value on a non-root-part is "don't care", but checking
    // for parent would be more code
    this.__isConnected = (_options$isConnected = options === null || options === void 0 ? void 0 : options.isConnected) !== null && _options$isConnected !== void 0 ? _options$isConnected : true;
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      // Explicitly initialize for consistent class shape.
      this._textSanitizer = undefined;
    }
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  return _createClass(ChildPart, [{
    key: "_$isConnected",
    get:
    // See comment in Disconnectable interface for why this is a getter
    function get() {
      var _this$_$parent$_$isCo, _this$_$parent;
      // ChildParts that are not at the root should always be created with a
      // parent; only RootChildNode's won't, so they return the local isConnected
      // state
      return (_this$_$parent$_$isCo = (_this$_$parent = this._$parent) === null || _this$_$parent === void 0 ? void 0 : _this$_$parent._$isConnected) !== null && _this$_$parent$_$isCo !== void 0 ? _this$_$parent$_$isCo : this.__isConnected;
    }
  }, {
    key: "parentNode",
    get: function get() {
      var _parentNode;
      var parentNode = wrap(this._$startNode).parentNode;
      var parent = this._$parent;
      if (parent !== undefined && ((_parentNode = parentNode) === null || _parentNode === void 0 ? void 0 : _parentNode.nodeType) === 11 /* Node.DOCUMENT_FRAGMENT */) {
        // If the parentNode is a DocumentFragment, it may be because the DOM is
        // still in the cloned fragment during initial render; if so, get the real
        // parentNode the part will be committed into by asking the parent.
        parentNode = parent.parentNode;
      }
      return parentNode;
    }
    /**
     * The part's leading marker node, if any. See `.parentNode` for more
     * information.
     */
  }, {
    key: "startNode",
    get: function get() {
      return this._$startNode;
    }
    /**
     * The part's trailing marker node, if any. See `.parentNode` for more
     * information.
     */
  }, {
    key: "endNode",
    get: function get() {
      return this._$endNode;
    }
  }, {
    key: "_$setValue",
    value: function _$setValue(value) {
      var directiveParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      if (DEV_MODE && this.parentNode === null) {
        throw new Error("This `ChildPart` has no `parentNode` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's `innerHTML` or `textContent` can do this.");
      }
      value = resolveDirective(this, value, directiveParent);
      if (isPrimitive(value)) {
        // Non-rendering child values. It's important that these do not render
        // empty text nodes to avoid issues with preventing default <slot>
        // fallback content.
        if (value === nothing || value == null || value === '') {
          if (this._$committedValue !== nothing) {
            debugLogEvent && debugLogEvent({
              kind: 'commit nothing to child',
              start: this._$startNode,
              end: this._$endNode,
              parent: this._$parent,
              options: this.options
            });
            this._$clear();
          }
          this._$committedValue = nothing;
        } else if (value !== this._$committedValue && value !== noChange) {
          this._commitText(value);
        }
        // This property needs to remain unminified.
      } else if (value['_$litType$'] !== undefined) {
        this._commitTemplateResult(value);
      } else if (value.nodeType !== undefined) {
        var _this$options;
        if (DEV_MODE && ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.host) === value) {
          this._commitText("[probable mistake: rendered a template's host in itself " + "(commonly caused by writing ${this} in a template]");
          console.warn("Attempted to render the template host", value, "inside itself. This is almost always a mistake, and in dev mode ", "we render some warning text. In production however, we'll ", "render it, which will usually result in an error, and sometimes ", "in the element disappearing from the DOM.");
          return;
        }
        this._commitNode(value);
      } else if (isIterable(value)) {
        this._commitIterable(value);
      } else {
        // Fallback, will render the string representation
        this._commitText(value);
      }
    }
  }, {
    key: "_insert",
    value: function _insert(node) {
      return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
    }
  }, {
    key: "_commitNode",
    value: function _commitNode(value) {
      if (this._$committedValue !== value) {
        this._$clear();
        if (ENABLE_EXTRA_SECURITY_HOOKS && sanitizerFactoryInternal !== noopSanitizer) {
          var _this$_$startNode$par;
          var parentNodeName = (_this$_$startNode$par = this._$startNode.parentNode) === null || _this$_$startNode$par === void 0 ? void 0 : _this$_$startNode$par.nodeName;
          if (parentNodeName === 'STYLE' || parentNodeName === 'SCRIPT') {
            var message = 'Forbidden';
            if (DEV_MODE) {
              if (parentNodeName === 'STYLE') {
                message = "Lit does not support binding inside style nodes. " + "This is a security risk, as style injection attacks can " + "exfiltrate data and spoof UIs. " + "Consider instead using css`...` literals " + "to compose styles, and do dynamic styling with " + "css custom properties, ::parts, <slot>s, " + "and by mutating the DOM rather than stylesheets.";
              } else {
                message = "Lit does not support binding inside script nodes. " + "This is a security risk, as it could allow arbitrary " + "code execution.";
              }
            }
            throw new Error(message);
          }
        }
        debugLogEvent && debugLogEvent({
          kind: 'commit node',
          start: this._$startNode,
          parent: this._$parent,
          value: value,
          options: this.options
        });
        this._$committedValue = this._insert(value);
      }
    }
  }, {
    key: "_commitText",
    value: function _commitText(value) {
      // If the committed value is a primitive it means we called _commitText on
      // the previous render, and we know that this._$startNode.nextSibling is a
      // Text node. We can now just replace the text content (.data) of the node.
      if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
        var node = wrap(this._$startNode).nextSibling;
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
          if (this._textSanitizer === undefined) {
            this._textSanitizer = createSanitizer(node, 'data', 'property');
          }
          value = this._textSanitizer(value);
        }
        debugLogEvent && debugLogEvent({
          kind: 'commit text',
          node: node,
          value: value,
          options: this.options
        });
        node.data = value;
      } else {
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
          var textNode = d.createTextNode('');
          this._commitNode(textNode);
          // When setting text content, for security purposes it matters a lot
          // what the parent is. For example, <style> and <script> need to be
          // handled with care, while <span> does not. So first we need to put a
          // text node into the document, then we can sanitize its content.
          if (this._textSanitizer === undefined) {
            this._textSanitizer = createSanitizer(textNode, 'data', 'property');
          }
          value = this._textSanitizer(value);
          debugLogEvent && debugLogEvent({
            kind: 'commit text',
            node: textNode,
            value: value,
            options: this.options
          });
          textNode.data = value;
        } else {
          this._commitNode(d.createTextNode(value));
          debugLogEvent && debugLogEvent({
            kind: 'commit text',
            node: wrap(this._$startNode).nextSibling,
            value: value,
            options: this.options
          });
        }
      }
      this._$committedValue = value;
    }
  }, {
    key: "_commitTemplateResult",
    value: function _commitTemplateResult(result) {
      var _this$_$committedValu;
      // This property needs to remain unminified.
      var values = result.values,
        type = result['_$litType$'];
      // If $litType$ is a number, result is a plain TemplateResult and we get
      // the template from the template cache. If not, result is a
      // CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
      // to create the <template> element the first time we see it.
      var template = typeof type === 'number' ? this._$getTemplate(result) : (type.el === undefined && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
      if (((_this$_$committedValu = this._$committedValue) === null || _this$_$committedValu === void 0 ? void 0 : _this$_$committedValu._$template) === template) {
        debugLogEvent && debugLogEvent({
          kind: 'template updating',
          template: template,
          instance: this._$committedValue,
          parts: this._$committedValue._$parts,
          options: this.options,
          values: values
        });
        this._$committedValue._update(values);
      } else {
        var instance = new TemplateInstance(template, this);
        var fragment = instance._clone(this.options);
        debugLogEvent && debugLogEvent({
          kind: 'template instantiated',
          template: template,
          instance: instance,
          parts: instance._$parts,
          options: this.options,
          fragment: fragment,
          values: values
        });
        instance._update(values);
        debugLogEvent && debugLogEvent({
          kind: 'template instantiated and updated',
          template: template,
          instance: instance,
          parts: instance._$parts,
          options: this.options,
          fragment: fragment,
          values: values
        });
        this._commitNode(fragment);
        this._$committedValue = instance;
      }
    }
    // Overridden via `litHtmlPolyfillSupport` to provide platform support.
    /** @internal */
  }, {
    key: "_$getTemplate",
    value: function _$getTemplate(result) {
      var template = templateCache.get(result.strings);
      if (template === undefined) {
        templateCache.set(result.strings, template = new Template(result));
      }
      return template;
    }
  }, {
    key: "_commitIterable",
    value: function _commitIterable(value) {
      // For an Iterable, we create a new InstancePart per item, then set its
      // value to the item. This is a little bit of overhead for every item in
      // an Iterable, but it lets us recurse easily and efficiently update Arrays
      // of TemplateResults that will be commonly returned from expressions like:
      // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
      // If value is an array, then the previous render was of an
      // iterable and value will contain the ChildParts from the previous
      // render. If value is not an array, clear this part and make a new
      // array for ChildParts.
      if (!isArray(this._$committedValue)) {
        this._$committedValue = [];
        this._$clear();
      }
      // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render
      var itemParts = this._$committedValue;
      var partIndex = 0;
      var itemPart;
      var _iterator3 = _createForOfIteratorHelper(value),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var item = _step3.value;
          if (partIndex === itemParts.length) {
            // If no existing part, create a new one
            // TODO (justinfagnani): test perf impact of always creating two parts
            // instead of sharing parts between nodes
            // https://github.com/lit/lit/issues/1266
            itemParts.push(itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
          } else {
            // Reuse an existing part
            itemPart = itemParts[partIndex];
          }
          itemPart._$setValue(item);
          partIndex++;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (partIndex < itemParts.length) {
        // itemParts always have end nodes
        this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
      }
    }
    /**
     * Removes the nodes contained within this Part from the DOM.
     *
     * @param start Start node to clear from, for clearing a subset of the part's
     *     DOM (used when truncating iterables)
     * @param from  When `start` is specified, the index within the iterable from
     *     which ChildParts are being removed, used for disconnecting directives in
     *     those Parts.
     *
     * @internal
     */
  }, {
    key: "_$clear",
    value: function _$clear() {
      var _this$_$notifyConnect;
      var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : wrap(this._$startNode).nextSibling;
      var from = arguments.length > 1 ? arguments[1] : undefined;
      (_this$_$notifyConnect = this._$notifyConnectionChanged) === null || _this$_$notifyConnect === void 0 || _this$_$notifyConnect.call(this, false, true, from);
      while (start && start !== this._$endNode) {
        var n = wrap(start).nextSibling;
        wrap(start).remove();
        start = n;
      }
    }
    /**
     * Implementation of RootPart's `isConnected`. Note that this method
     * should only be called on `RootPart`s (the `ChildPart` returned from a
     * top-level `render()` call). It has no effect on non-root ChildParts.
     * @param isConnected Whether to set
     * @internal
     */
  }, {
    key: "setConnected",
    value: function setConnected(isConnected) {
      if (this._$parent === undefined) {
        var _this$_$notifyConnect2;
        this.__isConnected = isConnected;
        (_this$_$notifyConnect2 = this._$notifyConnectionChanged) === null || _this$_$notifyConnect2 === void 0 || _this$_$notifyConnect2.call(this, isConnected);
      } else if (DEV_MODE) {
        throw new Error('part.setConnected() may only be called on a ' + 'RootPart returned from render().');
      }
    }
  }]);
}();
var AttributePart = /*#__PURE__*/function () {
  function AttributePart(element, name, strings, parent, options) {
    _classCallCheck(this, AttributePart);
    this.type = ATTRIBUTE_PART;
    /** @internal */
    this._$committedValue = nothing;
    /** @internal */
    this._$disconnectableChildren = undefined;
    this.element = element;
    this.name = name;
    this._$parent = parent;
    this.options = options;
    if (strings.length > 2 || strings[0] !== '' || strings[1] !== '') {
      this._$committedValue = new Array(strings.length - 1).fill(new String());
      this.strings = strings;
    } else {
      this._$committedValue = nothing;
    }
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._sanitizer = undefined;
    }
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  return _createClass(AttributePart, [{
    key: "tagName",
    get: function get() {
      return this.element.tagName;
    }
    // See comment in Disconnectable interface for why this is a getter
  }, {
    key: "_$isConnected",
    get: function get() {
      return this._$parent._$isConnected;
    }
  }, {
    key: "_$setValue",
    value: function _$setValue(value) {
      var directiveParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      var valueIndex = arguments.length > 2 ? arguments[2] : undefined;
      var noCommit = arguments.length > 3 ? arguments[3] : undefined;
      var strings = this.strings;
      // Whether any of the values has changed, for dirty-checking
      var change = false;
      if (strings === undefined) {
        // Single-value binding case
        value = resolveDirective(this, value, directiveParent, 0);
        change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
        if (change) {
          this._$committedValue = value;
        }
      } else {
        // Interpolation case
        var values = value;
        value = strings[0];
        var i, v;
        for (i = 0; i < strings.length - 1; i++) {
          v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
          if (v === noChange) {
            // If the user-provided value is `noChange`, use the previous value
            v = this._$committedValue[i];
          }
          change || (change = !isPrimitive(v) || v !== this._$committedValue[i]);
          if (v === nothing) {
            value = nothing;
          } else if (value !== nothing) {
            value += (v !== null && v !== void 0 ? v : '') + strings[i + 1];
          }
          // We always record each value, even if one is `nothing`, for future
          // change detection.
          this._$committedValue[i] = v;
        }
      }
      if (change && !noCommit) {
        this._commitValue(value);
      }
    }
    /** @internal */
  }, {
    key: "_commitValue",
    value: function _commitValue(value) {
      if (value === nothing) {
        wrap(this.element).removeAttribute(this.name);
      } else {
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
          if (this._sanitizer === undefined) {
            this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'attribute');
          }
          value = this._sanitizer(value !== null && value !== void 0 ? value : '');
        }
        debugLogEvent && debugLogEvent({
          kind: 'commit attribute',
          element: this.element,
          name: this.name,
          value: value,
          options: this.options
        });
        wrap(this.element).setAttribute(this.name, value !== null && value !== void 0 ? value : '');
      }
    }
  }]);
}();
var PropertyPart = /*#__PURE__*/function (_AttributePart) {
  function PropertyPart() {
    var _this;
    _classCallCheck(this, PropertyPart);
    _this = _callSuper(this, PropertyPart, arguments);
    _this.type = PROPERTY_PART;
    return _this;
  }
  /** @internal */
  _inherits(PropertyPart, _AttributePart);
  return _createClass(PropertyPart, [{
    key: "_commitValue",
    value: function _commitValue(value) {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._sanitizer === undefined) {
          this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'property');
        }
        value = this._sanitizer(value);
      }
      debugLogEvent && debugLogEvent({
        kind: 'commit property',
        element: this.element,
        name: this.name,
        value: value,
        options: this.options
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.element[this.name] = value === nothing ? undefined : value;
    }
  }]);
}(AttributePart);
var BooleanAttributePart = /*#__PURE__*/function (_AttributePart2) {
  function BooleanAttributePart() {
    var _this2;
    _classCallCheck(this, BooleanAttributePart);
    _this2 = _callSuper(this, BooleanAttributePart, arguments);
    _this2.type = BOOLEAN_ATTRIBUTE_PART;
    return _this2;
  }
  /** @internal */
  _inherits(BooleanAttributePart, _AttributePart2);
  return _createClass(BooleanAttributePart, [{
    key: "_commitValue",
    value: function _commitValue(value) {
      debugLogEvent && debugLogEvent({
        kind: 'commit boolean attribute',
        element: this.element,
        name: this.name,
        value: !!(value && value !== nothing),
        options: this.options
      });
      wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
    }
  }]);
}(AttributePart);
var EventPart = /*#__PURE__*/function (_AttributePart3) {
  function EventPart(element, name, strings, parent, options) {
    var _this3;
    _classCallCheck(this, EventPart);
    _this3 = _callSuper(this, EventPart, [element, name, strings, parent, options]);
    _this3.type = EVENT_PART;
    if (DEV_MODE && _this3.strings !== undefined) {
      throw new Error("A `<".concat(element.localName, ">` has a `@").concat(name, "=...` listener with ") + 'invalid content. Event listeners in templates must have exactly ' + 'one expression and no surrounding text.');
    }
    return _this3;
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _inherits(EventPart, _AttributePart3);
  return _createClass(EventPart, [{
    key: "_$setValue",
    value: function _$setValue(newListener) {
      var _resolveDirective;
      var directiveParent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      newListener = (_resolveDirective = resolveDirective(this, newListener, directiveParent, 0)) !== null && _resolveDirective !== void 0 ? _resolveDirective : nothing;
      if (newListener === noChange) {
        return;
      }
      var oldListener = this._$committedValue;
      // If the new value is nothing or any options change we have to remove the
      // part as a listener.
      var shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
      // If the new value is not nothing and we removed the listener, we have
      // to add the part as a listener.
      var shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
      debugLogEvent && debugLogEvent({
        kind: 'commit event listener',
        element: this.element,
        name: this.name,
        value: newListener,
        options: this.options,
        removeListener: shouldRemoveListener,
        addListener: shouldAddListener,
        oldListener: oldListener
      });
      if (shouldRemoveListener) {
        this.element.removeEventListener(this.name, this, oldListener);
      }
      if (shouldAddListener) {
        // Beware: IE11 and Chrome 41 don't like using the listener as the
        // options object. Figure out how to deal w/ this in IE11 - maybe
        // patch addEventListener?
        this.element.addEventListener(this.name, this, newListener);
      }
      this._$committedValue = newListener;
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      if (typeof this._$committedValue === 'function') {
        var _this$options$host, _this$options2;
        this._$committedValue.call((_this$options$host = (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.host) !== null && _this$options$host !== void 0 ? _this$options$host : this.element, event);
      } else {
        this._$committedValue.handleEvent(event);
      }
    }
  }]);
}(AttributePart);
var ElementPart = /*#__PURE__*/function () {
  function ElementPart(element, parent, options) {
    _classCallCheck(this, ElementPart);
    this.element = element;
    this.type = ELEMENT_PART;
    /** @internal */
    this._$disconnectableChildren = undefined;
    this._$parent = parent;
    this.options = options;
  }
  // See comment in Disconnectable interface for why this is a getter
  return _createClass(ElementPart, [{
    key: "_$isConnected",
    get: function get() {
      return this._$parent._$isConnected;
    }
  }, {
    key: "_$setValue",
    value: function _$setValue(value) {
      debugLogEvent && debugLogEvent({
        kind: 'commit to element binding',
        element: this.element,
        value: value,
        options: this.options
      });
      resolveDirective(this, value);
    }
  }]);
}();
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports mangled in the
 * client side code, we export a _$LH object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-element, which re-exports all of lit-html.
 *
 * @private
 */
var _$LH = {
  // Used in lit-ssr
  _boundAttributeSuffix: boundAttributeSuffix,
  _marker: marker,
  _markerMatch: markerMatch,
  _HTML_RESULT: HTML_RESULT,
  _getTemplateHtml: getTemplateHtml,
  // Used in tests and private-ssr-support
  _TemplateInstance: TemplateInstance,
  _isIterable: isIterable,
  _resolveDirective: resolveDirective,
  _ChildPart: ChildPart,
  _AttributePart: AttributePart,
  _BooleanAttributePart: BooleanAttributePart,
  _EventPart: EventPart,
  _PropertyPart: PropertyPart,
  _ElementPart: ElementPart
};
// Apply polyfills if available
var polyfillSupport = DEV_MODE ? global.litHtmlPolyfillSupportDevMode : global.litHtmlPolyfillSupport;
polyfillSupport === null || polyfillSupport === void 0 || polyfillSupport(Template, ChildPart);
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
((_global$litHtmlVersio = global.litHtmlVersions) !== null && _global$litHtmlVersio !== void 0 ? _global$litHtmlVersio : global.litHtmlVersions = []).push('3.2.1');
if (DEV_MODE && global.litHtmlVersions.length > 1) {
  issueWarning('multiple-versions', "Multiple versions of Lit loaded. " + "Loading multiple versions is not recommended.");
}
/**
 * Renders a value, usually a lit-html TemplateResult, to the container.
 *
 * This example renders the text "Hello, Zoe!" inside a paragraph tag, appending
 * it to the container `document.body`.
 *
 * ```js
 * import {html, render} from 'lit';
 *
 * const name = "Zoe";
 * render(html`<p>Hello, ${name}!</p>`, document.body);
 * ```
 *
 * @param value Any [renderable
 *   value](https://lit.dev/docs/templates/expressions/#child-expressions),
 *   typically a {@linkcode TemplateResult} created by evaluating a template tag
 *   like {@linkcode html} or {@linkcode svg}.
 * @param container A DOM container to render to. The first render will append
 *   the rendered value to the container, and subsequent renders will
 *   efficiently update the rendered value if the same result type was
 *   previously rendered there.
 * @param options See {@linkcode RenderOptions} for options documentation.
 * @see
 * {@link https://lit.dev/docs/libraries/standalone-templates/#rendering-lit-html-templates| Rendering Lit HTML Templates}
 */
var render = function render(value, container, options) {
  var _options$renderBefore;
  if (DEV_MODE && container == null) {
    // Give a clearer error message than
    //     Uncaught TypeError: Cannot read properties of null (reading
    //     '_$litPart$')
    // which reads like an internal Lit error.
    throw new TypeError("The container to render into may not be ".concat(container));
  }
  var renderId = DEV_MODE ? debugLogRenderId++ : 0;
  var partOwnerNode = (_options$renderBefore = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _options$renderBefore !== void 0 ? _options$renderBefore : container;
  // This property needs to remain unminified.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var part = partOwnerNode['_$litPart$'];
  debugLogEvent && debugLogEvent({
    kind: 'begin render',
    id: renderId,
    value: value,
    container: container,
    options: options,
    part: part
  });
  if (part === undefined) {
    var _options$renderBefore2;
    var endNode = (_options$renderBefore2 = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _options$renderBefore2 !== void 0 ? _options$renderBefore2 : null;
    // This property needs to remain unminified.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    partOwnerNode['_$litPart$'] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, undefined, options !== null && options !== void 0 ? options : {});
  }
  part._$setValue(value);
  debugLogEvent && debugLogEvent({
    kind: 'end render',
    id: renderId,
    value: value,
    container: container,
    options: options,
    part: part
  });
  return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
  render.setSanitizer = setSanitizer;
  render.createSanitizer = createSanitizer;
  if (DEV_MODE) {
    render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
  }
}

/***/ }),

/***/ "./node_modules/lit/index.js":
/*!***********************************!*\
  !*** ./node_modules/lit/index.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CSSResult: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.CSSResult),
/* harmony export */   LitElement: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.LitElement),
/* harmony export */   ReactiveElement: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.ReactiveElement),
/* harmony export */   _$LE: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LE),
/* harmony export */   _$LH: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__._$LH),
/* harmony export */   adoptStyles: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.adoptStyles),
/* harmony export */   css: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.css),
/* harmony export */   defaultConverter: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.defaultConverter),
/* harmony export */   getCompatibleStyle: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.getCompatibleStyle),
/* harmony export */   html: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.html),
/* harmony export */   isServer: () => (/* reexport safe */ lit_html_is_server_js__WEBPACK_IMPORTED_MODULE_3__.isServer),
/* harmony export */   mathml: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.mathml),
/* harmony export */   noChange: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.noChange),
/* harmony export */   notEqual: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.notEqual),
/* harmony export */   nothing: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.nothing),
/* harmony export */   render: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.render),
/* harmony export */   supportsAdoptingStyleSheets: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.supportsAdoptingStyleSheets),
/* harmony export */   svg: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.svg),
/* harmony export */   unsafeCSS: () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "./node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "./node_modules/lit-html/development/lit-html.js");
/* harmony import */ var lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lit-element/lit-element.js */ "./node_modules/lit-element/development/lit-element.js");
/* harmony import */ var lit_html_is_server_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lit-html/is-server.js */ "./node_modules/lit-html/development/is-server.js");

//# sourceMappingURL=index.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "./node_modules/lit/index.js");
/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.js */ "./src/style.js");
/* harmony import */ var _index_editor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index-editor.js */ "./src/index-editor.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");







const cardName = 'nationalrail-status-card';
const editorName = cardName + '-editor';
customElements.define(editorName, _index_editor_js__WEBPACK_IMPORTED_MODULE_2__["default"]);

class NationalrailStatusCard extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
  static properties = {
    attributes: {}
  };

  static styles = _style_js__WEBPACK_IMPORTED_MODULE_1__["default"];
  static getConfigElement() {
    return document.createElement(editorName);
  }
  set hass(hass) {
    this._hass = hass;
    this.updateProperties();
  }

  // required
  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this._config = config;
    this.updateProperties();
  }
  updateProperties() {
    if (!this._config || !this._hass) {
      return;
    }

    const entity = this._config.entity;
    const entityIndex = entity?.entity ?? entity;
    if (!entityIndex) {
      return;
    }

    const hassentity = this._hass.states[entityIndex]
    this.attributes = hassentity.attributes;
  }
  render() {
    let trains = this.attributes?.trains ?? [];
    if (this._config?.limit) {
      let limit = 0;
      if (typeof this._config.limit === 'number') {
        limit = config.limit;
      }
      else if (typeof this._config.limit === "string") {
        limit = parseInt(this._config.limit);
      }
      if (limit > 0) {
        trains = trains.slice(0, limit);
      }
    }
    let items = (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <h3>No trains scheduled</h3>
    `
    if (trains && trains.length > 0) {
      items = trains.map(this.renderTrain);
    }
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`<ha-card>
      <div id="content">
      <div id="nationalrail-status">
      <h2>${this.attributes?.station}</h3>
      ${items}
      </div>
      </div>
    </ha-card>`
  }


  renderTrain(train) {
    const scheduled = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.parseToTime)(train.scheduled);
    return (0,lit__WEBPACK_IMPORTED_MODULE_0__.html)`
    <div class="train">
      <div class="top-heading">
        <div class="scheduled-container">
          <span class="scheduled">${scheduled}</span>
          <span class="scheduled-status">${(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.status)(train)}</span>
        </div>
        <div class="platform-container">
          <span class="platform-label">Platform </span>
          <span class="platform">${train.platform ?? "-"}</span>
        </div>
      </div>
      <h3 
        id="station-heading-0" 
        tabindex="-1">
        <span class="terminus">${train.terminus}</span>
      </h3>
      <h4>Calling at ${train.destinations.map(dest => (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.destinationPresent)(dest, train.expected)).join(", ")}</h4 >
    </div >
      `
  }

}



customElements.define(cardName, NationalrailStatusCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: cardName,
  name: 'Nationalrail Status Card',
  description: 'Card showing the status of the London Underground lines',
});
})();

/******/ })()
;
//# sourceMappingURL=nationalrail-status-card.js.map