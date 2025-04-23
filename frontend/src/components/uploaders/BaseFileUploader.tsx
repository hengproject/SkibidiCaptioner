import React, { useRef, useState } from "react"
import type { FC } from "react"

interface BaseFileUploaderProps {
    width?: string
    padding?: string
    accept?: string
    onFileSelect?: (file: File) => void
    children?: React.ReactNode // ✅ 允许外部插入预览组件
}

const BaseFileUploader: FC<BaseFileUploaderProps> = ({
                                                         width = "w-3xs",
                                                         padding = "p-6",
                                                         accept = "*/*",
                                                         onFileSelect,
                                                         children
                                                     }) => {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleFile = (file: File) => {
        onFileSelect?.(file)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    return (
        <div className={`${width} mx-auto mt-6`}>
            <div
                className={`cursor-pointer border-2 border-dashed rounded-xl text-center transition ${padding} ${
                    isDragging ? "bg-blue-200 border-blue-500" : "bg-blue-50 border-blue-200"
                } w-3xs`}
                onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept={accept}
                    className="hidden"
                />
                <p className="text-gray-700">
                    {isDragging ? "释放文件到此上传" : "点击或拖动文件上传"}
                </p>

                {children && <div className="mt-4">{children}</div>}
            </div>
        </div>
    )
}

export default BaseFileUploader
