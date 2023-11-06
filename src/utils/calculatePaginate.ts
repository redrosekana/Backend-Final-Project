export function getTotalPages(limit: number, totalDocs: number) {
  return Math.ceil(totalDocs / limit);
}

export function skipDocuments(limit: number, page: number) {
  return limit * (page - 1);
}
