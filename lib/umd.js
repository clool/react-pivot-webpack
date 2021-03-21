"use strict";

var LoadReactPivot = require('../load');

var root = window || void 0;

if (typeof define === 'function' && define.amd) {
  // AMD
  define(['ReactPivot'], LoadReactPivot);
} else {
  // Global Variables
  root.ReactPivot = LoadReactPivot;
}