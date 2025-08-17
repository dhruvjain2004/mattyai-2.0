import { DesignEditor as CanvasEditor } from "@/components/design-editor/DesignEditor";

const DesignEditor = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
      {/* Header */}
      <div className="p-3 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
          <button
            onClick={() => window.location.href = "/"}
            className="px-3 lg:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base self-start sm:self-auto"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Design Editor
          </h1>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="w-2 lg:w-3 h-2 lg:h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs lg:text-sm text-gray-600">Ready to Create</span>
        </div>
      </div>
      
      {/* Canvas Editor */}
      <div className="h-[calc(100vh-120px)]">
        <CanvasEditor />
      </div>
    </div>
  );
};

export default DesignEditor;
