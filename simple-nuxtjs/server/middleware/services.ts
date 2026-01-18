
export default defineEventHandler((event) => {
    console.log('New request: ' + getRequestURL(event))
    // event.node.req.headers["Web-no"]="xxxx"
    // const req = readFormData(event)
    // console.log(req);
})