
// to resolve warning for .env when using import.meta.env
interface ImportMetaEnv {
    VITE_CLOUDINARY_UPLOAD_PRESET: any;
    VITE_CLOUDINARY_CLOUD_NAME: any;
    readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}