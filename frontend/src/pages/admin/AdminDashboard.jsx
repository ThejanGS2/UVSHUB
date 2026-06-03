import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    grade: '',
    price: '',
    medium: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setStudents(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch students');
      }
    } catch {
      setError('Connection error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPayments(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch payments');
      }
    } catch {
      setError('Connection error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/student/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.Role.toLowerCase() !== 'admin') {
        alert('Access Denied. Admins Only.');
        navigate('/student/home');
        return;
      }
    } catch {
      navigate('/student/login');
      return;
    }

    if (activeTab === 'students') {
      Promise.resolve().then(() => fetchStudents(token));
    } else if (activeTab === 'payments') {
      Promise.resolve().then(() => fetchPayments(token));
    }
  }, [activeTab, navigate]);

  const handleApprovePayment = async (paymentId) => {
    const token = localStorage.getItem('token');
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/v1/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        fetchPayments(token);
      } else {
        setError(data.message || 'Failed to approve payment');
      }
    } catch {
      setError('Connection error approving payment');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: courseForm.name,
          grade: courseForm.grade,
          price: courseForm.price,
          medium: courseForm.medium,
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Course created successfully!');
        setCourseForm({ name: '', grade: '', price: '', medium: '' });
      } else {
        setError(data.message || 'Failed to create course');
      }
    } catch {
      setError('Connection error creating course');
    } finally {
      setLoading(false);
    }
  };

  const viewStudentDetails = async (studentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/v1/users/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedStudent(data.data);
      } else {
        alert(data.message || 'Failed to load details');
      }
    } catch {
      alert('Connection error loading student details');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-wrapper">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage registry operations, course inventory, and financial approvals.</p>
          </div>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/student/login');
          }}>
            Logout
          </button>
        </header>

        {error && <div className="error-message" style={{ margin: '0' }}>{error}</div>}
        {success && <div className="success-message" style={{ margin: '0' }}>{success}</div>}

        <nav className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => { setActiveTab('students'); setError(''); setSuccess(''); }}
          >
            Students
          </button>
          <button 
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => { setActiveTab('courses'); setError(''); setSuccess(''); }}
          >
            Add Course
          </button>
          <button 
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => { setActiveTab('payments'); setError(''); setSuccess(''); }}
          >
            Approve Payments
          </button>
        </nav>

        <main className="tab-content">
          {loading && <p>Loading data...</p>}

          {!loading && activeTab === 'students' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>WhatsApp</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>#{student.Student_ID}</td>
                      <td>{student.Name}</td>
                      <td>{student.Email}</td>
                      <td>{student.Watsapp_Number}</td>
                      <td>
                        <button className="action-btn btn-details" onClick={() => viewStudentDetails(student.id)}>
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>No registered students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'courses' && (
            <form className="admin-form" onSubmit={handleCreateCourse}>
              <h2>Create New Subject</h2>
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="courseName">Course/Subject Name</label>
                  <input
                    type="text"
                    id="courseName"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    required
                    placeholder="e.g. Physics"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="courseGrade">Grade</label>
                  <input
                    type="number"
                    step="1"
                    id="courseGrade"
                    value={courseForm.grade}
                    onChange={(e) => setCourseForm({ ...courseForm, grade: e.target.value })}
                    required
                    placeholder="e.g. 13"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="coursePrice">Price (Monthly Fee)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="coursePrice"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    required
                    placeholder="e.g. 3500.00"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="courseMedium">Medium</label>
                  <select
                    id="courseMedium"
                    value={courseForm.medium}
                    onChange={(e) => setCourseForm({ ...courseForm, medium: e.target.value })}
                    required
                  >
                    <option value="">Select Medium</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </form>
          )}

          {!loading && activeTab === 'payments' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Student ID</th>
                    <th>Subject</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>#{payment.id}</td>
                      <td>#{payment.Student_ID}</td>
                      <td>{payment.Subject}</td>
                      <td>Rs. {payment.Amount}</td>
                      <td>{payment.Method}</td>
                      <td>
                        <button className="action-btn btn-approve" onClick={() => handleApprovePayment(payment.id)}>
                          Approve & Enroll
                        </button>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>No pending approvals.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Student Details</h3>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>&times;</button>
            </header>
            <div className="modal-body">
              <div className="modal-row">
                <span className="modal-label">Name:</span>
                <span className="modal-value">{selectedStudent.Name}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Student ID:</span>
                <span className="modal-value">#{selectedStudent.Student_ID}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Email:</span>
                <span className="modal-value">{selectedStudent.Email}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">WhatsApp:</span>
                <span className="modal-value">{selectedStudent.Watsapp_Number}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">NIC:</span>
                <span className="modal-value">{selectedStudent.NIC || 'N/A'}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Address:</span>
                <span className="modal-value">{selectedStudent.Address}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Guardian's Name:</span>
                <span className="modal-value">{selectedStudent.Gurdian_s_Name}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Guardian's Number:</span>
                <span className="modal-value">{selectedStudent.Gurdians_Number}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Enrollments:</span>
                <span className="modal-value">
                  {selectedStudent.enrolledCourses && selectedStudent.enrolledCourses.length > 0
                    ? selectedStudent.enrolledCourses.map(c => c.Subject_Name).join(', ')
                    : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
