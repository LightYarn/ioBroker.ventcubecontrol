"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var COMMANDS;
(function (COMMANDS) {
    /** Abtau ein, beginn Abtauung ab Verdampfertemperatur. Temperatur lesen/schreiben */
    COMMANDS["AE"] = "AE";
    /** Abtau aus, ende Abtauung ab Verdampfertemperatur. Temperatur lesen/schreiben */
    COMMANDS["AA"] = "AA";
    /** Abtau Zuluft lesen/schreiben */
    COMMANDS["Az"] = "Az";
    /** Abtauluft lesen/schreiben */
    COMMANDS["Aa"] = "Aa";
    /** Frost aus lesen/schreiben */
    COMMANDS["AR"] = "AR";
    /** Frost an Schnittstelle lesen/schreiben */
    COMMANDS["AZ"] = "AZ";
    /** Abtaupause lesen/schreiben */
    COMMANDS["AP"] = "AP";
    /** Abtaunachlauf lesen/schreiben */
    COMMANDS["AN"] = "AN";
    /** Frost VerzÃ¶gerung lesen */
    COMMANDS["AV"] = "AV";
    /** Verdampfertemperatur istwert auslesen */
    COMMANDS["T1"] = "T1";
    /** Kondensatortemperatur auslesen */
    COMMANDS["T2"] = "T2";
    /** Aussentemperatur auslesen */
    COMMANDS["T3"] = "T3";
    /** Ablufttemperatur (Raumtemperatur) */
    COMMANDS["T4"] = "T4";
    /** Temperatur nach WÃ¤rmetauscher (Fortluft) lesen */
    COMMANDS["T5"] = "T5";
    /** Zulufttemperatur auslesen */
    COMMANDS["T6"] = "T6";
    /** Temperatur nach SolevorerwÃ¤rmung lesen */
    COMMANDS["T7"] = "T7";
    /** Temperatur nach Vorheizregister lesen */
    COMMANDS["T8"] = "T8";
    /** aktuelle Luftstufe lesen/schreiben */
    COMMANDS["LS"] = "LS";
    /** Luftstufe 1 lesen/schreiben */
    COMMANDS["L1"] = "L1";
    /** Luftstufe 2 lesen/schreiben */
    COMMANDS["L2"] = "L2";
    /** Luftstufe 3 lesen/schreiben */
    COMMANDS["L3"] = "L3";
    /** Zuluft +/- lesen/schreiben */
    COMMANDS["LD"] = "LD";
    /** Abluft +/- lesen/schreiben */
    COMMANDS["Ld"] = "Ld";
    /** ErdwÃ¤rmetauscher vorhanden lesen/schreiben */
    COMMANDS["EC"] = "EC";
    ///** Schaltpunkt Sommer stopp lesen/schreiben */
    //Es,
    //
    ///** Schaltpunkt ErdwÃ¤rmetauscher Sommer lesen/schreiben */
    //ES,
    //
    ///** Schaltpunkt ErdwÃ¤rmetauscher Winter lesen/schreiben */
    //EW,
    //
    ///** Schaltpunkt Solepumpe Ein lesen/schreiben */
    //EE,
    //
    ///** Schaltpunkt Solepumpe aus lesen/schreiben */
    //EA,
    //
    ///** Fehler lesen */
    //ER,
    //
    ///** Status auslesen */
    //ST,
    //
    ///** Status schreib byte auslesen/schreiben (nur bei PC Steuerung) */
    //SW,
    //
    ///** Zuluftsoll Temperatur auslesen/schreiben (nur bei PC Steuerung) */
    //SP,
    //
    ///** Mode auslesen/schreiben (nur bei PC Steuerung) */
    //MD,
    //
    ///** Relais lesen */
    //RL,
    //
    ///** Steuerspannnung Zuluft lesen */
    //UZ,
    //
    ///** Steuerspannnung Abluft lesen */
    //UA,
    //
    ///** Drehzahl Zuluftmotor lesen */
    //NZ,
    //
    ///** Drehzahl Abluftmotor lesen */
    //NA,
    //
    ///** Grenzdrehzahl lesen/schreiben (*50) */
    //NM,
    //
    ///** Configuration auslesen */
    //CN,
    //
    ///** Maximale Kondensationstemperatur lesen/schreiben */
    //KM,
    //
    ///** Zusatzheizung frei (ausgeschaltet (0) oder freigegeben (1)) lesen/schreiben */
    //ZH,
    //
    ///** Zusatzheizung Ein lesen/schreiben */
    //ZE,
    //
    ///** WÃ¤rmepumpe frei (freigegeben (1) oder aus (0)) lesen/schreiben */
    //WP,
    //
    ///** Pausezeit fÃ¼r Druckabbau bei automatischer Umschaltung lesen/schreiben */
    //PA,
    //
    ///** Identifikation lesen */
    //II,
    //
    ///** Messwert, RWZ aktl., Aktuelle RÃ¼ckwÃ¤rmzahl in % */
    //RA,
    //
    ///** Parameter, Delta n 1 max, Max. Drehzahlabweichung Zu-/Abluft in Stufe 1 */
    //D1,
    //
    ///** Parameter, Delta n 2 max, Max. Drehzahlabweichung Zu-/Abluft in Stufe 2 */
    //D2,
    //
    ///** Parameter, Delta n 3 max, Max. Drehzahlabweichung Zu-/Abluft in Stufe 3 */
    //D3,
    //
    ///** Parameter, ERDluft +S1, DrehzahlerhÃ¶hung Zuluftventilator Stufe 1, wenn ErdwÃ¤rmetauscher ein (0% bis 40%) */
    //E1,
    //
    ///** Parameter, ERDluft +S2, DrehzahlerhÃ¶hung Zuluftventilator Stufe 2, wenn ErdwÃ¤rmetauscher ein (0% bis 40%) */
    //E2,
    //
    ///** Parameter, ERDluft +S3, DrehzahlerhÃ¶hung Zuluftventilator Stufe 3, wenn ErdwÃ¤rmetauscher ein (0% bis 40%) */
    //E3,
    //
    ///** Parameter, LuflREDUK, Luftwechsel um 3% reduziert ab AuÃŸentemp. ...Â°C (-20Â°C bis +10Â°C) */
    //LR,
    //
    ///** Parameter Solar max */
    //SM,
    //
    ///** Messwert Solar Nutzen (Stunden) */
    //SN,
    //
    ///** Parameter Delta T Aus Temperaturdifferenz zwischen Speicher u. Kollektor */
    //DA,
    //
    ///** Parameter Delta T Ein Temperaturdifferenz zwischen Speicher u. Kollektor */
    //DE,
    //
    ///** Parameter Unterstuetzungsgeblaese bei Luftstufe 1 bei EWT */
    //S1,
    //
    ///** Parameter Unterstuetzungsgeblaese bei Luftstufe 2 bei EWT */
    //S2,
    //
    ///** Parameter Unterstuetzungsgeblaese bei Luftstufe 3 bei EWT */
    //S3,
    //
    ///** Parameter Warmwasser Sollwert */
    //WS,
    //
    ///** Parameter EVU Sperre */
    //Tf,
    //
    ///** Status auslesen */
    //Ta
})(COMMANDS = exports.COMMANDS || (exports.COMMANDS = {}));
