/**
 * 客户端 HTTP 辅助函数
 * 从 @rock.chen/icms-http-client/web-client 内联，
 * 避免引入 pino/pino-pretty/sonic-boom 等 Node.js 服务端模块
 */

// ---- 类型 ----

/** Cookie 读写接口 */
export interface ICookies {
  get(key: string): string | undefined;
  set?(key: string, value: string): void;
  delete?(key: string): void;
}

/** API 返回模型 */
export interface ResultModel<T = unknown> {
  code: number;
  success: boolean;
  msg: string;
  data?: T;
  headers?: Record<string, string>;
}

/** GET 请求参数 */
export interface ClientGetParams {
  data?: Record<string, string>;
  headers?: Record<string, string>;
  useCache?: boolean;
  showError?: (msg: string) => void;
}

/** POST 请求参数 */
export interface ClientPostParams {
  data?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  showError?: (msg: string) => void;
  showSuccess?: (msg: string) => void;
}

/** Cookie 名称常量 */
export const COOKIE_NAMES = {
  IBOOT_DEVICE_ID: "dvid",
  IBOOT_LANG: "lang",
  IBOOT_WEBSITE_ID: "wid",
  IBOOT_WEBSITE_NO: "wno",
  IBOOT_TOKEN: "token",
  IBOOT_USER: "user",
} as const;

/** Content-Type 常量 */
export const CONTENT_TYPE_KEY = "Content-Type";
export const CONTENT_TYPE_MAP = {
  applicationJson: "application/json",
  multipartFormData: "multipart/form-data",
  applicationXwwwFormUrlencoded: "application/x-www-form-urlencoded",
} as const;

/** 用户信息 */
export interface User {
  id: string;
  name: string;
  userType: number;
  username?: string;
  nickname?: string;
  sex?: number;
  headImg?: string;
  lastLoginTime?: string;
  tokenExpired?: string;
  deviceId?: string;
  status?: number;
  accountType?: number;
  enabled?: boolean;
  userFrom?: number;
  needToReview?: boolean;
  socketOnline?: boolean;
  createTime?: string;
  mustChangePwd?: boolean;
}

// ---- Logger（浏览器 console 实现，唔引入 pino） ----

const logger = {
  info: (msg: unknown, tag: string) => {
    if (process.env.NODE_ENV !== "production") console.info(tag, msg);
  },
  debug: (msg: unknown, tag: string) => {
    if (process.env.NODE_ENV !== "production") console.debug(tag, msg);
  },
  error: (msg: unknown) => {
    console.error(msg);
  },
};

// ---- 函数 ----

/** 从 cookie 中读取已登录用户信息 */
export const getLoginUser = (cookies: ICookies): User | undefined => {
  if (cookies.get) {
    const userjson = cookies.get(COOKIE_NAMES.IBOOT_USER);
    if (userjson && userjson.length > 0) {
      return JSON.parse(userjson);
    }
  }
  return undefined;
};

const getBaseUrl = (urlName: string) => {
  const baseUrl = process.env.BASE_URL || "/api/services";
  return `${baseUrl}?m=${urlName}`;
};

/** 客户端 GET 请求 */
const get = async <T>(
  urlName: string,
  opts?: ClientGetParams,
): Promise<ResultModel<T>> => {
  let url = getBaseUrl(urlName);
  if (opts?.data) {
    const params = new URLSearchParams(opts.data);
    url += `&${params}`;
  }
  const heads = opts?.headers;
  logger.info({ url, headers: heads }, "GET");
  const res = await fetch(url, {
    method: "GET",
    headers: heads,
    cache: opts?.useCache ? "force-cache" : "default",
  });

  if (res.ok) {
    const headersMap = Object.fromEntries(res.headers.entries());
    const result = { ...(await res.json()), headers: headersMap };
    logger.debug(result, "GET_RESULT");
    return result;
  }
  const msg = { code: res.status, success: false, msg: res.statusText };
  logger.error(msg);
  return msg;
};

/** 客户端 POST 请求 */
const post = async <T>(
  urlName: string,
  opts?: ClientPostParams,
): Promise<ResultModel<T>> => {
  const url = getBaseUrl(urlName);
  const data = opts?.data ?? {};
  let body: string | FormData;
  const proxyHeaders = new Headers(opts?.headers);
  if (!(data instanceof FormData)) {
    body = JSON.stringify(data);
    proxyHeaders.set(CONTENT_TYPE_KEY, CONTENT_TYPE_MAP.applicationJson);
  } else {
    body = data;
  }
  logger.info({ url: url, headers: proxyHeaders }, "POST");
  const res = await fetch(url, {
    method: "POST",
    headers: proxyHeaders,
    body,
  });

  if (res.ok) {
    const headersMap = Object.fromEntries(res.headers.entries());
    const result = { ...(await res.json()), headers: headersMap };
    logger.debug(result, "POST_RESULT");
    return result;
  }
  const msg = { code: res.status, success: false, msg: res.statusText };
  logger.error(msg);
  return msg;
};

/** GET 请求快捷方法（自动解包 data） */
export const iGet = async <T>(
  url: string,
  opts?: ClientGetParams,
): Promise<T | undefined> => {
  const res = await get<T>(url, opts);
  if (res.success) {
    return res.data as T;
  }
  if (opts?.showError) {
    opts.showError(res.msg ?? "Get request error!");
    return;
  }
  throw Error(res.msg ?? "Get request error!");
};

/** POST 请求快捷方法（自动解包 data） */
export const iPost = async <T>(
  url: string,
  opts?: ClientPostParams,
): Promise<T | undefined> => {
  const res = await post<T>(url, opts);
  if (res.success) {
    return res.data;
  }
  if (opts?.showError) {
    opts.showError(res.msg ?? "Post request error!");
    return;
  }
  throw Error(res.msg ?? "Post request error!");
};

/** POST 请求，返回 boolean */
export const iPostSuccess = async (
  url: string,
  opts?: ClientPostParams,
): Promise<boolean> => {
  const res = await post(url, opts);
  if (res.success) {
    if (opts?.showSuccess) opts.showSuccess(res.msg ?? "SUCCESS");
    return true;
  }
  if (opts?.showError) opts.showError(res.msg ?? "Post request error!");
  return false;
};
