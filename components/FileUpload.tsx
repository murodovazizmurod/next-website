'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  onUpload: (file: File) => Promise<string>
  accept?: Record<string, string[]>
  maxSize?: number | undefined
  currentFile?: string
  onRemove?: () => void
}

export default function FileUpload({ 
  onUpload, 
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize,
  currentFile,
  onRemove
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    const file = acceptedFiles[0]
    setError(null)
    setUploading(true)

    try {
      await onUpload(file)
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const dropzoneConfig: any = {
    onDrop,
    accept,
    multiple: false,
  }
  
  if (maxSize !== undefined) {
    dropzoneConfig.maxSize = maxSize
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig)

  if (currentFile) {
    const isImage = currentFile.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    return (
      <div className="relative">
        <div className="border border-gray-200 rounded p-4">
          {isImage ? (
            <div className="mb-2">
              <img
                src={currentFile}
                alt="Uploaded"
                className="max-w-full h-48 object-cover rounded"
              />
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <span className="text-sm truncate flex-1">{currentFile}</span>
            {onRemove && (
              <button
                onClick={onRemove}
                className="ml-4 text-gray-500 hover:text-black transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={uploading} />
        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
        </p>
        {maxSize && (
          <p className="text-xs text-gray-400 mt-1">Max size: {maxSize / 1024 / 1024}MB</p>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}

