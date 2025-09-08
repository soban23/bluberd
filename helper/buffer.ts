export default async function imageUrlToBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
