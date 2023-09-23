import Config from "@/config";

export default class FileUtils {
    public static get_href(path: string) {
        return Config.download + "?path=" + path;
    }
}