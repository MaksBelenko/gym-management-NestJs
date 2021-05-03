export class RequestBuilder {
    private baseUrl: string;
    private path: string;
    private queries: Record<string, string>;

    withBaseUrl(baseUrl: string) {
        this.baseUrl = baseUrl;
        return this;
    }

    withPath(path: string) {
        this.path = path;
        return this;
    }

    withQueryParam(name: string, value: string) {
        this.queries[name] = value;
        return this;
    }

    build(): string {
        // let url = this.baseUrl ? `${baseUrl}:${serverPort}`
        return ''
    }
}