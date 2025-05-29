import React, { useState } from 'react';
import { FileText, Plus, Eye, Download, Search, Filter, Upload, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Sample documents data
  const documents = [
    {
      id: 1,
      name: "Academic Transcript",
      type: "Official Document",
      status: "completed",
      uploadDate: "2024-01-15",
      score: "GPA: 3.8/4.0",
      fileSize: "2.3 MB",
      format: "PDF"
    },
    {
      id: 2,
      name: "Letter of Recommendation",
      type: "Reference Letter",
      status: "in-progress",
      uploadDate: "2024-01-10",
      universities: "5 universities pending",
      fileSize: "1.1 MB",
      format: "PDF"
    },
    {
      id: 3,
      name: "Statement of Purpose",
      type: "Essay",
      status: "completed",
      uploadDate: "2024-01-08",
      count: "850 words",
      fileSize: "345 KB",
      format: "DOCX"
    },
    {
      id: 4,
      name: "TOEFL Score Report",
      type: "Test Score",
      status: "pending",
      uploadDate: "2024-01-05",
      required: "Score: 105/120",
      fileSize: "892 KB",
      format: "PDF"
    },
    {
      id: 5,
      name: "Passport Copy",
      type: "Identity Document",
      status: "completed",
      uploadDate: "2024-01-03",
      expires: "Expires: Dec 2030",
      fileSize: "1.8 MB",
      format: "PDF"
    },
    {
      id: 6,
      name: "Financial Statement",
      type: "Financial Document",
      status: "in-progress",
      uploadDate: "2024-01-01",
      universities: "Bank verification pending",
      fileSize: "2.1 MB",
      format: "PDF"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-amber-500';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const documentTypes = ['all', 'official', 'reference', 'essay', 'test', 'identity', 'financial'];
  const statusTypes = ['all', 'completed', 'in-progress', 'pending'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Documents
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track your application documents
              </p>
            </div>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Document</span>
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none bg-white min-w-[140px]"
                >
                  {statusTypes.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none bg-white min-w-[140px]"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">3</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">2</p>
                  <p className="text-sm text-amber-600">In Progress</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-700">1</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-700">6</p>
                  <p className="text-sm text-violet-600">Total Docs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-3 rounded-xl ${doc.status === "completed" ? "bg-green-100" : doc.status === "in-progress" ? "bg-amber-100" : "bg-gray-100"}`}>
                    {getStatusIcon(doc.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {doc.format} • {doc.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusDotColor(doc.status)}`}></div>
              </div>

              {/* Document Details */}
              <div className="space-y-2 mb-4">
                {doc.score && (
                  <p className="text-sm text-violet-600 font-medium bg-violet-50 px-3 py-1 rounded-lg">
                    {doc.score}
                  </p>
                )}
                {doc.universities && (
                  <p className="text-sm text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-lg">
                    {doc.universities}
                  </p>
                )}
                {doc.count && (
                  <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                    {doc.count}
                  </p>
                )}
                {doc.required && (
                  <p className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-lg">
                    {doc.required}
                  </p>
                )}
                {doc.expires && (
                  <p className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg">
                    {doc.expires}
                  </p>
                )}
              </div>

              {/* Upload Date */}
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </div>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
                  More Actions
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
            <button className="px-6 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;