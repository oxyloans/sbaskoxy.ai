import { useState, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, AlertCircle, Check, Info, X, FileArchive, ArrowLeft } from 'lucide-react';

// Define a type for our file objects
interface FileObject {
    name: string;
    size: number;
    type: string;
}

export default function ApplicationUpload() {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [sopText, setSopText] = useState<string>('');
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [wordCount, setWordCount] = useState<number>(0);
    const [activeSection, setActiveSection] = useState<'documents' | 'statement'>('documents');

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleSopChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setSopText(text);
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setWordCount(words);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
        if (fileType.includes('image')) return <FileText className="h-5 w-5 text-green-500" />;
        if (fileType.includes('zip') || fileType.includes('archive')) return <FileArchive className="h-5 w-5 text-amber-500" />;
        return <FileText className="h-5 w-5 text-blue-500" />;
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-md">
            {/* Top Back Button */}
            <div className="flex items-center space-x-3 mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center group transition-all"
                >
                    <div className="bg-purple-600 text-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-all duration-200">
                        <ArrowLeft size={18} />
                    </div>
                </button>
                <h3 className="text-xl mt-2 font-bold text-purple-600">
                    Application Documents
                </h3>
            </div>

            <div className="mb-6">
                {/* Simplified Navigation Tabs */}
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <button
                        onClick={() => setActiveSection('documents')}
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition ${activeSection === 'documents'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        <span>Upload Documents</span>
                    </button>
                    <button
                        onClick={() => setActiveSection('statement')}
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition ${activeSection === 'statement'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        <span>Statement of Purpose</span>
                    </button>
                </div>

                {activeSection === 'documents' && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h2 className="text-lg font-medium text-gray-800 mb-2">Required Documents</h2>
                            <p className="text-gray-600 mb-3 text-sm">
                                Please upload the following documents:
                            </p>
                            <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-1 text-sm">
                                <li>Valid passport copy (all pages)</li>
                                <li>Academic mark sheets and certificates</li>
                                <li>ID proof (Aadhar card, etc.)</li>
                                <li>Passport size photograph</li>
                                <li>English proficiency test scores</li>
                            </ul>

                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="mx-auto h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <p className="text-gray-600 mb-2 text-sm">Drag and drop your files here, or</p>
                                <label className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 transition">
                                    Browse Files
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="mt-2 text-xs text-gray-500">Supports: PDF, JPG, PNG, DOCX (Max 10MB each)</p>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <Check className="h-4 w-4 text-green-500 mr-2" />
                                    <span>{files.length} Document{files.length !== 1 ? 's' : ''} Uploaded</span>
                                </h3>
                                <ul className="space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100">
                                            <div className="flex items-center">
                                                {getFileIcon(file.type)}
                                                <div className="ml-2">
                                                    <p className="font-medium text-gray-700 text-sm break-all">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-gray-400 hover:text-red-500 p-1 rounded transition"
                                                aria-label="Remove file"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="p-3 bg-amber-50 rounded-md flex items-start border border-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700">
                                All documents will undergo an internal review process before being forwarded to universities. Please ensure all uploads are clear and legible.
                            </p>
                        </div>
                    </div>
                )}

                {activeSection === 'statement' && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">Statement of Purpose</h2>
                        <p className="text-gray-600 mb-3 text-sm">
                            Write a statement (60-100 words) explaining your motivation for this course,
                            academic background, career goals, and why you're a good candidate.
                        </p>

                        <div className="mt-2">
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-48 transition text-sm"
                                placeholder="Begin your Statement of Purpose here..."
                                value={sopText}
                                onChange={handleSopChange}
                            ></textarea>

                            <div className="mt-2 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="h-2 w-20 bg-gray-200 rounded-full">
                                        <div className={`h-2 rounded-full ${wordCount < 60 ? 'bg-amber-500' :
                                            wordCount <= 60 ? 'bg-green-500' : 'bg-red-500'
                                            }`} style={{ width: `${Math.min(100, (wordCount / 60) * 100)}%` }}></div>
                                    </div>

                                    <span className={`ml-2 text-xs font-medium ${wordCount < 60 ? 'text-amber-600' :
                                        wordCount <= 60 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {wordCount} words
                                    </span>
                                </div>

                                <div className="text-xs">
                                    {wordCount < 60 && <span className="text-amber-600">Need {60 - wordCount} more words</span>}
                                    {wordCount > 100 && <span className="text-red-600">Exceeds by {wordCount - 100} words</span>}
                                    {wordCount >= 60 && wordCount <= 100 && (
                                        <span className="text-green-600">Perfect length</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-4 gap-3">
                <button
                    className={`px-4 py-2 bg-purple-600 text-white rounded-md transition text-sm ${((activeSection === 'documents' && files.length === 0) ||
                        (activeSection === 'statement' && (wordCount < 60 || wordCount > 100)))
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-purple-700'
                        }`}
                    disabled={(activeSection === 'documents' && files.length === 0) ||
                        (activeSection === 'statement' && (wordCount < 60 || wordCount > 100))}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}