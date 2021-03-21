import React from "react";
import _ from "lodash";
import partial from "./partial";


class Dimensions extends React.Component {

    render() {
        const subDimensionText = this.props.subDimensionText;
        const selectedDimensions = this.props.selectedDimensions;
        const nSelected = selectedDimensions.length;

        return <div className="reactPivot-dimensions">
                {selectedDimensions.map(this.renderDimension)}

                <select value={''} onChange={partial(this.toggleDimension, nSelected)}>
                    <option value={''}>{subDimensionText}</option>
                    {this.props.dimensions.map(function (dimension) {
                        return <option key={dimension.title}>{dimension.title}</option>
                    })}
                </select>
            </div>;
    }

    renderDimension = (selectedDimension, i) => {
        return (
            <select
                value={selectedDimension}
                onChange={partial(this.toggleDimension, i)}
                key={selectedDimension}>
                <option/>
                {this.props.dimensions.map(function (dimension) {
                    return (
                        <option
                            value={dimension.title}
                            key={dimension.title}>
                            {dimension.title}
                        </option>
                    )
                })}
            </select>
        )
    }

    toggleDimension = (iDimension, evt) => {
        const dimension = evt.target.value;
        const dimensions = this.props.selectedDimensions;

        const curIdx = dimensions.indexOf(dimension);
        if (curIdx >= 0) {
            dimensions[curIdx] = null;
        }
        dimensions[iDimension] = dimension;

        const updatedDimensions = _.compact(dimensions);

        this.props.onChange(updatedDimensions)
    }
}

Dimensions.defaultProps = {
    dimensions: [],
    selectedDimensions: [],
    onChange: function () {
    },
    subDimensionText: "Sub Dimension..."
};

export default Dimensions;
