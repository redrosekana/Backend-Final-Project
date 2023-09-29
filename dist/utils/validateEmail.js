"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEmail = void 0;
const ValidateEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    else {
        return false;
    }
};
exports.ValidateEmail = ValidateEmail;
