import React from "react";
import ReactDOM from "react-dom";
import ReactPivot from "./src/index";

module.exports = function (el, opts) {
    ReactDOM.render(
        React.createElement(ReactPivot, opts),
        el
    )
}
