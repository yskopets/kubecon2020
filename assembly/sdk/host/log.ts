import {
    Host, LogLevel,
} from "./abi";

export function trace(message: string): void {
    Host.Log.log(LogLevel.TRACE, message);
}

export function debug(message: string): void {
    Host.Log.log(LogLevel.DEBUG, message);
}

export function info(message: string): void {
    Host.Log.log(LogLevel.INFO, message);
}

export function warn(message: string): void {
    Host.Log.log(LogLevel.INFO, message);
}

export function error(message: string): void {
    Host.Log.log(LogLevel.ERROR, message);
}

export function critical(message: string): void {
    Host.Log.log(LogLevel.CRITICAL, message);
}
