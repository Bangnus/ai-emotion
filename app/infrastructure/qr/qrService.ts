import QRCode from "qrcode"

export async function generateQR(
  image: string
) {
  return await QRCode.toDataURL(image)
}