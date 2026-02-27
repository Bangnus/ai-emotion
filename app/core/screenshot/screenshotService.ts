import html2canvas from "html2canvas"

export async function takeScreenshot() {

  const canvas =
    await html2canvas(document.body)

  return canvas.toDataURL("image/png")
}