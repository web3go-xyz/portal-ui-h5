import { BigNumber } from "bignumber.js";
import utils from "@/utils";

export function formatDate(d) {
    if (d) {
        if (typeof d === 'string') {
            d = parseInt(d);
        }
        return new Date(d * 1000).toUTCString().split(',')[1];
    }
    return d;
}


export function balanceFixed(b) {
    // debugger
    if (b) {
        b = parseFloat(b);
    }
    return b;
}

export function amountFixed(b) {
    if (b) {
        b = parseFloat(b);
    }

    return b;
}

export function shorterAddress(address) {
    if (address && address.length > 20) {
        // debugger
        let subLength = address.length / 4;
        return address.substring(0, subLength) + '...' + address.substring(address.length - subLength);
    } else {
        return address;
    }
}


export function roundNumber(value, flag) {
    if (flag == undefined || flag == null) { flag = 1; }
    let precision = flag;
    if (value !== undefined) {
        let bn = new BigNumber(value);
        return bn.toFormat(precision);
    } else {
        return value
    }

}

export function formatDOT(amount, precision) {
    return utils.formatToken(amount, utils.DOT_Ratio, precision);
}
export function formatKUSAMA(amount, precision) {
    return utils.formatToken(amount, utils.KUSAMA_Ratio, precision);
}
