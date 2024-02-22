
const GOLDCARD_BASE_URL = "https://homeapi.moonbox.com"

export async function CheckRaffleResult(walletAddress: string) {
  const response = await fetch(`${GOLDCARD_BASE_URL}/wallet/address/info?userAddress=${walletAddress}`, {
    method: "GET",
  })
  return await response.json()
}

export async function GetSignNonce(walletAddress:string) {
  const response = await fetch(`${GOLDCARD_BASE_URL}/wallet/sign/nonce?userAddress=${walletAddress}`, {
    method: "GET",
  })
  return await response.json()
}

interface FormParams {
  addressee: string
  deliverAddress: string
  email: string
  idNumber: string
  sign: `0x${string}` | undefined
  telNumber: string
  userAddress: `0x${string}` | undefined
}
export async function PostFormInfo(params:FormParams) {
  const response = await fetch(`${GOLDCARD_BASE_URL}/delivery/info/post`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await response.json()
}

interface GetFormInfoProps {
  sign: `0x${string}` | undefined
  userAddress: `0x${string}` | undefined
}
export async function GetFormInfo(params: GetFormInfoProps) {
  const response = await fetch(`${GOLDCARD_BASE_URL}/delivery/info/get`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await response.json() 
}