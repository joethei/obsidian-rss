import fetch from "node-fetch";


export interface RequestParam {
    /** @public */
    url: string;
    /** @public */
    method?: string;
    /** @public */
    contentType?: string;
    /** @public */
    body?: string;
    /** @public */
    headers?: Record<string, string>;
}

export async function request(request: RequestParam) : Promise<string> {
    const result = await fetch(request.url,{
        headers: request.headers,
        method: request.method,
        body: request.body
    });
    return result.text();
}
