import { useState } from "react"
import AudioVideoUploader from '../../components/uploaders/AudioVideoUploader.tsx'
import FilePreviewBox from "../../components/preview/FilePreviewBox"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const UploadPageUploader = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadResult, setUploadResult] = useState<string | null>(null)

    const handleValidFile = async (file: File) => {
        setSelectedFile(file)
        setUploadResult(null)
        setIsUploading(true)
        console.log("Uploading to:", `${API_URL}/api/upload`)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch(`${API_URL}/api/upload`, {
                method: "POST",
                body: formData,
                mode: 'cors'
            })

            const json = await res.json()
            setUploadResult(json.audio || "✅ 上传成功")
        } catch (err) {
            console.error("上传失败：", err)
            setUploadResult("❌ 上传失败")
        } finally {
            setIsUploading(false)
        }
    }

    const clear = () => {
        setSelectedFile(null)
        setUploadResult(null)
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* 发光背景球 */}
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#00f9e2] rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute top-[100px] right-[-120px] w-[300px] h-[300px] bg-[#c180ff] rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute top-[-70px] right-[-80px] w-[300px] h-[300px] bg-[#cced24] rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-[-150px] left-[20%] w-[400px] h-[400px] bg-[#ff4081] rounded-full blur-3xl opacity-30 pointer-events-none"></div>

            <AudioVideoUploader onValidFile={handleValidFile}>
                {
                    selectedFile && (<FilePreviewBox file={selectedFile} onRemove={clear} />)
                }
            </AudioVideoUploader>

            {isUploading && (
                <p className="text-blue-500 mt-4 text-center">正在上传...</p>
            )}
            {uploadResult && (
                <p className="text-green-600 mt-4 text-center">{uploadResult}</p>
            )}
        </div>
    )
}

export default UploadPageUploader
