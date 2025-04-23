import { FC, useEffect, useState } from "react"

interface FilePreviewBoxProps {
    file: File
    onRemove?: () => void
}

const FilePreviewBox: FC<FilePreviewBoxProps> = ({ file, onRemove }) => {
    const [previewURL, setPreviewURL] = useState("")

    useEffect(() => {
        const url = URL.createObjectURL(file)
        setPreviewURL(url)
        return () => URL.revokeObjectURL(url)
    }, [file])

    const renderPreview = () => {
        if (file.type.startsWith("image/")) {
            return <img src={previewURL} className="w-20 h-20 object-cover rounded" />
        }

        if (file.type.startsWith("video/")) {
            return (
                <video
                    src={previewURL}
                    className="w-24 h-20 object-cover rounded"
                    muted
                    controls
                />
            )
        }

        if (file.type.startsWith("audio/")) {
            return (
                <audio controls className="w-full">
                    <source src={previewURL} type={file.type} />
                </audio>
            )
        }

        return <p className="text-sm text-gray-500">无法预览此文件类型</p>
    }

    return (
        <div className="bg-white p-3 rounded-lg shadow flex items-center gap-4">
            <div>{renderPreview()}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
                >
                    ×
                </button>
            )}
        </div>
    )
}

export default FilePreviewBox
