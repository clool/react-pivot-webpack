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

var _dataframe = _interopRequireDefault(require("dataframe"));

var _wildemitter = _interopRequireDefault(require("wildemitter"));

var _partial = _interopRequireDefault(require("./partial"));

var _download = _interopRequireDefault(require("./download"));

var _getValue = _interopRequireDefault(require("./get-value"));

var _PivotTable = _interopRequireDefault(require("./PivotTable"));

var _Dimensions = _interopRequireDefault(require("./Dimensions"));

var _ColumnControl = _interopRequireDefault(require("./ColumnControl"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function loadStyles() {
  require('../style.css');
}

var ReactPivot = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(ReactPivot, _React$Component);

  var _super = _createSuper(ReactPivot);

  function ReactPivot(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, ReactPivot);
    _this = _super.call(this, props);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "updateRows", function () {
      var columns = _this.getColumns();

      var sortByTitle = _this.state.sortBy;
      var sortCol = _lodash["default"].find(columns, function (col) {
        return col.title === sortByTitle;
      }) || {};
      var sortBy = sortCol.sortBy || (sortCol.type === 'dimension' ? sortCol.title : sortCol.value);
      var sortDir = _this.state.sortDir;
      var hideRows = _this.state.hideRows;
      var calcOpts = {
        dimensions: _this.state.dimensions,
        sortBy: sortBy,
        sortDir: sortDir,
        compact: _this.props.compact
      };
      var filter = _this.state.solo;

      if (filter) {
        calcOpts.filter = function (dVals) {
          var pass = true;
          Object.keys(filter).forEach(function (title) {
            if (dVals[title] !== filter[title]) pass = false;
          });
          return pass;
        };
      }

      var rows = _this.dataFrame.calculate(calcOpts).filter(function (row) {
        return hideRows ? !hideRows(row) : true;
      });

      _this.setState({
        rows: rows
      });

      _this.props.onData(rows);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setDimensions", function (updatedDimensions) {
      _this.props.eventBus.emit('activeDimensions', updatedDimensions);

      _this.setState({
        dimensions: updatedDimensions
      });

      setTimeout(_this.updateRows, 0);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setHiddenColumns", function (hidden) {
      _this.props.eventBus.emit('hiddenColumns', hidden);

      _this.setState({
        hiddenColumns: hidden
      });

      setTimeout(_this.updateRows, 0);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setSort", function (cTitle) {
      var sortBy = _this.state.sortBy;
      var sortDir = _this.state.sortDir;

      if (sortBy === cTitle) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = cTitle;
        sortDir = 'asc';
      }

      _this.props.eventBus.emit('sortBy', sortBy);

      _this.props.eventBus.emit('sortDir', sortDir);

      _this.setState({
        sortBy: sortBy,
        sortDir: sortDir
      });

      setTimeout(_this.updateRows, 0);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setSolo", function (solo) {
      var newSolo = _this.state.solo;
      newSolo[solo.title] = solo.value;

      _this.props.eventBus.emit('solo', newSolo);

      _this.setState({
        solo: newSolo
      });

      setTimeout(_this.updateRows, 0);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "clearSolo", function (title) {
      var oldSolo = _this.state.solo;
      var newSolo = {};
      Object.keys(oldSolo).forEach(function (k) {
        if (k !== title) newSolo[k] = oldSolo[k];
      });

      _this.props.eventBus.emit('solo', newSolo);

      _this.setState({
        solo: newSolo
      });

      setTimeout(_this.updateRows, 0);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "hideColumn", function (cTitle) {
      var hidden = _this.state.hiddenColumns.concat([cTitle]);

      _this.setHiddenColumns(hidden);

      setTimeout(_this.updateRows, 0);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "downloadCSV", function (rows) {
      var self = (0, _assertThisInitialized2["default"])(_this);

      var columns = _this.getColumns();

      var csv = _lodash["default"].map(columns, 'title').map(JSON.stringify.bind(JSON)).join(',') + '\n';
      var maxLevel = _this.state.dimensions.length - 1;
      var excludeSummary = _this.props.excludeSummaryFromExport;
      rows.forEach(function (row) {
        if (excludeSummary && row._level < maxLevel) return;
        var vals = columns.map(function (col) {
          if (col.type === 'dimension') {
            var val = row[col.title];
          } else {
            var val = (0, _getValue["default"])(col, row);
          }

          if (col.template && self.props.csvTemplateFormat) {
            val = col.template(val);
          }

          return JSON.stringify(val);
        });
        csv += vals.join(',') + '\n';
      });
      (0, _download["default"])(csv, _this.props.csvDownloadFileName, 'text/csv');
    });
    var allDimensions = props.dimensions;

    var activeDimensions = _lodash["default"].filter(_this.props.activeDimensions, function (title) {
      return _lodash["default"].find(allDimensions, function (col) {
        return col.title === title;
      });
    });

    _this.state = {
      dimensions: activeDimensions,
      calculations: {},
      sortBy: _this.props.sortBy,
      sortDir: _this.props.sortDir,
      hiddenColumns: _this.props.hiddenColumns,
      solo: _this.props.solo,
      hideRows: _this.props.hideRows,
      rows: []
    };
    return _this;
  }

  (0, _createClass2["default"])(ReactPivot, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (this.props.defaultStyles) loadStyles();
      this.dataFrame = (0, _dataframe["default"])({
        rows: this.props.rows,
        dimensions: this.props.dimensions,
        reduce: this.props.reduce
      });
      this.updateRows();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      if (newProps.hiddenColumns !== this.props.hiddenColumns) {
        this.setHiddenColumns(newProps.hiddenColumns);
      }

      if (newProps.rows !== this.props.rows) {
        this.dataFrame = (0, _dataframe["default"])({
          rows: newProps.rows,
          dimensions: newProps.dimensions,
          reduce: newProps.reduce
        });
        this.updateRows();
      }
    }
  }, {
    key: "getColumns",
    value: function getColumns() {
      var self = this;
      var columns = [];
      this.state.dimensions.forEach(function (title) {
        var d = _lodash["default"].find(self.props.dimensions, function (col) {
          return col.title === title;
        });

        columns.push({
          type: 'dimension',
          title: d.title,
          value: d.value,
          className: d.className,
          template: d.template,
          sortBy: d.sortBy
        });
      });
      this.props.calculations.forEach(function (c) {
        if (self.state.hiddenColumns.indexOf(c.title) >= 0) return;
        columns.push({
          type: 'calculation',
          title: c.title,
          template: c.template,
          value: c.value,
          className: c.className,
          sortBy: c.sortBy
        });
      });
      return columns;
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "reactPivot"
      }, this.props.hideDimensionFilter ? '' : /*#__PURE__*/_react["default"].createElement(_Dimensions["default"], {
        dimensions: this.props.dimensions,
        subDimensionText: this.props.subDimensionText,
        selectedDimensions: this.state.dimensions,
        onChange: this.setDimensions
      }), /*#__PURE__*/_react["default"].createElement(_ColumnControl["default"], {
        hiddenColumns: this.state.hiddenColumns,
        onChange: this.setHiddenColumns
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "reactPivot-csvExport"
      }, /*#__PURE__*/_react["default"].createElement("button", {
        onClick: (0, _partial["default"])(this.downloadCSV, this.state.rows)
      }, "Export CSV")), Object.keys(this.state.solo).map(function (title) {
        var value = self.state.solo[title];
        return /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            clear: 'both'
          },
          className: "reactPivot-soloDisplay",
          key: 'solo-' + title
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "reactPivot-clearSolo",
          onClick: (0, _partial["default"])(self.clearSolo, title)
        }, "\xD7"), title, ": ", value);
      }), /*#__PURE__*/_react["default"].createElement(_PivotTable["default"], {
        columns: this.getColumns(),
        rows: this.state.rows,
        sortBy: this.state.sortBy,
        sortDir: this.state.sortDir,
        onSort: this.setSort,
        onColumnHide: this.hideColumn,
        nPaginateRows: this.props.nPaginateRows,
        tableClassName: this.props.tableClassName,
        onSolo: this.setSolo,
        soloText: this.props.soloText
      }));
    }
  }]);
  return ReactPivot;
}(_react["default"].Component);

ReactPivot.defaultProps = {
  rows: [],
  dimensions: [],
  activeDimensions: [],
  reduce: function reduce() {},
  tableClassName: '',
  csvDownloadFileName: 'table.csv',
  csvTemplateFormat: false,
  defaultStyles: true,
  nPaginateRows: 25,
  solo: {},
  hiddenColumns: [],
  hideRows: null,
  sortBy: null,
  sortDir: 'asc',
  eventBus: new _wildemitter["default"](),
  compact: false,
  excludeSummaryFromExport: false,
  onData: function onData() {},
  soloText: "solo",
  subDimensionText: "Sub Dimension..."
};
var _default = ReactPivot;
exports["default"] = _default;