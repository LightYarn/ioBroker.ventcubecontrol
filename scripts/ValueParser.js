"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValueDefinitions_1 = require("./ValueDefinitions");
class ValueParser {
    constructor(_ventcubecontrol) {
        this.ventcubecontrol = _ventcubecontrol;
    }
    parseOperatingMode(_response) {
        let value = _response.slice(-2);
        switch (value) {
            case "00":
                return ValueDefinitions_1.OperatingModes.OFF;
            case "01":
                return ValueDefinitions_1.OperatingModes.MANUAL;
            case "02":
                return ValueDefinitions_1.OperatingModes.WINTER;
            case "03":
                return ValueDefinitions_1.OperatingModes.SUMMER;
            case "04":
                return ValueDefinitions_1.OperatingModes.SUMMER_EX;
            default:
                this.ventcubecontrol.log.warn("UNHANDELED VALUE @parseOperatingMode! Was: " + value);
                return ValueDefinitions_1.OperatingModes.ERROR;
        }
    }
    parseManualFanLevel(_response) {
        let value = _response.slice(-2);
        switch (value) {
            case "00":
                return ValueDefinitions_1.FanLevels.OFF;
            case "01":
                return ValueDefinitions_1.FanLevels.LEVEL_1;
            case "02":
                return ValueDefinitions_1.FanLevels.LEVEL_2;
            case "03":
                return ValueDefinitions_1.FanLevels.LEVEL_3;
            case "04":
                return ValueDefinitions_1.FanLevels.LEVEL_4;
            case "05":
                return ValueDefinitions_1.FanLevels.AUTO;
            case "06":
                return ValueDefinitions_1.FanLevels.LINEAR;
            default:
                this.ventcubecontrol.log.warn("UNHANDELED VALUE @parseManualFanLevel! Was: " + value);
                return ValueDefinitions_1.FanLevels.ERROR;
        }
    }
    parseCurrentFanLevel(_response) {
        let value = _response.slice(-2);
        switch (value) {
            case "00":
                return ValueDefinitions_1.FanLevels.OFF;
            case "01":
                return ValueDefinitions_1.FanLevels.LEVEL_1;
            case "02":
                return ValueDefinitions_1.FanLevels.LEVEL_2;
            case "03":
                return ValueDefinitions_1.FanLevels.LEVEL_3;
            case "04":
                return ValueDefinitions_1.FanLevels.LEVEL_4;
            default:
                this.ventcubecontrol.log.warn("UNHANDELED VALUE @parseCurrentFanLevel! Was: " + value);
                return ValueDefinitions_1.FanLevels.ERROR;
        }
    }
    parseTemp_Outside(_response) {
        let temp = (this.hexToInt(_response.slice(-4)) / 10.0);
        this.ventcubecontrol.writeLog("New TEMP: " + temp);
        return temp;
    }
    hexToInt(_hex) {
        if (_hex.length % 2 != 0) {
            _hex = "0" + _hex;
        }
        let num = parseInt(_hex, 16);
        let maxVal = Math.pow(2, _hex.length / 2 * 8);
        if (num > maxVal / 2 - 1) {
            num = num - maxVal;
        }
        return num;
    }
}
exports.ValueParser = ValueParser;
