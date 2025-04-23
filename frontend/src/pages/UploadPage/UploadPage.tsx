import UploadPageUploader from "./UploadPageUploader"

export default function UploadPage() {
    return (
        //<div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center overflow-hidden">
        <div className="h-screen h-full flex justify-center items-center bg-[#1c1f29] m-0 p-0 ">
            <div className="bg-slate-200/10 backdrop-blur-md border border-slate-100/20 rounded-2xl shadow-xl p-6">
                <div className="w-full max-w-3xl px-4 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold flex items-center justify-center gap-2 text-lime-400">
                            <span role="img" aria-label="headphones">🎧</span>
                            Skibidi Captioner
                        </h1>
                        <p className="mt-2 text-cyan-300 text-sm">
                            上传你的音频或视频文件，我们将自动提取音频并生成字幕。
                        </p>
                        <p className="mt-2 text-gray-100 text-sm">
                            支持audio/* video/mp4,video/mkv,video/quicktime
                        </p>
                    </div>
                    <UploadPageUploader/>
                </div>
            </div>
        </div>
    )
}