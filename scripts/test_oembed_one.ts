async function checkOEmbed(id: string) {
  const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
  console.log(`Status for ${id}:`, res.status);
  if (res.ok) {
    const data = await res.json();
    console.log("Data:", data.title);
  }
}
checkOEmbed("AUn-560s7E0");
