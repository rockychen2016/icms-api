import { getLoginUser, ICookies, iPost } from "@rock.chen/icms-http-client"
import { Member } from "./types/site"

export class ICMSClient {
    private cookies: ICookies | null = null
    constructor() {
    }
    async submitComment() {

    }
    setICookies(c: ICookies): ICMSClient {
        this.cookies = c;
        return this;
    }
    async login({ username, password }: Readonly<{ username: string, password: string }>): Promise<Member | undefined> {
        await iPost('login', {
            data: {
                username,
                password
            }
        })
        if(this.cookies){
            return getLoginUser(this.cookies)
        }
        return undefined
    }
    
}