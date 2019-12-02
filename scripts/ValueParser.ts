import { OperatingModes, FanLevels } from "./ValueDefinitions";
import { ventcubecontrol } from "../main";

export class ValueParser
{
    private ventcubecontrol: ventcubecontrol;

    constructor(_ventcubecontrol: ventcubecontrol)
    {
        this.ventcubecontrol = _ventcubecontrol;
    }

    public parseOperatingMode(_response: string): OperatingModes
    {
        let value: string = _response.slice(-2);

        switch (value)
        {
            case "00":
                return OperatingModes.OFF;

            case "01":
                return OperatingModes.MANUAL;

            case "02":
                return OperatingModes.WINTER;

            case "03":
                return OperatingModes.SUMMER;

            case "04":
                return OperatingModes.SUMMER_EX;

            default:
                this.ventcubecontrol.log.warn("UNHANDELED VALUE @parseOperatingMode! Was: " + value);
                return OperatingModes.ERROR;
        }
    }

    public parseManualFanLevel(_response: string): FanLevels
    {
        let value: string = _response.slice(-2);

        switch (value)
        {
            case "00":
                return FanLevels.OFF;

            case "01":
                return FanLevels.LEVEL_1;

            case "02":
                return FanLevels.LEVEL_2;

            case "03":
                return FanLevels.LEVEL_3;

            case "04":
                return FanLevels.LEVEL_4;

            case "05":
                return FanLevels.AUTO;

            case "06":
                return FanLevels.LINEAR;

            default:
                this.ventcubecontrol.log.warn("UNHANDELED VALUE @parseManualFanLevel! Was: " + value);
                return FanLevels.ERROR;
        }
    }

    public parseCurrentFanLevel(_response: string): FanLevels
    {
        let value: string = _response.slice(-2);

        switch (value)
        {
            case "00":
                return FanLevels.OFF;

            case "01":
                return FanLevels.LEVEL_1;

            case "02":
                return FanLevels.LEVEL_2;

            case "03":
                return FanLevels.LEVEL_3;

            case "04":
                return FanLevels.LEVEL_4;           

            default:
                this.ventcubecontrol.log.warn("UNHANDELED VALUE @parseCurrentFanLevel! Was: " + value);
                return FanLevels.ERROR;
        }
    }

    public parseTemp_Outside(_response: string): number
    {
        let temp = (this.hexToInt(_response.slice(-4)) / 10.0);
        this.ventcubecontrol.writeLog("New TEMP: " + temp);
        return temp;    
    }


    private hexToInt(_hex: string): number
    {
        if (_hex.length % 2 != 0)
        {
            _hex = "0" + _hex;
        }

        let num: number = parseInt(_hex, 16);
        let maxVal: number = Math.pow(2, _hex.length / 2 * 8);

        if (num > maxVal / 2 - 1)
        {
            num = num - maxVal
        }


        return num;
    }
}