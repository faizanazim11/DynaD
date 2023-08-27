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

    public async download_file(path: string, defaultName: string) {
        await this.http_layer?.get_data(Config.download, { path: path }, { responseType: 'blob' }).then((response) => {
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                const contentDisposition = response.headers['content-disposition'];
                let filename = defaultName;
                if (contentDisposition) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(contentDisposition);
                    if (matches?.[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        }).catch((error) => {
            console.log(error);
        });
    }
}