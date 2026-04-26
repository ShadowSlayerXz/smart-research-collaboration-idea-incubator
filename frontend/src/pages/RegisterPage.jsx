import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', department: '', bio: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Required'),
      department: Yup.string(),
      bio: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(values);
        toast.success('Account created!');
        navigate('/home');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: 'password' },
            { name: 'department', label: 'Department (optional)', type: 'text' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type} name={name}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values[name]}
              />
              {formik.touched[name] && formik.errors[name] && (
                <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
            <textarea
              name="bio" rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.bio}
            />
          </div>
          <button
            type="submit" disabled={formik.isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
