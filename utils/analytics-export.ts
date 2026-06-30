"use client"
import ExcelJS from "exceljs"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface ExportData {
  rangeLabel: string
  summary: { label: string; value: string }[]
  topPages: { path: string; views: string }[]
  countries: { name: string; users: number }[]
  cities: { city: string; country: string; users: string }[]
}

const BRAND = "Energía Solar Canarias"
const ORANGE: [number, number, number] = [228, 87, 44] // --color-primary #e4572c

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportToExcel(data: ExportData) {
  const wb = new ExcelJS.Workbook()
  wb.creator = BRAND

  const resumen = wb.addWorksheet("Resumen")
  resumen.addRow([`${BRAND} — Métricas`])
  resumen.addRow(["Periodo", data.rangeLabel])
  resumen.addRow([])
  resumen.addRow(["Métrica", "Valor"])
  data.summary.forEach((s) => resumen.addRow([s.label, s.value]))

  const paginas = wb.addWorksheet("Páginas")
  paginas.addRow(["Página", "Vistas"])
  if (data.topPages.length) data.topPages.forEach((p) => paginas.addRow([p.path, p.views]))
  else paginas.addRow(["Sin datos en este periodo", ""])

  const paises = wb.addWorksheet("Países")
  paises.addRow(["País", "Usuarios"])
  if (data.countries.length) data.countries.forEach((c) => paises.addRow([c.name, c.users]))
  else paises.addRow(["Sin datos en este periodo", ""])

  const ciudades = wb.addWorksheet("Ciudades")
  ciudades.addRow(["Ciudad", "País", "Usuarios"])
  if (data.cities.length) data.cities.forEach((c) => ciudades.addRow([c.city, c.country, c.users]))
  else ciudades.addRow(["Sin datos en este periodo", "", ""])

  for (const ws of wb.worksheets) {
    ws.columns.forEach((col) => { col.width = 28 })
  }
  resumen.getRow(1).font = { bold: true, size: 14 }
  resumen.getRow(4).font = { bold: true }
  paginas.getRow(1).font = { bold: true }
  paises.getRow(1).font = { bold: true }
  ciudades.getRow(1).font = { bold: true }

  const buffer = await wb.xlsx.writeBuffer()
  triggerDownload(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `esc-analytics-${data.rangeLabel}.xlsx`
  )
}

export function exportToPDF(data: ExportData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" })

  doc.setFontSize(20)
  doc.text(`${BRAND} — Métricas`, 40, 50)
  doc.setFontSize(11)
  doc.setTextColor(120)
  doc.text(`Periodo: ${data.rangeLabel}`, 40, 70)

  autoTable(doc, {
    startY: 90,
    head: [["Métrica", "Valor"]],
    body: data.summary.map((s) => [s.label, s.value]),
    headStyles: { fillColor: ORANGE },
  })

  let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24
  autoTable(doc, {
    startY: y,
    head: [["Página", "Vistas"]],
    body: data.topPages.length ? data.topPages.map((p) => [p.path, p.views]) : [["Sin datos en este periodo", ""]],
    headStyles: { fillColor: ORANGE },
  })

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24
  autoTable(doc, {
    startY: y,
    head: [["País", "Usuarios"]],
    body: data.countries.length ? data.countries.map((c) => [c.name, String(c.users)]) : [["Sin datos en este periodo", ""]],
    headStyles: { fillColor: ORANGE },
  })

  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24
  autoTable(doc, {
    startY: y,
    head: [["Ciudad", "País", "Usuarios"]],
    body: data.cities.length ? data.cities.map((c) => [c.city, c.country, c.users]) : [["Sin datos en este periodo", "", ""]],
    headStyles: { fillColor: ORANGE },
  })

  doc.save(`esc-analytics-${data.rangeLabel}.pdf`)
}
