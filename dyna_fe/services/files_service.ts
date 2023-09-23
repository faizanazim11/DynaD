import HttpLayer from "@/utils/http_layer";
import Config from "@/config";

export default class FilesService {

    http_layer?: HttpLayer;
    constructor() {
        this.http_layer = new HttpLayer();
    }

    public async get_listing(path?: string): Promise<Array<any>> {
        return await this.http_layer?.get_data(Config.listing, path ? { path: path } : {}).then((response) => {
            if (response.status === 200) {
                return response.data;
            }
        }).catch((error) => {
            console.log(error);
            return [];
        });
    }
}