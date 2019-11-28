"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const FUNCTIONCODES_1 = require("./FUNCTIONCODES");
const VentCubeData_1 = require("./VentCubeData");
const ValueDefinitions_1 = require("./ValueDefinitions");
const ValueParser_1 = require("./ValueParser");
var COMMANDMODES;
(function (COMMANDMODES) {
    COMMANDMODES["NONE"] = "NONE";
    COMMANDMODES["initialRead"] = "initialRead";
    COMMANDMODES["writeData"] = "writeData";
})(COMMANDMODES = exports.COMMANDMODES || (exports.COMMANDMODES = {}));
class Connector {
    constructor(_ipAdress, _port, _ventcubecontrol) {
        this.currentCommandMode = COMMANDMODES.NONE;
        this.socketConnected = false;
        this.ventcubecontrol = _ventcubecontrol;
        this.outputStream = new Buffer(0);
        this.currentReadDataIndex = 0;
        this.ipAddress = _ipAdress;
        this.port = _port;
        this.valueParser = new ValueParser_1.ValueParser(_ventcubecontrol);
        this.ventCubeData = new VentCubeData_1.VentCubeData();
    }
    getVentCubeData() {
        this.ventcubecontrol.writeLog("Trying to get VentCubeData...");
        if (this.currentCommandMode == COMMANDMODES.NONE) {
            this.ventcubecontrol.writeLog("Sucess! Getting VentCubeData...");
            this.currentCommandMode = COMMANDMODES.initialRead;
            this.prepareSocket();
            if (this.socket != null) {
                if (this.socketConnected == true) {
                    this.executeCurrentCommand();
                }
                else {
                    this.ventcubecontrol.writeLog("Connecting Socket...");
                    this.socket.connect(this.port, this.ipAddress);
                }
            }
        }
    }
    setVentCubeData(_address, _value) {
        if (this.currentCommandMode == COMMANDMODES.NONE) {
            this.currentCommandMode = COMMANDMODES.writeData;
            this.writeData_Address = _address;
            this.writeData_Value = _value;
            this.prepareSocket();
            if (this.socket != null) {
                if (this.socketConnected == true) {
                    this.executeCurrentCommand();
                }
                else {
                    this.ventcubecontrol.writeLog("Connecting Socket...");
                    this.socket.connect(this.port, this.ipAddress);
                }
            }
        }
    }
    prepareSocket() {
        if (this.socket == null) {
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
    read(_addr) {
        this.outputStream = Buffer.from(this.prepareMessage_read(_addr, 1));
        if (this.socket != null) {
            this.socket.write(this.outputStream);
        }
    }
    write() {
        if (this.writeData_Address != null && this.writeData_Value != null) {
            this.ventcubecontrol.writeLog("setting " + ValueDefinitions_1.RegisterAdresses[this.writeData_Address] + " to value: " + this.writeData_Value);
            this.outputStream = Buffer.from(this.prepareMessage_write(this.writeData_Address, this.writeData_Value));
            if (this.socket != null) {
                this.socket.write(this.outputStream);
            }
        }
    }
    readData() {
        if (this.ventCubeData == null) {
            this.ventCubeData = new VentCubeData_1.VentCubeData();
        }
        switch (this.currentReadDataIndex) {
            case ValueDefinitions_1.ReadDataIndex.OperationgMode:
                this.read(ValueDefinitions_1.RegisterAdresses.OperationgMode);
                break;
            case ValueDefinitions_1.ReadDataIndex.ManualFanLevel:
                this.read(ValueDefinitions_1.RegisterAdresses.ManualFanLevel);
                break;
            case ValueDefinitions_1.ReadDataIndex.CurrentFanLevel:
                this.read(ValueDefinitions_1.RegisterAdresses.CurrentFanLevel);
                break;
            case ValueDefinitions_1.ReadDataIndex.TempValue_Outside:
                this.read(ValueDefinitions_1.RegisterAdresses.TempValue_Outside);
                break;
            case ValueDefinitions_1.ReadDataIndex.DONE:
                this.ventcubecontrol.writeLog("READ DONE");
                this.ventcubecontrol.logVentCubeDataAdapter();
                this.ventcubecontrol.setStates();
                this.currentCommandMode = COMMANDMODES.NONE;
                if (this.socket != null) {
                    this.socket.end();
                }
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(function () { this.getVentCubeData(); }.bind(this), this.ventcubecontrol.refreshRate * 60000);
                break;
            default:
                throw new Error("UNHANDELED RED DATA-INDEX! WAS: " + this.currentReadDataIndex);
        }
    }
    prepareMessage_read(_startingAddress, _numberOfRegisters) {
        let message = new Uint8Array(12);
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
        message[7] = FUNCTIONCODES_1.FUNCTIONCODES.READ_HoldingRegisters;
        //-----------------------                
        let startAddress_HEX = _startingAddress.toString(16);
        if (startAddress_HEX.length > 4) {
            throw new Error("START ADRESS NOT SUPPORTED");
        }
        else if (startAddress_HEX.length == 1) {
            startAddress_HEX = "000" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 2) {
            startAddress_HEX = "00" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 3) {
            startAddress_HEX = "0" + startAddress_HEX;
        }
        let highBit_string = "0x" + startAddress_HEX[0] + startAddress_HEX[1];
        let lowBit_string = "0x" + startAddress_HEX[2] + startAddress_HEX[3];
        // DATA
        message[8] = highBit_string;
        message[9] = lowBit_string;
        message[10] = 0x00;
        message[11] = _numberOfRegisters;
        //-----------------------
        return message;
    }
    prepareMessage_write(_startingAddress, _value) {
        let message = new Uint8Array(15);
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
        message[7] = FUNCTIONCODES_1.FUNCTIONCODES.WRITE_HoldingRegisters;
        //-----------------------                
        let startAddress_HEX = _startingAddress.toString(16);
        if (startAddress_HEX.length > 4) {
            throw new Error("START ADRESS NOT SUPPORTED");
        }
        else if (startAddress_HEX.length == 1) {
            startAddress_HEX = "000" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 2) {
            startAddress_HEX = "00" + startAddress_HEX;
        }
        else if (startAddress_HEX.length == 3) {
            startAddress_HEX = "0" + startAddress_HEX;
        }
        let highBit_string = "0x" + startAddress_HEX[0] + startAddress_HEX[1];
        let lowBit_string = "0x" + startAddress_HEX[2] + startAddress_HEX[3];
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
    handleAnswer_ReadHoldingRegisters(dv) {
        let responseMessage = "(Read-Holding-Registers) RESPONSE: ";
        let plainResponse = "";
        for (let i = 0; i < dv.byteLength; i++) {
            let hexString = dv.getUint8(i).toString(16);
            if (hexString.length < 2) {
                hexString = "0" + hexString;
            }
            plainResponse += hexString;
        }
        switch (this.currentReadDataIndex) {
            case ValueDefinitions_1.ReadDataIndex.OperationgMode:
                this.ventCubeData.currentOperationMode = this.valueParser.parseOperatingMode(plainResponse);
                this.currentReadDataIndex++;
                break;
            case ValueDefinitions_1.ReadDataIndex.ManualFanLevel:
                this.ventCubeData.currentManualFanLevel = this.valueParser.parseManualFanLevel(plainResponse);
                this.currentReadDataIndex++;
                break;
            case ValueDefinitions_1.ReadDataIndex.CurrentFanLevel:
                this.ventCubeData.currentFanLevel = this.valueParser.parseCurrentFanLevel(plainResponse);
                this.currentReadDataIndex++;
                break;
            case ValueDefinitions_1.ReadDataIndex.TempValue_Outside:
                this.ventCubeData.temp_Outside = this.valueParser.parseTemp_Outside(plainResponse);
                this.currentReadDataIndex = ValueDefinitions_1.ReadDataIndex.DONE;
                break;
            case ValueDefinitions_1.ReadDataIndex.DONE:
                break;
            default:
                throw new Error("UNHANDELED RED DATA-INDEX! WAS: " + this.currentReadDataIndex);
        }
        this.readData();
    }
    handleAnswer_WriteHoldingRegisters(dv) {
        let responseMessage = "(Write-Holding-Registers) RESPONSE: ";
        let plainResponse = "";
        for (let i = 0; i < dv.byteLength; i++) {
            let hexString = dv.getUint8(i).toString(16);
            if (hexString.length < 2) {
                hexString = "0" + hexString;
            }
            plainResponse += hexString;
        }
        this.ventcubecontrol.writeLog(responseMessage + plainResponse);
        this.currentCommandMode = COMMANDMODES.NONE;
    }
    executeCurrentCommand() {
        this.ventcubecontrol.writeLog("CurrentCommandMode: " + this.currentCommandMode);
        switch (this.currentCommandMode) {
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
    socketEvent_close(hadError) {
        if (hadError) {
            this.ventcubecontrol.writeLog("SOCKET-EVENT:  CLOSE!   Had Error: " + hadError);
        }
    }
    socketEvent_connect() {
        this.ventcubecontrol.writeLog("Socket connected!");
        this.socketConnected = true;
        this.executeCurrentCommand();
    }
    socketEvent_data(data) {
        //console.log("SOCKET-EVENT:  DATA");
        let dv = new DataView(data.buffer);
        let responseFunctionCode = parseInt(dv.getUint8(7).toString());
        // ERROR RESPONSE
        if (responseFunctionCode > 80) {
            this.ventcubecontrol.log.error("ERROR RESPONSE!! " + responseFunctionCode + "   ERROR-CODE: " + parseInt(dv.getUint8(8).toString(16)));
        }
        else {
            switch (responseFunctionCode) {
                case FUNCTIONCODES_1.FUNCTIONCODES.READ_HoldingRegisters:
                    this.handleAnswer_ReadHoldingRegisters(dv);
                    break;
                case FUNCTIONCODES_1.FUNCTIONCODES.WRITE_HoldingRegisters:
                    this.handleAnswer_WriteHoldingRegisters(dv);
                    break;
                default:
                    this.ventcubecontrol.log.warn("UNHANDELED FUNCTION-CODE: " + responseFunctionCode);
                    break;
            }
        }
    }
    socketEvent_drain() {
        this.socketConnected = false;
    }
    socketEvent_end() {
        this.socketConnected = false;
    }
    socketEvent_error(err) {
        this.socketConnected = false;
        this.ventcubecontrol.log.error("SOCKET-EVENT:  ERROR!   " + err.message);
    }
    socketEvent_lookup(err, adress, family, host) {
        this.ventcubecontrol.writeLog("SOCKET-EVENT:  LOOKUP");
        if (err != null) {
            console.log("ERROR: " + err);
        }
        if (adress != null) {
            console.log("adress: " + adress);
        }
        if (family != null) {
            console.log("family: " + family);
        }
        if (host != null) {
            console.log("host: " + host);
        }
        console.log("");
    }
    socketEvent_timeout() {
        this.socketConnected = false;
    }
}
exports.Connector = Connector;
