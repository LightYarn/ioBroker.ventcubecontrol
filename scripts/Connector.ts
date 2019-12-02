import { Socket } from "dgram";
import net = require("net");
import fs = require('fs');
import { TextEncoder } from "util";
import { FUNCTIONCODES } from "./FUNCTIONCODES";
import { VentCubeData } from "./VentCubeData";
import { ReadDataIndex, RegisterAdresses } from "./ValueDefinitions";
import { ValueParser } from "./ValueParser";
import { ventcubecontrol } from "../main";

export enum COMMANDMODES
{
    NONE = "NONE",
    initialRead = "initialRead",
    writeData = "writeData"
}

export class Connector 
{  
    private outputStream: Buffer;
    private socket: net.Socket | undefined;
    private currentReadDataIndex: ReadDataIndex;

    private ipAddress: string;
    private port: number;

    private ventcubecontrol: ventcubecontrol;
    private valueParser: ValueParser;

    private currentCommandMode: COMMANDMODES = COMMANDMODES.NONE;

    private writeData_Address: number | undefined;
    private writeData_Value: number | undefined;

    private socketConnected: boolean = false;

    private timer: NodeJS.Timer | undefined;




    public ventCubeData: VentCubeData;

    


    constructor(_ipAdress: string, _port: number, _ventcubecontrol: ventcubecontrol)
    {
        this.ventcubecontrol = _ventcubecontrol;

        this.outputStream = new Buffer(0);
        this.currentReadDataIndex = 0;

        this.ipAddress = _ipAdress;
        this.port = _port;


        this.valueParser = new ValueParser(_ventcubecontrol);
        this.ventCubeData = new VentCubeData();
    }


    public getVentCubeData(): void
    {
        this.ventcubecontrol.writeLog("Trying to get VentCubeData...");

        if (this.currentCommandMode == COMMANDMODES.NONE)
        {
            this.ventcubecontrol.writeLog("Sucess! Getting VentCubeData...");
            this.currentCommandMode = COMMANDMODES.initialRead;

            this.prepareSocket();
            if (this.socket != null)
            {
                if (this.socketConnected == true)
                {
                    this.executeCurrentCommand();
                }
                else
                {
                    this.ventcubecontrol.writeLog("Connecting Socket...");
                    this.socket.connect(this.port, this.ipAddress);
                }
            }



        }
        else
        {
            this.ventcubecontrol.log.warn("Tried to GET VentCubeData but Commandmode is not in the corret state! Was: " + this.currentCommandMode);
        }
    }

    public setVentCubeData(_address: number, _value: number)
    {
        if (this.currentCommandMode == COMMANDMODES.NONE)
        {
            this.currentCommandMode = COMMANDMODES.writeData;

            this.writeData_Address = _address;
            this.writeData_Value = _value;

            this.prepareSocket();
            if (this.socket != null)
            {
                if (this.socketConnected == true)
                {
                    this.executeCurrentCommand();
                }
                else
                {
                    this.ventcubecontrol.writeLog("Connecting Socket...");
                    this.socket.connect(this.port, this.ipAddress);
                }
            }
        }
        else
        {
            this.ventcubecontrol.log.warn("Tried to SET VentCubeData but Commandmode is not in the corret state! Was: " + this.currentCommandMode);
        }
    }




    private prepareSocket(): void
    {
        if (this.socket == null)
        {
            this.socket = new net.Socket();
            this.socket.setTimeout(1000);

            this.socket.addListener("close", this.socketEvent_close.bind(this));
            this.socket.addListener("connect", this.socketEvent_connect.bind(this));
            this.socket.addListener("data", this.socketEvent_data.bind(this));
            this.socket.addListener("drain", this.socketEvent_drain.bind(this));
            this.socket.addListener("end", this.socketEvent_end.bind(this));
            this.socket.addListener("error", this.socketEvent_error.bind(this));
            this.socket.addListener("lookup", this.socketEvent_lookup.bind(this));
            this.socket.addListener("timeout", this.socketEvent_timeout.bind(this));
        }
    }
    
    private read(_addr: number): void
    {     
        this.outputStream = Buffer.from(this.prepareMessage_read(_addr, 1));
        if (this.socket != null)
        {           
            this.socket.write(this.outputStream);
        }
    }

    private write(): void
    {
        if (this.writeData_Address != null && this.writeData_Value != null)
        {
            this.ventcubecontrol.writeLog("setting " + RegisterAdresses[this.writeData_Address] + " to value: " + this.writeData_Value);
            this.outputStream = Buffer.from(this.prepareMessage_write(this.writeData_Address, this.writeData_Value));
            if (this.socket != null)
            {
                this.socket.write(this.outputStream);
            }
        }
    }

    private readData(): void
    {
        if (this.ventCubeData == null)
        {
            this.ventcubecontrol.writeLog("Creating new ventCubeData object");
            this.ventCubeData = new VentCubeData();
        }

        this.ventcubecontrol.writeLog("reading Data! Index: " + this.currentReadDataIndex);

        switch (this.currentReadDataIndex)
        {
            case ReadDataIndex.OperationgMode:
                this.read(RegisterAdresses.OperationgMode);
                break;

            case ReadDataIndex.ManualFanLevel:
                this.read(RegisterAdresses.ManualFanLevel);
                break;

            case ReadDataIndex.CurrentFanLevel:
                this.read(RegisterAdresses.CurrentFanLevel);
                break;

            case ReadDataIndex.TempValue_Outside:
                this.read(RegisterAdresses.TempValue_Outside);
                break;








            case ReadDataIndex.DONE:
                this.ventcubecontrol.writeLog("READ DONE");
                this.ventcubecontrol.logVentCubeDataAdapter();
                this.ventcubecontrol.setStates();

                this.currentReadDataIndex = 0;
                this.currentCommandMode = COMMANDMODES.NONE;
                if (this.socket != null)
                {
                    this.socket.end();
                }

                if (this.timer)
                {
                    clearTimeout(this.timer);
                }
                           

                this.timer = setTimeout(function () { this.getVentCubeData(); }.bind(this), this.ventcubecontrol.refreshRate * 60000);


                break;

            default:
                throw new Error("UNHANDELED RED DATA-INDEX! WAS: " + this.currentReadDataIndex);
        }


    }

    private prepareMessage_read(_startingAddress: number, _numberOfRegisters: number,): Uint8Array
    {
        let message: Uint8Array = new Uint8Array(12);       

        // Transaction-Identifier
        message[0] = 0x00;
        message[1] = 0x00;
        //------------------------

        // Protocol-Identifier
        message[2] = 0x00;
        message[3] = 0x00;
        //-----------------------

        // Length
        message[4] = 0x00;
        message[5] = 0x06;
        //-----------------------

        // Unit-Identifier
        message[6] = 0xFF;
        //-----------------------        

        // Function-Code
        message[7] = FUNCTIONCODES.READ_HoldingRegisters;
        //-----------------------                

        let startAddress_HEX: string = _startingAddress.toString(16);
        if (startAddress_HEX.length > 4)
        {
            throw new Error("START ADRESS NOT SUPPORTED");
        }
        else if (startAddress_HEX.length == 1)
        {
            startAddress_HEX = "000" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 2)
        {
            startAddress_HEX = "00" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 3)
        {
            startAddress_HEX = "0" + startAddress_HEX;
        }

        
        
        let highBit_string: any = "0x" + startAddress_HEX[0] + startAddress_HEX[1];
        let lowBit_string: any  = "0x" +startAddress_HEX[2] + startAddress_HEX[3];
                     
        // DATA
        message[8] = highBit_string;
        message[9] = lowBit_string;        
        message[10] = 0x00;
        message[11] = _numberOfRegisters;
        //-----------------------


       


        return message;
    }

    private prepareMessage_write(_startingAddress: number, _value: number): Uint8Array
    {
        let message: Uint8Array = new Uint8Array(15);

        // Transaction-Identifier
        message[0] = 0x00;
        message[1] = 0x00;
        //------------------------

        // Protocol-Identifier
        message[2] = 0x00;
        message[3] = 0x00;
        //-----------------------

        // Length
        message[4] = 0x00;
        message[5] = 0x09;
        //-----------------------

        // Unit-Identifier
        message[6] = 0xFF;
        //-----------------------        

        // Function-Code
        message[7] = FUNCTIONCODES.WRITE_HoldingRegisters;
        //-----------------------                

        let startAddress_HEX: string = _startingAddress.toString(16);
        if (startAddress_HEX.length > 4)
        {
            throw new Error("START ADRESS NOT SUPPORTED");
        }
        else if (startAddress_HEX.length == 1)
        {
            startAddress_HEX = "000" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 2)
        {
            startAddress_HEX = "00" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 3)
        {
            startAddress_HEX = "0" + startAddress_HEX;
        }      

        let highBit_string: any = "0x" + startAddress_HEX[0] + startAddress_HEX[1];
        let lowBit_string: any = "0x" + startAddress_HEX[2] + startAddress_HEX[3];
       

        // START-ADDRESS
        message[8] = highBit_string;
        message[9] = lowBit_string;
        //-----------------------

        // REGISTER-COUNT
        message[10] = 0x00;
        message[11] = 0x01;
        //-----------------------

        // BYTE-COUNT
        message[12] = 0x02;
        //-----------------------

        // BYTE-DATA
        message[13] = 0x00;
        message[14] = _value;
        //-----------------------


      

        return message;
    }


    private handleAnswer_ReadHoldingRegisters(dv: DataView)
    {
        let responseMessage: string = "(Read-Holding-Registers) RESPONSE: ";
        let plainResponse: string = "";

        for (let i = 0; i < dv.byteLength; i++)
        {
            let hexString: string = dv.getUint8(i).toString(16);
            if (hexString.length < 2)
            {
                hexString = "0" + hexString;
            }

            plainResponse += hexString;
        }        

       

        switch (this.currentReadDataIndex)
        {
            case ReadDataIndex.OperationgMode:
                this.ventCubeData.currentOperationMode = this.valueParser.parseOperatingMode(plainResponse);
                this.currentReadDataIndex++;
                break;

            case ReadDataIndex.ManualFanLevel:
                this.ventCubeData.currentManualFanLevel = this.valueParser.parseManualFanLevel(plainResponse);
                this.currentReadDataIndex++;
                break;

            case ReadDataIndex.CurrentFanLevel:
                this.ventCubeData.currentFanLevel = this.valueParser.parseCurrentFanLevel(plainResponse);
                this.currentReadDataIndex++;
                break;

            case ReadDataIndex.TempValue_Outside:
                this.ventCubeData.temp_Outside = this.valueParser.parseTemp_Outside(plainResponse);
                this.currentReadDataIndex = ReadDataIndex.DONE;
                break;



            case ReadDataIndex.DONE:
               
                break;

            default:
                this.ventcubecontrol.log.error("UNHANDELED RED DATA-INDEX! WAS: " + this.currentReadDataIndex);
                throw new Error("UNHANDELED RED DATA-INDEX! WAS: " + this.currentReadDataIndex);
        }

        this.readData();  
    }

    private handleAnswer_WriteHoldingRegisters(dv: DataView)
    {
        let responseMessage: string = "(Write-Holding-Registers) RESPONSE: ";
        let plainResponse: string = "";

        for (let i = 0; i < dv.byteLength; i++)
        {
            let hexString: string = dv.getUint8(i).toString(16);
            if (hexString.length < 2)
            {
                hexString = "0" + hexString;
            }

            plainResponse += hexString;
        }

        this.ventcubecontrol.writeLog(responseMessage + plainResponse);
        this.currentCommandMode = COMMANDMODES.NONE;
    }

    private executeCurrentCommand()
    {
        this.ventcubecontrol.writeLog("CurrentCommandMode: " + this.currentCommandMode);
        switch (this.currentCommandMode)
        {
            case COMMANDMODES.initialRead:
                this.readData();
                return;

            case COMMANDMODES.writeData:
                this.write();
                return;

            default:
                this.ventcubecontrol.log.error(" Unhandeled CurrentCommandMode! Was: " + this.currentCommandMode);
                return;
        }
    }


    private socketEvent_close(hadError: boolean): void
    {
        if (hadError)
        {
            this.ventcubecontrol.writeLog("SOCKET-EVENT:  CLOSE!   Had Error: " + hadError);
        }
    }

    private socketEvent_connect(): void
    {
        this.ventcubecontrol.writeLog("Socket connected!");
        this.socketConnected = true;

        this.executeCurrentCommand();                       
    }

    private socketEvent_data(data: Buffer): void
    {
        //console.log("SOCKET-EVENT:  DATA");

        let dv: DataView = new DataView(data.buffer);

        
        let responseFunctionCode: number = parseInt(dv.getUint8(7).toString());

        // ERROR RESPONSE
        if (responseFunctionCode > 80)
        {
            this.ventcubecontrol.log.error("ERROR RESPONSE!! " + responseFunctionCode + "   ERROR-CODE: " + parseInt(dv.getUint8(8).toString(16)));
        }
        else
        {
            switch (responseFunctionCode)
            {                    
                case FUNCTIONCODES.READ_HoldingRegisters:

                    this.handleAnswer_ReadHoldingRegisters(dv);
                    break;

                case FUNCTIONCODES.WRITE_HoldingRegisters:

                    this.handleAnswer_WriteHoldingRegisters(dv);
                    break;

                default:
                    this.ventcubecontrol.log.warn("UNHANDELED FUNCTION-CODE: " + responseFunctionCode);
                    break;
            }
        }

        

    }

    private socketEvent_drain(): void
    {
        this.socketConnected = false;           
    }

    private socketEvent_end(): void
    {
        this.socketConnected = false;   
    }

    private socketEvent_error(err: Error): void
    {   
        this.socketConnected = false;
        this.ventcubecontrol.log.error("SOCKET-EVENT:  ERROR!   " + err.message);
    }

    private socketEvent_lookup(err: Error, adress: string, family: string | number, host: string): void
    {
        this.ventcubecontrol.writeLog("SOCKET-EVENT:  LOOKUP");

        if (err != null )
        {
            console.log("ERROR: " + err);
        }

        if (adress != null)
        {
            console.log("adress: " + adress);
        }

        if (family != null)
        {
            console.log("family: " + family);
        }

        if (host != null)
        {
            console.log("host: " + host);
        }

        console.log("");
    }

    private socketEvent_timeout(): void
    {
        this.socketConnected = false;
         
    }
}