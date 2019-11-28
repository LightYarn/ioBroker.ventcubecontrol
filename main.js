"use strict";
/*
 * Created with @iobroker/create-adapter v1.17.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const Connector_1 = require("./scripts/Connector");
const ValueDefinitions_1 = require("./scripts/ValueDefinitions");
class ventcubecontrol extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: "ventcubecontrol",
        });
        this.ip = "192.168.000.000";
        this.port = 502;
        this.refreshRate = 5;
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("message",   this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
        this.connector = new Connector_1.Connector(this.ip, this.port, this);
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here
        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.writeLog("config ventCubeIP: " + this.config.ventCubeIP);
        this.ip = this.config.ventCubeIP;
        this.writeLog("Using IP: " + this.ip);
        this.writeLog("config refreshRate: " + this.config.refreshRate);
        this.refreshRate = this.config.refreshRate;
        this.writeLog("Using refreshRate: " + this.refreshRate);
        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        await this.setObjectAsync(ValueDefinitions_1.ObjectIDs.lastUpdate, {
            type: "state",
            common: {
                name: "lastUpdate",
                type: "string",
                role: "state",
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectAsync(ValueDefinitions_1.ObjectIDs.tempOutside, {
            type: "state",
            common: {
                name: "Außentemperatur",
                type: "number",
                role: "value.temperatur",
                unit: "°C",
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setObjectAsync(ValueDefinitions_1.ObjectIDs.operatingMode, {
            type: "state",
            common: {
                name: ValueDefinitions_1.ObjectIDs.operatingMode,
                type: "number",
                role: "level.valve",
                read: true,
                write: true,
            },
            native: {},
        });
        await this.setObjectAsync(ValueDefinitions_1.ObjectIDs.manualFanLevel, {
            type: "state",
            common: {
                name: ValueDefinitions_1.ObjectIDs.manualFanLevel,
                type: "number",
                role: "level.valve",
                read: true,
                write: true,
            },
            native: {},
        });
        await this.setObjectAsync(ValueDefinitions_1.ObjectIDs.currentFanLevel, {
            type: "state",
            common: {
                name: ValueDefinitions_1.ObjectIDs.currentFanLevel,
                type: "number",
                role: "level.valve",
                read: true,
                write: false,
            },
            native: {},
        });
        // in this template all states changes inside the adapters namespace are subscribed
        this.subscribeStates("*");
        /*
        setState examples
        you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
        // the variable testVariable is set to true as command (ack=false)
        //await this.setStateAsync("testVariable", true);
        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        //await this.setStateAsync("testVariable", { val: true, ack: true });
        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        //await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });
        // examples for the checkPassword/checkGroup functions
        //let result = await this.checkPasswordAsync("admin", "iobroker");
        //this.writeLog("check user admin pw ioboker: " + result);
        //
        //result = await this.checkGroupAsync("admin", "admin");
        //this.writeLog("check group user admin group admin: " + result);
        this.connector = new Connector_1.Connector(this.ip, this.port, this);
        this.connector.getVentCubeData();
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            this.writeLog("cleaned everything up...");
            callback();
        }
        catch (e) {
            callback();
        }
    }
    /**
     * Is called if a subscribed object changes
     */
    onObjectChange(id, obj) {
        if (obj) {
            // The object was changed
            this.writeLog(`object ${id} changed: ${JSON.stringify(obj)}`);
        }
        else {
            // The object was deleted
            this.writeLog(`object ${id} deleted`);
        }
    }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.writeLog(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            if (state.c != "init") {
                let idArray = id.split(".");
                let objectID = idArray[2];
                this.handleStateChange(objectID, state.val);
            }
        }
        else {
            // The state was deleted
            this.writeLog(`state ${id} deleted`);
        }
    }
    handleStateChange(_objectID, _value) {
        this.writeLog("Handling State Change! ObjectID: " + _objectID + "  Value: " + _value);
        switch (_objectID) {
            case ValueDefinitions_1.ObjectIDs.tempOutside:
            case ValueDefinitions_1.ObjectIDs.currentFanLevel:
                this.log.warn(_objectID + " is read-only! Setting this value is not supported");
                return;
            case ValueDefinitions_1.ObjectIDs.operatingMode:
                this.writeLog("Setting -OPERATION MODE- got value: " + _value);
                switch (_value) {
                    case ValueDefinitions_1.OperatingModes.OFF:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.OperationgMode, 0);
                        this.connector.ventCubeData.currentOperationMode = ValueDefinitions_1.OperatingModes.OFF;
                        break;
                    case ValueDefinitions_1.OperatingModes.MANUAL:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.OperationgMode, 1);
                        this.connector.ventCubeData.currentOperationMode = ValueDefinitions_1.OperatingModes.MANUAL;
                        break;
                    case ValueDefinitions_1.OperatingModes.WINTER:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.OperationgMode, 2);
                        this.connector.ventCubeData.currentOperationMode = ValueDefinitions_1.OperatingModes.WINTER;
                        break;
                    case ValueDefinitions_1.OperatingModes.SUMMER:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.OperationgMode, 3);
                        this.connector.ventCubeData.currentOperationMode = ValueDefinitions_1.OperatingModes.SUMMER;
                        break;
                    case ValueDefinitions_1.OperatingModes.SUMMER_EX:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.OperationgMode, 4);
                        this.connector.ventCubeData.currentOperationMode = ValueDefinitions_1.OperatingModes.SUMMER_EX;
                        break;
                    default:
                        this.log.error("Unhandeled value for -SET-OPERATION-MODE-! Was: " + _value);
                        break;
                }
                this.writeLog("currentOperationMode now: " + ValueDefinitions_1.OperatingModes[this.connector.ventCubeData.currentOperationMode]);
                this.setStates();
                break;
            case ValueDefinitions_1.ObjectIDs.manualFanLevel:
                this.writeLog("Setting -MANUAL FAN LVEL- got value: " + _value);
                switch (_value) {
                    case ValueDefinitions_1.FanLevels.OFF:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.ManualFanLevel, 0);
                        this.connector.ventCubeData.currentManualFanLevel = ValueDefinitions_1.FanLevels.OFF;
                        break;
                    case ValueDefinitions_1.FanLevels.LEVEL_1:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.ManualFanLevel, 1);
                        this.connector.ventCubeData.currentManualFanLevel = ValueDefinitions_1.FanLevels.LEVEL_1;
                        break;
                    case ValueDefinitions_1.FanLevels.LEVEL_2:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.ManualFanLevel, 2);
                        this.connector.ventCubeData.currentManualFanLevel = ValueDefinitions_1.FanLevels.LEVEL_2;
                        break;
                    case ValueDefinitions_1.FanLevels.LEVEL_3:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.ManualFanLevel, 3);
                        this.connector.ventCubeData.currentManualFanLevel = ValueDefinitions_1.FanLevels.LEVEL_3;
                        break;
                    case ValueDefinitions_1.FanLevels.LEVEL_4:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.ManualFanLevel, 4);
                        this.connector.ventCubeData.currentManualFanLevel = ValueDefinitions_1.FanLevels.LEVEL_4;
                        break;
                    case ValueDefinitions_1.FanLevels.AUTO:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.ManualFanLevel, 5);
                        this.connector.ventCubeData.currentManualFanLevel = ValueDefinitions_1.FanLevels.AUTO;
                        break;
                    case ValueDefinitions_1.FanLevels.LINEAR:
                        this.connector.setVentCubeData(ValueDefinitions_1.RegisterAdresses.ManualFanLevel, 6);
                        this.connector.ventCubeData.currentManualFanLevel = ValueDefinitions_1.FanLevels.LINEAR;
                        break;
                    default:
                        this.log.error("Unhandeled value for -MANUAL FAN LVEL-! Was: " + _value);
                        break;
                }
                this.writeLog("currentManualFanLevel now: " + ValueDefinitions_1.FanLevels[this.connector.ventCubeData.currentFanLevel]);
                this.setStates();
                break;
        }
    }
    getCurrentState() {
        this.connector = new Connector_1.Connector(this.ip, this.port, this);
        this.connector.getVentCubeData();
    }
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.message" property to be set to true in io-package.json
    //  */
    // private onMessage(obj: ioBroker.Message): void {
    // 	if (typeof obj === "object" && obj.message) {
    // 		if (obj.command === "send") {
    // 			// e.g. send email or pushover or whatever
    // 			this.writeLog("send command");
    // 			// Send response in callback if required
    // 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
    // 		}
    // 	}
    // }
    logVentCubeDataAdapter() {
        if (this.connector != null) {
            this.writeLog("------------- Current Vent-Cube-Data -------------");
            this.writeLog(". Current Operating Mode: " + this.connector.ventCubeData.currentOperationMode);
            this.writeLog(". Current Manual Fan Level: " + this.connector.ventCubeData.currentManualFanLevel);
            this.writeLog(". Current Fan Level: " + this.connector.ventCubeData.currentFanLevel);
            this.writeLog(". TEMP_Outside: " + this.connector.ventCubeData.temp_Outside);
            this.writeLog("--------------------------------------------------");
        }
    }
    setStates() {
        let today = new Date();
        let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = (date + "  " + time);
        this.connector.ventCubeData.lastUpdate = dateTime;
        this.setState(ValueDefinitions_1.ObjectIDs.lastUpdate, { val: this.connector.ventCubeData.lastUpdate, ack: true, c: "init" });
        this.setState(ValueDefinitions_1.ObjectIDs.tempOutside, { val: this.connector.ventCubeData.temp_Outside, ack: true, c: "init" });
        this.setState(ValueDefinitions_1.ObjectIDs.operatingMode, { val: ValueDefinitions_1.OperatingModes[this.connector.ventCubeData.currentOperationMode], ack: true, c: "init" });
        this.setState(ValueDefinitions_1.ObjectIDs.manualFanLevel, { val: ValueDefinitions_1.FanLevels[this.connector.ventCubeData.currentManualFanLevel], ack: true, c: "init" });
        this.setState(ValueDefinitions_1.ObjectIDs.currentFanLevel, { val: ValueDefinitions_1.FanLevels[this.connector.ventCubeData.currentFanLevel], ack: true, c: "init" });
    }
    writeLog(message) {
        if (this.config.doLog) {
            this.log.info(message);
        }
    }
}
exports.ventcubecontrol = ventcubecontrol;
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new ventcubecontrol(options);
}
else {
    // otherwise start the instance directly
    (() => new ventcubecontrol())();
}
