export async function UrlToBase64Image(url, callback) {
  // downloading image
  let response;
  try {
    response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
  } catch (e) {
    console.error('Failed to fetch or convert image:', e);
    return null;
  }

  // reading data
  const blob = await response.blob();
  const lector = new FileReader();
  lector.addEventListener('load', () => {
    callback(lector.result);
  });
  lector.readAsDataURL(blob);
}
