export class AccessTokenService {
  private token = '';
  private expiresAtMs = 0;

  get() {
    return this.token;
  }

  isExpiredOrAboutToExpire() {
    const beforeExpireMs = 3000;
    return this.expiresAtMs - beforeExpireMs < Date.now();
  }

  set(token: string) {
    this.token = token;

    try {
      const payload = parseJWT(token);
      this.expiresAtMs = payload.exp * 1000;
    } catch (error) {
      console.error('Failed to parse JWT', error);
      this.expiresAtMs = 0;
    }
  }

  delete() {
    this.token = '';
    this.expiresAtMs = 0;
  }
}

function parseJWT(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
