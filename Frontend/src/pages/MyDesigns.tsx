import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";

interface Design {
  _id: string;
  title: string;
  createdAt: string;
  thumbnailUrl?: string;
}

const MyDesigns = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Design | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadDesigns = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/designs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const designs = Array.isArray(data)
          ? data
          : (Array.isArray(data.designs) ? data.designs : []);
        console.log("Loaded designs:", designs);
        console.log("First design thumbnailUrl:", designs[0]?.thumbnailUrl);
        setDesigns(designs);
      } else {
        setError("Failed to load designs");
      }
    } catch (err) {
      setError("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  const handleDelete = async (designId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/designs/${designId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Remove from local state
        setDesigns(prev => prev.filter(d => d._id !== designId));
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete design");
      }
    } catch (err) {
      alert("Error deleting design");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* Header - Mobile Responsive */}
      <div className="p-3 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
          <button
            onClick={() => window.location.href = "/"}
            className="px-3 lg:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base self-start sm:self-auto"
          >
            ← Back to Editor
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My Designs
          </h1>
        </div>
        <button
          onClick={loadDesigns}
          className="px-4 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <button
          onClick={() => window.location.href = "/canvas"}
          className="px-4 lg:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm lg:text-base self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Design
        </button>
      </div>
      
      {/* Content - Mobile Responsive */}
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {designs.length === 0 ? (
          <div className="text-center py-8 lg:py-16">
            <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">No designs found</h3>
            <p className="text-gray-500 text-sm lg:text-base">Start creating your first design in the editor!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {designs.map(design => (
              <div key={design._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                <div
                  className="w-full h-32 sm:h-40 lg:h-48 cursor-pointer group relative overflow-hidden"
                  onClick={() => setPreview(design)}
                >
                  {design.thumbnailUrl ? (
                    <img 
                      src={design.thumbnailUrl} 
                      alt={design.title} 
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                      Click to preview
                    </span>
                  </div>
                </div>
                <div className="p-3 lg:p-4">
                  <h3 className="font-semibold text-base lg:text-lg mb-2 text-gray-800 line-clamp-1">{design.title}</h3>
                  <p className="text-gray-500 text-xs mb-3 lg:mb-4">{new Date(design.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      className="flex-1 px-3 lg:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-xs lg:text-sm font-medium shadow-md hover:shadow-lg"
                      onClick={() => window.location.href = `/edit/${design._id}`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="px-3 lg:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs lg:text-sm font-medium shadow-md hover:shadow-lg"
                      onClick={() => setDeleteConfirm(design._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!preview} onOpenChange={open => !open && setPreview(null)}>
        {preview && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full flex flex-col items-center">
              {preview.thumbnailUrl ? (
                <img src={preview.thumbnailUrl} alt={preview.title} className="w-full h-96 object-contain rounded mb-4" />
              ) : (
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded mb-4 text-gray-400">No Preview</div>
              )}
              <div className="font-semibold text-xl mb-2">{preview.title}</div>
              <div className="text-gray-500 text-xs mb-4">{new Date(preview.createdAt).toLocaleString()}</div>
              <button
                className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
                onClick={() => {
                  setPreview(null);
                  window.location.href = `/edit/${preview._id}`;
                }}
              >
                Edit This Design
              </button>
              <button
                className="mt-2 text-gray-500 hover:text-gray-700 text-xs underline"
                onClick={() => setPreview(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Design</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this design? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDesigns;
