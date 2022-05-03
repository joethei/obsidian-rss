import "isomorphic-fetch";
import "fs";
import * as fs from "fs";
import * as path from "path";

export interface RequestParam {
    url: string;
    method?: string;
    contentType?: string;
    body?: string;
    headers?: Record<string, string>;
}

export async function request(request: RequestParam) : Promise<string> {
    if(!request.url.startsWith("http")) {
        const filePath = path.join(__dirname, request.url);
        return fs.readFileSync(filePath, 'utf-8');
    }

    const result = await fetch(request.url,{
        headers: request.headers,
        method: request.method,
        body: request.body
    });
    return result.text();
}
