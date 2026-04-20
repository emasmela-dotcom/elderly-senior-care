function escapeCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function rowsToCsv(
  headers: string[],
  rows: (string | number | null | undefined)[][]
) {
  const headerLine = headers.map(escapeCell).join(',')
  const body = rows.map((row) =>
    row.map((c) => escapeCell(c == null ? '' : String(c))).join(',')
  )
  return [headerLine, ...body].join('\n')
}
