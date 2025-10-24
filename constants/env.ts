// API Configuration
export const API_BASE_URL = "http://geena.nobody.xyz";

// API Endpoints
export const API_ENDPOINTS = {
  USER_REGISTER: `${API_BASE_URL}/api/user/register`,
  USER_LOGIN: `${API_BASE_URL}/api/user/login`,
  USER_INFO: `${API_BASE_URL}/api/user/info`,
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  USER_RESET_PASSWORD: `${API_BASE_URL}/api/user/reset/password`,
  USER_MODIFY_PASSWORD: `${API_BASE_URL}/api/user/modify/password`,
  SEND_EMAIL_CODE: `${API_BASE_URL}/api/sys/mail`,
  SEND_VERIFICATION_CODE: `${API_BASE_URL}/api/user/send-verification-code`,
  MUSIC_CREATION_RECORD: `${API_BASE_URL}/api/music/creation/record`,
  MUSIC_VOTE_RECORD: `${API_BASE_URL}/api/music/vote/record`,
  MUSIC_TEMPLATE_MONTH_LIST: `${API_BASE_URL}/api/music/template/month/list`,
  MUSIC_CREATION_MONTH_LIST: `${API_BASE_URL}/api/music/creation/month/list`,
  MUSIC_TEMPLATE_LIST: `${API_BASE_URL}/api/music/template/list`,
  MUSIC_CREATION_VOTE_LIST: `${API_BASE_URL}/api/music/creation/vote/list`,
  MUSIC_CREATION: `${API_BASE_URL}/api/music/creation`,
  STS_CREDENTIALS: `${API_BASE_URL}/api/sys/sts`,
} as const;
