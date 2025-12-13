const API_BASEURL = process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost:8080";
const API_V1 = (API_BASEURL.endsWith("/") ? API_BASEURL.substring(0, API_BASEURL.length - 1) : API_BASEURL) + "/api/v1"

// API Auth
export const API_AUTH_LOGIN = API_V1 + "/auth/login";
export const API_AUTH_REGISTER = API_V1 + "/auth/register";
export const API_AUTH_LOGOUT = API_V1 + "/auth/logout";

// API User
export const API_USER_ME = API_V1 + "/users/me";

// API Fakebook
export const API_FAKEBOOK_PROFILE_LIST = API_V1 + "/fakebook/profiles";
export const API_FAKEBOOK_PROFILE_CREATE = API_V1 + "/fakebook/profiles";
export const API_FAKEBOOK_PROFILE_ME = API_V1 + "/fakebook/profiles/me";
export const API_FAKEBOOK_PROFILE_SWITCH = API_V1 + "/fakebook/profiles/switch";

export const API_FAKEBOOK_POST_LIST = API_V1 + "/fakebook/posts";
export const API_FAKEBOOK_POST_CREATE = API_V1 + "/fakebook/posts";
export const API_FAKEBOOK_POST_DETAIL = API_V1 + "/fakebook/posts/{{id}}";
export const API_FAKEBOOK_POST_DELETE = API_V1 + "/fakebook/posts/{{id}}";
export const API_FAKEBOOK_POST_UPLOAD_MEDIA = API_V1 + "/fakebook/posts/upload-media";
export const API_FAKEBOOK_POST_COMMENT = API_V1 + "/fakebook/posts/{{id}}/comments";
export const API_FAKEBOOK_POST_COMMENT_CREATE = API_V1 + "/fakebook/posts/{{id}}/comments";
export const API_FAKEBOOK_POST_REACT = API_V1 + "/fakebook/posts/{{id}}/react";
export const API_FAKEBOOK_POST_SHARE = API_V1 + "/fakebook/posts/{{id}}/share";
export const API_FAKEBOOK_POST_STATISTIC = API_V1 + "/fakebook/posts/{{id}}/statistic";

export const API_FAKEBOOK_COMMENT_DETAIL = API_V1 + "/fakebook/comments/{{id}}";
export const API_FAKEBOOK_COMMENT_UPDATE = API_V1 + "/fakebook/comments/{{id}}";
export const API_FAKEBOOK_COMMENT_DELETE = API_V1 + "/fakebook/comments/{{id}}";
export const API_FAKEBOOK_COMMENT_REACT = API_V1 + "/fakebook/comments/{{id}}/react";
export const API_FAKEBOOK_COMMENT_STATISTIC = API_V1 + "/fakebook/comments/{{id}}/statistic";
