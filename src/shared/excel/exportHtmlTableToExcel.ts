const default_options = {
  doc: false
}

export const exportExcel = (html_table: string, name: string, options = default_options) => {
  const source = `data:application/vnd.ms-xls;charset=utf-8,${encodeURIComponent(html_table)}`
  const fileDownload = document.createElement('a')
  document.body.appendChild(fileDownload)
  fileDownload.href = source
  if (options.doc) {
    fileDownload.download = `${name}.doc`
  } else {
    fileDownload.download = `${name}.xls`
  }
  fileDownload.click()
  document.body.removeChild(fileDownload)
}
