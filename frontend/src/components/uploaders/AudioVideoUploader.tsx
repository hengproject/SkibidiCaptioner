import React from "react"
import type { FC } from "react"
import BaseFileUploader from "./BaseFileUploader"

interface AudioVideoUploaderProps {
    onValidFile: (file: File) => void
    width?: string
    padding?: string
    children?: React.ReactNode
}

const AudioVideoUploader: FC<AudioVideoUploaderProps> = ({
                                                             onValidFile,
                                                             width,
                                                             padding,
                                                             children
                                                         }) => {
    const handleFile = (file: File) => {
        const isValid =
            file.type.startsWith("audio/") || file.type.startsWith("video/")
        if (!isValid) {
            alert("❌ 只支持上传音频或视频文件")
            return
        }
        onValidFile(file)
    }

    return (
        <BaseFileUploader
            width={width}
            padding={padding}
            accept="audio/*,video/*"
            onFileSelect={handleFile}
        >
            {children}
        </BaseFileUploader>
    )
}

export default AudioVideoUploader
