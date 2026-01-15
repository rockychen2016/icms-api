import { cleanToken, getServerHttpOpts, getToken, HttpClient, HttpToken, ICookies, IStorage, ResultModel, setToken, urlParamToJson, USER_TYPE_MAP } from "iboot-http-client";
import { FrameworkAdapter, RequestContext, ResponseContext } from "./types/router";
export enum API {
    login,
    logout,
    submitComment
}
export const APIMAP: Record<string, string> = {
    "unknown": ""
}
export class ICMSRouter {
    private http: HttpClient;
    private cookies: ICookies;
    private adapter: FrameworkAdapter
    constructor(
        adapter: FrameworkAdapter,
        storage: IStorage,
        cookies: ICookies
    ) {
        const httpOpts = getServerHttpOpts(storage);
        this.http = new HttpClient({ ...httpOpts, userType: USER_TYPE_MAP.TYPE_C })
        this.cookies = cookies;
        this.adapter = adapter;
    }

    async handleRequest(rawRequest: any): Promise<any> {
        try {
            // 解析请求
            const request = await this.adapter.parseRequest(rawRequest);
            // 处理请求
            const responseContext = await this.processRequest(request);
            // 转换为框架响应
            return this.adapter.createResponse(responseContext);
        } catch (error) {
            console.error('Router error:', error);
            const errorResponse: ResponseContext = {
                status: 500,
                headers: { 'content-type': 'application/json' },
                cookies: {},
                body: {
                    code: 500,
                    success: false,
                    message: 'Internal server error'
                }
            };
            return this.adapter.createResponse(errorResponse);
        }
    }
    private async processRequest(request: RequestContext): Promise<ResponseContext> {
        const searchParams = request.url.searchParams
        const m = searchParams.get('m') ?? 'unknown';
        const url = APIMAP[m];

        if (!url || url.length === 0) {
            return this.createErrorResponse(404, 'API not found');
        }
        let token: HttpToken | undefined;

        // 检查权限
        if (url.startsWith("admin/") || url.startsWith("api/")) {
            token = getToken(this.cookies)
            if (!token || token.username.length === 0 || token.token.length === 0) {
                return this.createErrorResponse(409, 'Authentication required');
            }
        }

        let result: ResultModel<any>;
        const method = request.method;
        try {
            if (method === 'GET') {
                const params = urlParamToJson(searchParams.toString(), ['m']);
                result = await this.http.get({
                    url,
                    data: params,
                    token
                });
            } else if (method === 'POST') {
                const contentType = request.headers['content-type'] || '';
                if (contentType.includes('application/json')) {
                    const data = request.body;
                    result = await this.http.post({
                        url,
                        data,
                        token
                    });
                } else if (contentType.includes('multipart/form-data')) {
                    if (!request.formData) {
                        return this.createErrorResponse(411, 'Invalid form data');
                    }
                    // 处理表单数据
                    const formData = request.formData;
                    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/);
                    if (!boundaryMatch) {
                        return this.createErrorResponse(411, 'Missing boundary in form data');
                    }
                    const boundary = boundaryMatch[1];
                    const data: Record<string, any> = { boundary };
                    // 复制表单字段
                    for (const [key, value] of Object.entries(formData)) {
                        if (key !== 'file') {
                            data[key] = value;
                        }
                    }
                    result = await this.http.post({
                        url,
                        data,
                        token
                    });
                } else {
                    return this.createErrorResponse(410, 'Unsupported content type');
                }
            } else {
                return this.createErrorResponse(405, 'Method not allowed');
            }
        } catch (error) {
            console.error('API request error:', error);
            return this.createErrorResponse(500, 'API request failed');
        }

        // 创建响应
        const response: ResponseContext = {
            status: result.success ? 200 : result.code,
            headers: { 'content-type': 'application/json' },
            cookies: {},
            body: result
        };

        if (result.success) {
            switch (url) {
                case APIMAP[API[API.login]]:
                    const data = result.data;
                    setToken(data, this.cookies);
                    break;
                case APIMAP[API[API.logout]]:
                    cleanToken(this.cookies);
                    break;
            }
        }
        return response;
    }

    private createErrorResponse(code: number, message: string): ResponseContext {
        return {
            status: code,
            headers: { 'content-type': 'application/json' },
            cookies: {},
            body: {
                code,
                success: false,
                message
            }
        };
    }
}