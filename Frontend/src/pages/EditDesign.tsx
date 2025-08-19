import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/utils";
import { DesignEditor } from "@/components/design-editor/DesignEditor";

const EditDesign = () => {
  const { id } = useParams();
  const [initialJson, setInitialJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/designs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setInitialJson(data.design ? data.design.jsonData : data.jsonData))
      .catch(() => setError("Failed to load design"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* Header - Mobile Responsive */}
      <div className="p-3 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
          <button
            onClick={() => window.location.href = "/my-designs"}
            className="px-3 lg:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base self-start sm:self-auto"
          >
            ← Back to My Designs
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Edit Design
          </h1>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => navigate("/canvas")}
            className="px-3 lg:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base"
          >
            🎨 New Design
          </button>
          <div className="w-2 lg:w-3 h-2 lg:h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs lg:text-sm text-gray-600">Editing Mode</span>
        </div>
      </div>
      <DesignEditor initialJson={initialJson} designId={id} />
    </div>
  );
};

export default EditDesign;
