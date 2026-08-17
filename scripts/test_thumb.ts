async function checkImg(id: string) {
  const url = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  const res = await fetch(url);
  console.log(`Image Status for ${id}:`, res.status, "Content-Length:", res.headers.get("content-length"));
}
checkImg("AUn-560s7E0");
checkImg("invalid12345");
