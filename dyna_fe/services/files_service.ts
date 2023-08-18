import HttpLayer from "@/utils/http_layer";
import Config from "@/config";
import * as React from "react";

export default class FilesService {

    http_layer?: HttpLayer;

    constructor() {
        this.http_layer = new HttpLayer();
    }

    public async get_listing(path?: string): Promise<Array<any>> {
        return await this.http_layer?.get_data(Config.listing, path ? {path: path} : {}).then((response) => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.data);
                return response.data;
            }
        }).catch((error) => {
            console.log(error);
            return [];
        });
    }
}