import React from "react";
import _ from "lodash";
import DataFrame from "dataframe";
import Emitter from "wildemitter";
import partial from "./partial";
import download from "./download";
import getValue from "./get-value";
import PivotTable from "./PivotTable";
import Dimensions from "./Dimensions";
import ColumnControl from "./ColumnControl";

function loadStyles() {
    require('../style.css')
}

class ReactPivot extends React.Component {

    constructor(props) {
        super(props);
        var allDimensions = props.dimensions
        var activeDimensions = _.filter(this.props.activeDimensions, function (title) {
            return _.find(allDimensions, function (col) {
                return col.title === title
            })
        })
        this.state = {
            dimensions: activeDimensions,
            calculations: {},
            sortBy: this.props.sortBy,
            sortDir: this.props.sortDir,
            hiddenColumns: this.props.hiddenColumns,
            solo: this.props.solo,
            hideRows: this.props.hideRows,
            rows: []
        }
    }

    componentWillMount() {
        if (this.props.defaultStyles) loadStyles()

        this.dataFrame = DataFrame({
            rows: this.props.rows,
            dimensions: this.props.dimensions,
            reduce: this.props.reduce
        })

        this.updateRows()
    }

    componentWillReceiveProps(newProps) {
        if (newProps.hiddenColumns !== this.props.hiddenColumns) {
            this.setHiddenColumns(newProps.hiddenColumns);
        }

        if (newProps.rows !== this.props.rows) {
            this.dataFrame = DataFrame({
                rows: newProps.rows,
                dimensions: newProps.dimensions,
                reduce: newProps.reduce
            })

            this.updateRows()
        }
    }

    getColumns() {
        var self = this
        var columns = []

        this.state.dimensions.forEach(function (title) {
            var d = _.find(self.props.dimensions, function (col) {
                return col.title === title
            })

            columns.push({
                type: 'dimension', title: d.title, value: d.value,
                className: d.className, template: d.template, sortBy: d.sortBy
            })
        })

        this.props.calculations.forEach(function (c) {
            if (self.state.hiddenColumns.indexOf(c.title) >= 0) return

            columns.push({
                type: 'calculation', title: c.title, template: c.template,
                value: c.value, className: c.className, sortBy: c.sortBy
            })
        })

        return columns
    }

    render() {
        var self = this

        return (
            <div className='reactPivot'>

                {this.props.hideDimensionFilter ? '' :
                    <Dimensions
                        dimensions={this.props.dimensions}
                        subDimensionText={this.props.subDimensionText}
                        selectedDimensions={this.state.dimensions}
                        onChange={this.setDimensions}/>
                }

                <ColumnControl
                    hiddenColumns={this.state.hiddenColumns}
                    onChange={this.setHiddenColumns}/>

                <div className="reactPivot-csvExport">
                    <button onClick={partial(this.downloadCSV, this.state.rows)}>
                        Export CSV
                    </button>
                </div>

                {Object.keys(this.state.solo).map(function (title) {
                    var value = self.state.solo[title]

                    return (
                        <div
                            style={{clear: 'both'}}
                            className='reactPivot-soloDisplay'
                            key={'solo-' + title}>
              <span
                  className='reactPivot-clearSolo'
                  onClick={partial(self.clearSolo, title)}>
                &times;
              </span>
                            {title}: {value}
                        </div>
                    )
                })}

                <PivotTable
                    columns={this.getColumns()}
                    rows={this.state.rows}
                    sortBy={this.state.sortBy}
                    sortDir={this.state.sortDir}
                    onSort={this.setSort}
                    onColumnHide={this.hideColumn}
                    nPaginateRows={this.props.nPaginateRows}
                    tableClassName={this.props.tableClassName}
                    onSolo={this.setSolo}
                    soloText={this.props.soloText}
                />
            </div>
        )
    }

    updateRows = () => {
        var columns = this.getColumns()

        var sortByTitle = this.state.sortBy
        var sortCol = _.find(columns, function (col) {
            return col.title === sortByTitle
        }) || {}
        var sortBy = sortCol.sortBy || (sortCol.type === 'dimension' ? sortCol.title : sortCol.value);
        var sortDir = this.state.sortDir
        var hideRows = this.state.hideRows

        var calcOpts = {
            dimensions: this.state.dimensions,
            sortBy: sortBy,
            sortDir: sortDir,
            compact: this.props.compact
        }

        var filter = this.state.solo
        if (filter) {
            calcOpts.filter = function (dVals) {
                var pass = true
                Object.keys(filter).forEach(function (title) {
                    if (dVals[title] !== filter[title]) pass = false
                })
                return pass
            }
        }

        var rows = this.dataFrame
            .calculate(calcOpts)
            .filter(function (row) {
                return hideRows ? !hideRows(row) : true
            })
        this.setState({rows: rows})
        this.props.onData(rows)
    }

    setDimensions = (updatedDimensions) => {
        this.props.eventBus.emit('activeDimensions', updatedDimensions)
        this.setState({dimensions: updatedDimensions})
        setTimeout(this.updateRows, 0)
    }

    setHiddenColumns = (hidden) => {
        this.props.eventBus.emit('hiddenColumns', hidden)
        this.setState({hiddenColumns: hidden})
        setTimeout(this.updateRows, 0)
    }

    setSort = (cTitle) => {
        var sortBy = this.state.sortBy
        var sortDir = this.state.sortDir
        if (sortBy === cTitle) {
            sortDir = (sortDir === 'asc') ? 'desc' : 'asc'
        } else {
            sortBy = cTitle
            sortDir = 'asc'
        }

        this.props.eventBus.emit('sortBy', sortBy)
        this.props.eventBus.emit('sortDir', sortDir)
        this.setState({sortBy: sortBy, sortDir: sortDir})
        setTimeout(this.updateRows, 0)
    }

    setSolo = (solo) => {
        var newSolo = this.state.solo
        newSolo[solo.title] = solo.value
        this.props.eventBus.emit('solo', newSolo)
        this.setState({solo: newSolo})
        setTimeout(this.updateRows, 0)
    }

    clearSolo = (title) => {
        var oldSolo = this.state.solo
        var newSolo = {}
        Object.keys(oldSolo).forEach(function (k) {
            if (k !== title) newSolo[k] = oldSolo[k]
        })
        this.props.eventBus.emit('solo', newSolo)
        this.setState({solo: newSolo})
        setTimeout(this.updateRows, 0)
    }

    hideColumn = (cTitle) => {
        var hidden = this.state.hiddenColumns.concat([cTitle])
        this.setHiddenColumns(hidden)
        setTimeout(this.updateRows, 0)
    }

    downloadCSV = (rows) => {
        var self = this

        var columns = this.getColumns()

        var csv = _.map(columns, 'title')
            .map(JSON.stringify.bind(JSON))
            .join(',') + '\n'

        var maxLevel = this.state.dimensions.length - 1
        var excludeSummary = this.props.excludeSummaryFromExport

        rows.forEach(function (row) {
            if (excludeSummary && (row._level < maxLevel)) return

            var vals = columns.map(function (col) {

                if (col.type === 'dimension') {
                    var val = row[col.title]
                } else {
                    var val = getValue(col, row)
                }

                if (col.template && self.props.csvTemplateFormat) {
                    val = col.template(val)
                }

                return JSON.stringify(val)
            })
            csv += vals.join(',') + '\n'
        })

        download(csv, this.props.csvDownloadFileName, 'text/csv')
    }
}

ReactPivot.defaultProps = {
    rows: [],
    dimensions: [],
    activeDimensions: [],
    reduce: function () {
    },
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
    eventBus: new Emitter,
    compact: false,
    excludeSummaryFromExport: false,
    onData: function () {
    },
    soloText: "solo",
    subDimensionText: "Sub Dimension..."
}

export default ReactPivot;
