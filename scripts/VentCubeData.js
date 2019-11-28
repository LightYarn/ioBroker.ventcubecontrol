"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValueDefinitions_1 = require("./ValueDefinitions");
class VentCubeData {
    constructor() {
        this.currentOperationMode = ValueDefinitions_1.OperatingModes.OFF;
        this.currentManualFanLevel = ValueDefinitions_1.FanLevels.AUTO;
        this.currentFanLevel = ValueDefinitions_1.FanLevels.AUTO;
        this.temp_Outside = 0;
    }
    logConsole() {
        console.log("--------------------------------------------------");
        console.log("------------- Current Vent-Cube-Data -------------");
        console.log(". Current Operating Mode: " + this.currentOperationMode);
        console.log(". Current Manual Fan Level: " + this.currentManualFanLevel);
        console.log(". Current Fan Level: " + this.currentFanLevel);
        console.log(". TEMP_Outside: " + this.temp_Outside);
        console.log("--------------------------------------------------");
        console.log("--------------------------------------------------");
    }
}
exports.VentCubeData = VentCubeData;
