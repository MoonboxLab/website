const SHOW_BASE_URL = "https://tsapi.moonbox.com";

export async function GetNonce(walletAddress: string) {
  const response = await fetch(
    `${SHOW_BASE_URL}/api/nonce?address=${walletAddress}`,
    {
      method: "GET",
    },
  );
  return await response.json();
}

export async function GetSubmissions() {
  const response = await fetch(`${SHOW_BASE_URL}/api/submissions`, {
    method: "GET",
  });
  return await response.json();
}

interface LoginParams {
  message: string;
  signature: string;
}
export async function PostLogin(params: LoginParams) {
  const response = await fetch(`${SHOW_BASE_URL}/api/login`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export async function GetVoteQuato(jwt: string) {
  const response = await fetch(`${SHOW_BASE_URL}/api/vote-quota`, {
    method: "GET",
    headers: {
      Authorization: jwt,
    },
  });
  return await response.json();
}

export async function GetVoteSum() {
  const response = await fetch(`${SHOW_BASE_URL}/api/sum`, {
    method: "GET",
  });
  return await response.json();
}

interface VoteParams {
  submission_id: string;
  vote_count: number;
}
export async function PostVote(jwt: string, params: VoteParams) {
  const response = await fetch(`${SHOW_BASE_URL}/api/vote`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      Authorization: jwt,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export async function GetVoteDetails(jwt: string) {
  const response = await fetch(`${SHOW_BASE_URL}/api/vote-details`, {
    method: "GET",
    headers: {
      Authorization: jwt,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}
