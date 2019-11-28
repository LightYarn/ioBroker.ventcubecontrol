export enum RegisterAdresses
{
    OperationgMode      = 100,
    ManualFanLevel      = 101,
    CurrentFanLevel     = 102,
    TempValue_Outside   = 209
}

export enum ReadDataIndex
{
    OperationgMode      = 0,
    ManualFanLevel      = 1,
    CurrentFanLevel     = 2,
    TempValue_Outside   = 3,


    DONE = 9999
}

export enum OperatingModes
{
    OFF         = 0,
    MANUAL      = 1,
    WINTER      = 2,
    SUMMER      = 3,
    SUMMER_EX   = 4,



    ERROR = 99
}

export enum FanLevels
{
    OFF     = 0,
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3,
    LEVEL_4 = 4,
    AUTO    = 5,
    LINEAR  = 6,



    ERROR   = 99
}

export enum ObjectIDs
{
    lastUpdate = "lastUpdate",
    operatingMode = "operatingMode",
    manualFanLevel = "manualFanLevel",
    currentFanLevel = "currentFanLevel",
    tempOutside = "tempOutside",
}