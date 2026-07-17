import { iPost } from "@rock.chen/icms-http-client"
import { Member } from "./types/site"

export class ICMSClient {
    
    constructor() {
    }
    async submitComment() {

    }
    async login({ username, password }: Readonly<{ username: string, password: string }>):Promise<void> {
        await iPost<Member>('login', {
            data: {
                username,
                password
            }
        })
    }
}