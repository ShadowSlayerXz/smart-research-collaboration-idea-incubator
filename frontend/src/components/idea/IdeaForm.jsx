import { useFormik } from 'formik';
import * as Yup from 'yup';

const CATEGORIES = ['Tech', 'Business', 'Social', 'Science', 'Art', 'Other'];
const STATUSES = ['open', 'in-progress', 'completed'];

export default function IdeaForm({ initialValues, onSubmit, showStatus = false, submitLabel = 'Submit' }) {
  const formik = useFormik({
    initialValues: initialValues || {
      title: '', description: '', category: 'Tech', tags: '', status: 'open',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      category: Yup.string().required('Category is required'),
      tags: Yup.string(),
      status: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await onSubmit(payload, setSubmitting);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          name="title" type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description" rows={5}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="category"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.category}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
        <input
          name="tags" type="text" placeholder="e.g. agriculture, mobile, social"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.tags}
        />
      </div>

      {showStatus && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.status}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <button
        type="submit" disabled={formik.isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {formik.isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
