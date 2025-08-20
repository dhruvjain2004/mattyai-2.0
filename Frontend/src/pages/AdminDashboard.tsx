import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/utils";

type User = { id: string; _id?: string; username: string; email: string; role: "user" | "admin" };
type Design = { _id: string; title?: string; userId: string; updatedAt: string; isPublic?: boolean };

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "designs">("users");

  const token = localStorage.getItem("token") || "";

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, d] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/admin/designs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const uj = await u.json();
      const dj = await d.json();
      setUsers((uj.users || uj.data || []).map((x: any) => ({ id: x._id || x.id, username: x.username, email: x.email, role: x.role })));
      setDesigns(dj.designs || dj.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateRole = async (userId: string, role: "user" | "admin") => {
    await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    await fetchAll();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Delete user and all their designs?")) return;
    await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchAll();
  };

  const deleteDesign = async (id: string) => {
    if (!confirm("Delete this design?")) return;
    await fetch(`${API_BASE_URL}/admin/designs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchAll();
  };

  const togglePublic = async (id: string, isPublic: boolean) => {
    await fetch(`${API_BASE_URL}/admin/designs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isPublic: !isPublic }),
    });
    await fetchAll();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Panel</h1>
          <div className="space-x-2">
            <button className={`px-3 py-2 rounded ${tab === "users" ? "bg-blue-600 text-white" : "bg-white"}`} onClick={() => setTab("users")}>Users</button>
            <button className={`px-3 py-2 rounded ${tab === "designs" ? "bg-blue-600 text-white" : "bg-white"}`} onClick={() => setTab("designs")}>Designs</button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : tab === "users" ? (
          <div className="bg-white rounded-xl shadow divide-y">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.username}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value as "user" | "admin")}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => deleteUser(u.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow divide-y">
            {designs.map((d) => (
              <div key={d._id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{d.title || "Untitled"}</div>
                  <div className="text-sm text-gray-600">Updated {new Date(d.updatedAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => togglePublic(d._id, !!d.isPublic)}>
                    {d.isPublic ? "Make Private" : "Make Public"}
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => deleteDesign(d._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


