import { AxiosInstance } from './../node_modules/axios/index.d';
import axios from 'axios';
import Config from '@/config.ts';

export default class HttpLayer {
    public axios_instance: AxiosInstance = axios.create({
        baseURL: Config.BASE_API,
        timeout: 1000,
    });

    public async get_data(url: string, queryParams: any = {}, headers: any = {}, cookies: any = {}, body: any = {}): Promise<any> {
        return await this.axios_instance.get(url, {
            params: queryParams,
            headers: headers,
            data: body,
        });
    }
}