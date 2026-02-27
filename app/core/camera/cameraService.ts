export async function startCamera(
  video: HTMLVideoElement
) {

  const stream =
    await navigator.mediaDevices.getUserMedia({
      video: true
    })

  video.srcObject = stream

  await video.play()
}