import React, { useState, useEffect } from "react";
import { FaUpload, FaFile, FaTrash, FaDownload } from "react-icons/fa";

export default function DashboardDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load documents:", err);
      setLoading(false);
    }
  };

  const [docType, setDocType] = useState("Aadhaar Card");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentName: file.name,
          documentType: docType,
          fileUrl: URL.createObjectURL(file), // In production, upload to cloud storage
        }),
      });

      if (res.ok) {
        await loadDocuments();
        alert("Document uploaded successfully!");
      } else {
        alert("Failed to upload document.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await loadDocuments();
        alert("Document deleted successfully!");
      } else {
        alert("Failed to delete document.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred.");
    }
  };

  const documentTypes = [
    "Aadhaar Card",
    "PAN Card",
    "Income Certificate",
    "Caste Certificate",
    "Birth Certificate",
    "Educational Certificate",
    "Bank Statement",
    "Passport Photo",
    "Other",
  ];

  if (loading) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Document Management</h2>
        <label className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer flex items-center gap-2">
          <FaUpload />
          {uploading ? "Uploading..." : "Upload Document"}
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Upload New Document</h3>
        <div className="flex gap-4">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="flex-1 bg-gray-50 p-3 rounded-xl border outline-none"
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition cursor-pointer flex items-center gap-2">
            <FaUpload />
            Choose File
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Your Documents</h3>
        </div>

        {documents.length > 0 ? (
          <div className="divide-y">
            {documents.map((doc) => (
              <div
                key={doc._id || doc.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <FaFile className="text-blue-600 text-2xl" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{doc.documentName}</h4>
                    <p className="text-sm text-gray-600">
                      Type: {doc.documentType} | Uploaded:{" "}
                      {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Download"
                    >
                      <FaDownload />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(doc._id || doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <FaFile className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>No documents uploaded yet.</p>
            <p className="text-sm mt-2">Upload documents to speed up your applications.</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 p-6 rounded-2xl border border-blue-200">
        <h4 className="font-semibold text-gray-800 mb-2">Document Tips</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc ml-5">
          <li>Keep your documents up to date for faster processing</li>
          <li>Upload clear, readable copies of all documents</li>
          <li>Ensure file size is under 5MB for faster uploads</li>
          <li>Accepted formats: PDF, JPG, PNG</li>
        </ul>
      </div>
    </div>
  );
}

