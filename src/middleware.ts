import { ICookies, IStorage, ServerHttpOptsMin, setServerHttpCookies, setServerHttpHeaders } from "iboot-http-client"

export const handleMiddleware = ({
    cookies,
    storage,
    values
}: Readonly<{
    cookies: ICookies,
    storage: IStorage,
    values: ServerHttpOptsMin
}>) => {
    setServerHttpHeaders(storage, values);
    setServerHttpCookies(cookies, values)
}