const USER_API_BASEURL = process.env.NEXT_PUBLIC_USER_API_HOST ?? "http://localhost:8080";
const FAKEBOOK_API_BASEURL = process.env.NEXT_PUBLIC_FAKEBOOK_API_HOST ?? "http://localhost:8081";
const USER_API_V1 = (USER_API_BASEURL.endsWith("/") ? USER_API_BASEURL.substring(0, USER_API_BASEURL.length - 1) : USER_API_BASEURL) + "/api/v1"
const FAKEBOOK_API_V1 = (FAKEBOOK_API_BASEURL.endsWith("/") ? FAKEBOOK_API_BASEURL.substring(0, FAKEBOOK_API_BASEURL.length - 1) : FAKEBOOK_API_BASEURL) + "/api/v1"

// API Auth
export const API_AUTH_LOGIN = USER_API_V1 + "/auth/login";
export const API_AUTH_REGISTER = USER_API_V1 + "/auth/register";
export const API_AUTH_LOGOUT = USER_API_V1 + "/auth/logout";
export const API_AUTH_EXTERNAL_PROVIDERS = USER_API_V1 + "/auth/external-providers";
export const API_AUTH_EXTERNAL_LOGIN = USER_API_V1 + "/auth/login-external/{provider}";

// API User
export const API_USER_ME = USER_API_V1 + "/users/me";

// API Fakebook
export const API_FAKEBOOK_PROFILE_LIST = FAKEBOOK_API_V1 + "/fakebook/profiles";
export const API_FAKEBOOK_PROFILE_CREATE = FAKEBOOK_API_V1 + "/fakebook/profiles";
export const API_FAKEBOOK_PROFILE_ME = FAKEBOOK_API_V1 + "/fakebook/profiles/me";
export const API_FAKEBOOK_PROFILE_SWITCH = FAKEBOOK_API_V1 + "/fakebook/profiles/switch";

export const API_FAKEBOOK_POST_LIST = FAKEBOOK_API_V1 + "/fakebook/posts";
export const API_FAKEBOOK_POST_CREATE = FAKEBOOK_API_V1 + "/fakebook/posts";
export const API_FAKEBOOK_POST_DETAIL = FAKEBOOK_API_V1 + "/fakebook/posts/{{id}}";
export const API_FAKEBOOK_POST_DELETE = FAKEBOOK_API_V1 + "/fakebook/posts/{{id}}";
export const API_FAKEBOOK_POST_UPLOAD_MEDIA = USER_API_V1 + "/uploader/new";
export const API_FAKEBOOK_POST_COMMENT = FAKEBOOK_API_V1 + "/fakebook/posts/{{id}}/comments";
export const API_FAKEBOOK_POST_COMMENT_CREATE = FAKEBOOK_API_V1 + "/fakebook/posts/{{id}}/comments";
export const API_FAKEBOOK_POST_REACT = FAKEBOOK_API_V1 + "/fakebook/posts/{{id}}/react";
export const API_FAKEBOOK_POST_SHARE = FAKEBOOK_API_V1 + "/fakebook/posts/{{id}}/share";
export const API_FAKEBOOK_POST_STATISTIC = FAKEBOOK_API_V1 + "/fakebook/posts/{{id}}/statistic";

export const API_FAKEBOOK_COMMENT_DETAIL = FAKEBOOK_API_V1 + "/fakebook/comments/{{id}}";
export const API_FAKEBOOK_COMMENT_UPDATE = FAKEBOOK_API_V1 + "/fakebook/comments/{{id}}";
export const API_FAKEBOOK_COMMENT_DELETE = FAKEBOOK_API_V1 + "/fakebook/comments/{{id}}";
export const API_FAKEBOOK_COMMENT_REACT = FAKEBOOK_API_V1 + "/fakebook/comments/{{id}}/react";
export const API_FAKEBOOK_COMMENT_STATISTIC = FAKEBOOK_API_V1 + "/fakebook/comments/{{id}}/statistic";
