const API_URL = "https://app-api.moonbox.com";
export async function getPoint(address: string) {
  const res = await fetch(`${API_URL}/user/point?address=${address}`);
  return await res.json();
}
