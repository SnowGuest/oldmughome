import { request } from "@/utils/request"
import type { User } from "./user";

export interface FileBody {
    FileId: string;
    FileOriginName: string;
    UploadDateTime: string;
    UploadUserId: User["id"];
    UploadFileSize: number;
    UploadFileUrl: string;
}

/**
 * @POST 上传文件
 * @param file File
 * */
export function uploaderFile(file: File) {
    const fd = new FormData()
    fd.append("file", file)
    return request<FileBody>("/upload/file", {
        method: "POST",
        data: fd,
    }, {
        "FetchError": "上传失败"
    });
}
