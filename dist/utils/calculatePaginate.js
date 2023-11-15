"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipDocuments = exports.getTotalPages = void 0;
function getTotalPages(limit, totalDocs) {
    return Math.ceil(totalDocs / limit);
}
exports.getTotalPages = getTotalPages;
function skipDocuments(limit, page) {
    return limit * (page - 1);
}
exports.skipDocuments = skipDocuments;
