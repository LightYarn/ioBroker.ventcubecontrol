import { OperatingModes, FanLevels } from "./ValueDefinitions";

export class VentCubeData
{
    public 

    public currentOperationMode: OperatingModes = OperatingModes.OFF;

    public currentManualFanLevel: FanLevels = FanLevels.AUTO;
    public currentFanLevel: FanLevels = FanLevels.AUTO;

    public temp_Outside: number = 0;

    public lastUpdate: string;


    constructor()
    {

    }


    logConsole():void
    {
        console.log("--------------------------------------------------");
        console.log("------------- Current Vent-Cube-Data -------------");
        console.log(". Current Operating Mode: "    + this.currentOperationMode);
        console.log(". Current Manual Fan Level: "  + this.currentManualFanLevel);
        console.log(". Current Fan Level: "         + this.currentFanLevel);
        console.log(". TEMP_Outside: "              + this.temp_Outside);
        console.log("--------------------------------------------------");
        console.log("--------------------------------------------------");
    }

    

    

}