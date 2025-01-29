"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _partial = _interopRequireDefault(require("./partial"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Dimensions = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(Dimensions, _React$Component);

  var _super = _createSuper(Dimensions);

  function Dimensions() {
    var _this;

    (0, _classCallCheck2["default"])(this, Dimensions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "renderDimension", function (selectedDimension, i) {
      return /*#__PURE__*/_react["default"].createElement("select", {
        value: selectedDimension,
        onChange: (0, _partial["default"])(_this.toggleDimension, i),
        key: selectedDimension
      }, /*#__PURE__*/_react["default"].createElement("option", null), _this.props.dimensions.map(function (dimension) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          value: dimension.title,
          key: dimension.title
        }, dimension.title);
      }));
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "toggleDimension", function (iDimension, evt) {
      var dimension = evt.target.value;
      var dimensions = _this.props.selectedDimensions;
      var curIdx = dimensions.indexOf(dimension);

      if (curIdx >= 0) {
        dimensions[curIdx] = null;
      }

      dimensions[iDimension] = dimension;

      var updatedDimensions = _lodash["default"].compact(dimensions);

      _this.props.onChange(updatedDimensions);
    });
    return _this;
  }

  (0, _createClass2["default"])(Dimensions, [{
    key: "render",
    value: function render() {
      var subDimensionText = this.props.subDimensionText;
      var selectedDimensions = this.props.selectedDimensions;
      var nSelected = selectedDimensions.length;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "reactPivot-dimensions"
      }, selectedDimensions.map(this.renderDimension), /*#__PURE__*/_react["default"].createElement("select", {
        value: '',
        onChange: (0, _partial["default"])(this.toggleDimension, nSelected)
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: ''
      }, subDimensionText), this.props.dimensions.map(function (dimension) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          key: dimension.title
        }, dimension.title);
      })));
    }
  }]);
  return Dimensions;
}(_react["default"].Component);

Dimensions.defaultProps = {
  dimensions: [],
  selectedDimensions: [],
  onChange: function onChange() {},
  subDimensionText: "Sub Dimension..."
};
var _default = Dimensions;
exports["default"] = _default;