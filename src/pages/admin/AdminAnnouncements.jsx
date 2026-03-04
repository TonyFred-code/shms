import { useState } from "react";
import { Plus, Megaphone, Edit2, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { bool, func, shape, string } from "prop-types";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

function AnnouncementForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    content: initial.content || "",
    priority: initial.priority || "medium",
  });
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input"
          placeholder="Announcement title"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="input min-h-30"
          placeholder="Full announcement text..."
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Priority</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="input"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial.id ? "Save Changes" : "Publish"}
        </Button>
      </div>
    </form>
  );
}

AnnouncementForm.propTypes = {
  initial: shape({
    title: string,
    content: string,
    priority: string,
  }),
  onSubmit: func,
  onCancel: func,
  loading: bool,
};

export default function AdminAnnouncements() {
  const { user } = useAuth();
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useData();
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleAdd = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // faked delay
    addAnnouncement({ ...data, authorId: user.id });
    setLoading(false);
    setAddModal(false);
    setAlert({ type: "success", msg: "Announcement published." });
  };

  const handleEdit = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateAnnouncement(editItem.id, data);
    setLoading(false);
    setEditItem(null);
    setAlert({ type: "success", msg: "Announcement updated." });
  };

  const handleDelete = () => {
    deleteAnnouncement(deleteId);
    setDeleteId(null);
    setAlert({ type: "success", msg: "Announcement deleted." });
  };

  const priorityVariant = { high: "danger", medium: "warning", low: "default" };

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle={`${announcements.length} announcements published`}
        actions={
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> New Announcement
          </Button>
        }
      />

      {alert && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.msg}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="card text-center py-16">
          <Megaphone size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-display text-xl text-gray-600">
            No announcements yet
          </p>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            Publish notices visible to all students.
          </p>
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> Create First Announcement
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800">{a.title}</p>
                    <Badge variant={priorityVariant[a.priority]}>
                      {a.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {a.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Published: {a.date}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setEditItem(a)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(a.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="New Announcement"
      >
        <AnnouncementForm
          onSubmit={handleAdd}
          onCancel={() => setAddModal(false)}
          loading={loading}
        />
      </Modal>
      <Modal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        title="Edit Announcement"
      >
        {editItem && (
          <AnnouncementForm
            initial={editItem}
            onSubmit={handleEdit}
            onCancel={() => setEditItem(null)}
            loading={loading}
          />
        )}
      </Modal>
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Announcement"
      >
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete this announcement?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
