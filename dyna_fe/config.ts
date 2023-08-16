export default class Config {
    public static BASE_API = process.env['BASE_URL'] || "http://192.168.0.113:8080";
    public static files_base = this.BASE_API + "/files";
    public static listing = this.files_base + "/list";
}