/**
 * Cookie name shared by the server (src/lib/http/adminAuth.ts) and the proxy.
 * The __Host- prefix forces Secure, Path=/ and no Domain, so subdomains cannot
 * set or read it. Browsers only accept it over HTTPS, hence the dev fallback.
 */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-solaris_admin" : "solaris_admin_dev";

export const ADMIN_LOGIN_PATH = "/admin/login";
