export default class Config {
    public static BASE_API = process.env['BASE_URL'] || "http://localhost:8080";
    public static files_base = this.BASE_API + "/files";
    public static listing = this.files_base + "/list";
    public static download = this.files_base + "/download";
}