"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegisterAdresses;
(function (RegisterAdresses) {
    RegisterAdresses[RegisterAdresses["OperationgMode"] = 100] = "OperationgMode";
    RegisterAdresses[RegisterAdresses["ManualFanLevel"] = 101] = "ManualFanLevel";
    RegisterAdresses[RegisterAdresses["CurrentFanLevel"] = 102] = "CurrentFanLevel";
    RegisterAdresses[RegisterAdresses["TempValue_Outside"] = 209] = "TempValue_Outside";
})(RegisterAdresses = exports.RegisterAdresses || (exports.RegisterAdresses = {}));
var ReadDataIndex;
(function (ReadDataIndex) {
    ReadDataIndex[ReadDataIndex["OperationgMode"] = 0] = "OperationgMode";
    ReadDataIndex[ReadDataIndex["ManualFanLevel"] = 1] = "ManualFanLevel";
    ReadDataIndex[ReadDataIndex["CurrentFanLevel"] = 2] = "CurrentFanLevel";
    ReadDataIndex[ReadDataIndex["TempValue_Outside"] = 3] = "TempValue_Outside";
    ReadDataIndex[ReadDataIndex["DONE"] = 9999] = "DONE";
})(ReadDataIndex = exports.ReadDataIndex || (exports.ReadDataIndex = {}));
var OperatingModes;
(function (OperatingModes) {
    OperatingModes[OperatingModes["OFF"] = 0] = "OFF";
    OperatingModes[OperatingModes["MANUAL"] = 1] = "MANUAL";
    OperatingModes[OperatingModes["WINTER"] = 2] = "WINTER";
    OperatingModes[OperatingModes["SUMMER"] = 3] = "SUMMER";
    OperatingModes[OperatingModes["SUMMER_EX"] = 4] = "SUMMER_EX";
    OperatingModes[OperatingModes["ERROR"] = 99] = "ERROR";
})(OperatingModes = exports.OperatingModes || (exports.OperatingModes = {}));
var FanLevels;
(function (FanLevels) {
    FanLevels[FanLevels["OFF"] = 0] = "OFF";
    FanLevels[FanLevels["LEVEL_1"] = 1] = "LEVEL_1";
    FanLevels[FanLevels["LEVEL_2"] = 2] = "LEVEL_2";
    FanLevels[FanLevels["LEVEL_3"] = 3] = "LEVEL_3";
    FanLevels[FanLevels["LEVEL_4"] = 4] = "LEVEL_4";
    FanLevels[FanLevels["AUTO"] = 5] = "AUTO";
    FanLevels[FanLevels["LINEAR"] = 6] = "LINEAR";
    FanLevels[FanLevels["ERROR"] = 99] = "ERROR";
})(FanLevels = exports.FanLevels || (exports.FanLevels = {}));
var ObjectIDs;
(function (ObjectIDs) {
    ObjectIDs["lastUpdate"] = "lastUpdate";
    ObjectIDs["operatingMode"] = "operatingMode";
    ObjectIDs["manualFanLevel"] = "manualFanLevel";
    ObjectIDs["currentFanLevel"] = "currentFanLevel";
    ObjectIDs["tempOutside"] = "tempOutside";
})(ObjectIDs = exports.ObjectIDs || (exports.ObjectIDs = {}));
