"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash"));

var _partial = _interopRequireDefault(require("./partial"));

var _getValue = _interopRequireDefault(require("./get-value"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PivotTable = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2["default"])(PivotTable, _React$Component);

  var _super = _createSuper(PivotTable);

  function PivotTable(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, PivotTable);
    _this = _super.call(this, props);
    _this.state = {
      paginatePage: 0
    };
    return _this;
  }

  (0, _createClass2["default"])(PivotTable, [{
    key: "render",
    value: function render() {
      var results = this.props.rows;
      var paginatedResults = this.paginate(results);
      var tBody = this.renderTableBody(this.props.columns, paginatedResults.rows);
      var tHead = this.renderTableHead(this.props.columns);
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "reactPivot-results"
      }, /*#__PURE__*/_react["default"].createElement("table", {
        className: this.props.tableClassName
      }, tHead, tBody), this.renderPagination(paginatedResults));
    }
  }, {
    key: "renderTableHead",
    value: function renderTableHead(columns) {
      var self = this;
      var sortBy = this.props.sortBy;
      var sortDir = this.props.sortDir;
      return /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, columns.map(function (col) {
        var className = col.className;
        if (col.title === sortBy) className += ' ' + sortDir;
        var hide = '';
        if (col.type !== 'dimension') hide = /*#__PURE__*/_react["default"].createElement("span", {
          className: "reactPivot-hideColumn",
          onClick: (0, _partial["default"])(self.props.onColumnHide, col.title)
        }, "\xD7");
        return /*#__PURE__*/_react["default"].createElement("th", {
          className: className,
          onClick: (0, _partial["default"])(self.props.onSort, col.title),
          style: {
            cursor: 'pointer'
          },
          key: col.title
        }, hide, col.title);
      })));
    }
  }, {
    key: "renderTableBody",
    value: function renderTableBody(columns, rows) {
      var self = this;
      return /*#__PURE__*/_react["default"].createElement("tbody", null, rows.map(function (row) {
        return /*#__PURE__*/_react["default"].createElement("tr", {
          key: row._key,
          className: "reactPivot-level-" + row._level
        }, columns.map(function (col, i) {
          if (i < row._level) return /*#__PURE__*/_react["default"].createElement("td", {
            key: i,
            className: "reactPivot-indent"
          });
          return self.renderCell(col, row);
        }));
      }));
    }
  }, {
    key: "renderCell",
    value: function renderCell(col, row) {
      var dimensionExists = false;
      var text;
      var val;
      var solo = null;

      if (col.type === 'dimension') {
        val = row[col.title];
        text = val;
        dimensionExists = typeof val !== 'undefined';
        if (col.template && dimensionExists) text = col.template(val, row);
      } else {
        val = (0, _getValue["default"])(col, row);
        text = val;
        if (col.template) text = col.template(val, row);
      }

      if (dimensionExists) {
        solo = /*#__PURE__*/_react["default"].createElement("span", {
          className: "reactPivot-solo"
        }, /*#__PURE__*/_react["default"].createElement("a", {
          style: {
            cursor: 'pointer'
          },
          onClick: (0, _partial["default"])(this.props.onSolo, {
            title: col.title,
            value: val
          })
        }, this.props.soloText));
      }

      var cell = /*#__PURE__*/_react["default"].isValidElement(text) ? /*#__PURE__*/_react["default"].createElement("span", null, text) : /*#__PURE__*/_react["default"].createElement("span", {
        dangerouslySetInnerHTML: {
          __html: text || text === 0 && "0" || ""
        }
      });
      return /*#__PURE__*/_react["default"].createElement("td", {
        className: col.className,
        key: [col.title, row.key].join('\xff'),
        title: col.title
      }, cell, solo);
    }
  }, {
    key: "renderPagination",
    value: function renderPagination(pagination) {
      var self = this;
      var nPaginatePages = pagination.nPages;
      var paginatePage = pagination.curPage;
      if (nPaginatePages === 1) return '';
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "reactPivot-paginate"
      }, _lodash["default"].range(0, nPaginatePages).map(function (n) {
        var c = 'reactPivot-pageNumber';
        if (n === paginatePage) c += ' is-selected';
        return /*#__PURE__*/_react["default"].createElement("span", {
          className: c,
          key: n
        }, /*#__PURE__*/_react["default"].createElement("a", {
          onClick: (0, _partial["default"])(self.setPaginatePage, n)
        }, n + 1));
      }));
    }
  }, {
    key: "paginate",
    value: function paginate(results) {
      if (results.length <= 0) return {
        rows: results,
        nPages: 1,
        curPage: 0
      };
      var paginatePage = this.state.paginatePage;
      var nPaginateRows = this.props.nPaginateRows;
      if (!nPaginateRows || !isFinite(nPaginateRows)) nPaginateRows = results.length;
      var nPaginatePages = Math.ceil(results.length / nPaginateRows);
      if (paginatePage >= nPaginatePages) paginatePage = nPaginatePages - 1;
      var iBoundaryRow = paginatePage * nPaginateRows;
      var boundaryLevel = results[iBoundaryRow]._level;
      var parentRows = [];

      if (boundaryLevel > 0) {
        for (var i = iBoundaryRow - 1; i >= 0; i--) {
          if (results[i]._level < boundaryLevel) {
            parentRows.unshift(results[i]);
            boundaryLevel = results[i]._level;
          }

          if (results[i]._level === 9) break;
        }
      }

      var iEnd = iBoundaryRow + nPaginateRows;
      var rows = parentRows.concat(results.slice(iBoundaryRow, iEnd));
      return {
        rows: rows,
        nPages: nPaginatePages,
        curPage: paginatePage
      };
    }
  }, {
    key: "setPaginatePage",
    value: function setPaginatePage(nPage) {
      this.setState({
        paginatePage: nPage
      });
    }
  }]);
  return PivotTable;
}(_react["default"].Component);

PivotTable.defaultProps = {
  columns: [],
  rows: [],
  sortBy: null,
  sortDir: 'asc',
  onSort: function onSort() {},
  onSolo: function onSolo() {},
  onColumnHide: function onColumnHide() {},
  soloText: "solo"
};
var _default = PivotTable;
exports["default"] = _default;