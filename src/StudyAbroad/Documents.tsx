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
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const documentTypes = ['all', 'official', 'reference', 'essay', 'test', 'identity', 'financial'];
  const statusTypes = ['all', 'completed', 'in-progress', 'pending'];

  const getDocumentStats = () => {
    return {
      total: documents.length,
      completed: documents.filter(d => d.status === 'completed').length,
      'in-progress': documents.filter(d => d.status === 'in-progress').length,
      pending: documents.filter(d => d.status === 'pending').length,
    };
  };

  const stats = getDocumentStats();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              My Documents
            </h3>
            <p className="text-gray-600">
              Manage and track your application documents
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4 rounded-xl">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">Total Documents</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-amber-600">{stats['in-progress']}</div>
            <div className="text-sm text-amber-600">In Progress</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {statusTypes.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {doc.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                  <div className="flex items-center space-x-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      <span className="ml-1">{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {doc.format} • {doc.fileSize}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Details */}
            <div className="space-y-2 mb-4">
              {doc.score && (
                <div className="text-sm text-violet-600 font-medium bg-violet-50 px-3 py-1 rounded-lg">
                  {doc.score}
                </div>
              )}
              {doc.universities && (
                <div className="text-sm text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-lg">
                  {doc.universities}
                </div>
              )}
              {doc.count && (
                <div className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                  {doc.count}
                </div>
              )}
              {doc.required && (
                <div className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded-lg">
                  {doc.required}
                </div>
              )}
              {doc.expires && (
                <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg">
                  {doc.expires}
                </div>
              )}
            </div>

            {/* Upload Date */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors font-medium">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter criteria to find more documents.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setFilterType("all");
            }}
            className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Documents;