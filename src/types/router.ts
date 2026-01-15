
export interface RequestContext {
    url: URL;
    headers: Record<string, string>;
    body?: any;
    formData?: FormData;
    cookies?: Record<string, string>;
    [key: string]: any;
}
export interface ResponseContext {
    status: number;
    headers: Record<string, string>;
    cookies: Record<string, { value: string; options?: any }>;
    body: any;
}
export interface FrameworkAdapter {
    parseRequest(request: any): Promise<RequestContext>;
    createResponse(context: ResponseContext): any;
    setCookie(response: ResponseContext, name: string, value: string, options?: any): void;
}