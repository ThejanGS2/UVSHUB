import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    instructor: '',
    grade: '',
    price: '',
    medium: '',
    meetingLink: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewingSlipUrl, setViewingSlipUrl] = useState(null);
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

  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/courses');
      const data = await response.json();
      if (response.ok) {
        setSubjects(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch subjects');
      }
    } catch {
      setError('Connection error fetching subjects');
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
        setPayments((data.data || []).filter((payment) => !payment.Status || payment.Status === 'Pending'));
      } else {
        setError(data.message || 'Failed to fetch payments');
      }
    } catch {
      setError('Connection error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPaymentHistory(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch payment history');
      }
    } catch {
      setError('Connection error fetching payment history');
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
    } else if (activeTab === 'subjects') {
      Promise.resolve().then(() => fetchSubjects());
    } else if (activeTab === 'payments') {
      Promise.resolve().then(() => fetchPayments(token));
    } else if (activeTab === 'history') {
      Promise.resolve().then(() => fetchPaymentHistory(token));
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

  const handleRejectPayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to reject this payment?')) {
      return;
    }
    const token = localStorage.getItem('token');
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/v1/payments/${paymentId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || 'Payment rejected successfully');
        fetchPayments(token);
      } else {
        setError(data.message || 'Failed to reject payment');
      }
    } catch {
      setError('Connection error rejecting payment');
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
          instructor: courseForm.instructor,
          grade: courseForm.grade,
          price: courseForm.price,
          medium: courseForm.medium,
          meetingLink: courseForm.meetingLink,
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Course created successfully!');
        setCourseForm({ name: '', instructor: '', grade: '', price: '', medium: '', meetingLink: '' });
        await fetchSubjects();
        setActiveTab('subjects');
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

  const openSubjectEditor = (subject) => {
    setEditingSubject({
      id: subject.id,
      name: subject.Name || '',
      instructor: subject.InstructorName || subject.Instructor || subject.instructor?.name || '',
      grade: subject.Grade?.toString() || '',
      price: subject.Price?.toString() || '',
      medium: subject.Medium || '',
      meetingLink: subject.MeetingLink || '',
    });
    setError('');
    setSuccess('');
  };

  const handleSubjectEditChange = (event) => {
    const { name, value } = event.target;
    setEditingSubject((currentSubject) => ({
      ...currentSubject,
      [name]: value,
    }));
  };

  const handleUpdateSubject = async (event) => {
    event.preventDefault();

    if (!editingSubject?.id) {
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/v1/courses/${editingSubject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingSubject.name,
          instructor: editingSubject.instructor,
          grade: editingSubject.grade,
          price: editingSubject.price,
          medium: editingSubject.medium,
          meetingLink: editingSubject.meetingLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Subject updated successfully!');
        setEditingSubject(null);
        await fetchSubjects();
      } else {
        setError(data.message || 'Failed to update subject');
      }
    } catch {
      setError('Connection error updating subject');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/v1/courses/${subjectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Subject deleted successfully!');
        await fetchSubjects();
      } else {
        setError(data.message || 'Failed to delete subject');
      }
    } catch {
      setError('Connection error deleting subject');
    } finally {
      setLoading(false);
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
            className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => { setActiveTab('subjects'); setError(''); setSuccess(''); }}
          >
            Subjects
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
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => { setActiveTab('history'); setError(''); setSuccess(''); }}
          >
            Payment History
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

          {!loading && activeTab === 'subjects' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject ID</th>
                    <th>Name</th>
                    <th>Instructor</th>
                    <th>Grade</th>
                    <th>Medium</th>
                    <th>Price</th>
                    <th>Meeting Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>#{subject.id}</td>
                      <td>{subject.Name}</td>
                      <td>{subject.InstructorName || subject.Instructor || subject.instructor?.name || 'N/A'}</td>
                      <td>{subject.Grade}</td>
                      <td>{subject.Medium}</td>
                      <td>Rs. {subject.Price}</td>
                      <td>
                        {subject.MeetingLink ? (
                          <a href={subject.MeetingLink} target="_blank" rel="noreferrer">
                            Open Link
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="action-btn btn-edit" onClick={() => openSubjectEditor(subject)}>
                            Edit
                          </button>
                          <button className="action-btn btn-delete" onClick={() => handleDeleteSubject(subject.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {subjects.length === 0 && !loading && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center' }}>No subjects created yet.</td>
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
                  <label htmlFor="courseInstructor">Instructor</label>
                  <input
                    type="text"
                    id="courseInstructor"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    required
                    placeholder="e.g. Mr. Perera"
                  />
                </div>
              </div>
              <div className="form-row">
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
              </div>
              <div className="form-row">
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
                <div className="admin-form-group">
                  <label htmlFor="courseMeeting">Meeting Link</label>
                  <input
                    type="url"
                    id="courseMeeting"
                    value={courseForm.meetingLink}
                    onChange={(e) => setCourseForm({ ...courseForm, meetingLink: e.target.value })}
                    placeholder="https://meet.example.com/room"
                    required
                  />
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
                    <th>Status</th>
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
                      <td>{payment.Status || 'Pending'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {payment.Slip_Url ? (
                            <button
                              className="action-btn btn-details"
                              onClick={() => setViewingSlipUrl(payment.Slip_Url)}
                            >
                              View Receipt
                            </button>
                          ) : (
                            <span style={{ color: 'rgba(255,255,255,0.4)', padding: '0.5rem' }}>No Slip</span>
                          )}
                          <button className="action-btn btn-approve" onClick={() => handleApprovePayment(payment.id)}>
                            Approve & Enroll
                          </button>
                          <button className="action-btn btn-delete" onClick={() => handleRejectPayment(payment.id)}>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && !loading && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>No pending approvals.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && activeTab === 'history' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Student ID</th>
                    <th>Subject</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td>#{payment.id}</td>
                      <td>#{payment.Student_ID}</td>
                      <td>{payment.Subject}</td>
                      <td>Rs. {payment.Amount}</td>
                      <td>{payment.Method}</td>
                      <td>{payment.Status || 'Pending'}</td>
                      <td>
                        {payment.Slip_Url ? (
                          <button
                            className="action-btn btn-details"
                            onClick={() => setViewingSlipUrl(payment.Slip_Url)}
                          >
                            View Receipt
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                  {paymentHistory.length === 0 && !loading && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>No payment history found.</td>
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

      {editingSubject && (
        <div className="modal-overlay" onClick={() => setEditingSubject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Edit Subject</h3>
              <button className="close-btn" onClick={() => setEditingSubject(null)}>&times;</button>
            </header>
            <form className="edit-subject-form" onSubmit={handleUpdateSubject}>
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="editSubjectName">Subject Name</label>
                  <input
                    id="editSubjectName"
                    name="name"
                    type="text"
                    value={editingSubject.name}
                    onChange={handleSubjectEditChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="editSubjectInstructor">Instructor</label>
                  <input
                    id="editSubjectInstructor"
                    name="instructor"
                    type="text"
                    value={editingSubject.instructor}
                    onChange={handleSubjectEditChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="editSubjectGrade">Grade</label>
                  <input
                    id="editSubjectGrade"
                    name="grade"
                    type="number"
                    step="1"
                    value={editingSubject.grade}
                    onChange={handleSubjectEditChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="editSubjectPrice">Price</label>
                  <input
                    id="editSubjectPrice"
                    name="price"
                    type="number"
                    step="0.01"
                    value={editingSubject.price}
                    onChange={handleSubjectEditChange}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="editSubjectMedium">Medium</label>
                  <select
                    id="editSubjectMedium"
                    name="medium"
                    value={editingSubject.medium}
                    onChange={handleSubjectEditChange}
                    required
                  >
                    <option value="">Select Medium</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label htmlFor="editSubjectMeetingLink">Meeting Link</label>
                <input
                  id="editSubjectMeetingLink"
                  name="meetingLink"
                  type="url"
                  value={editingSubject.meetingLink}
                  onChange={handleSubjectEditChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setEditingSubject(null)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Viewing Payment Slip Modal */}
      {viewingSlipUrl && (
        <div className="modal-overlay" onClick={() => setViewingSlipUrl(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <header className="modal-header">
              <h3>Payment Receipt Proof</h3>
              <button className="close-btn" onClick={() => setViewingSlipUrl(null)}>&times;</button>
            </header>
            <div className="modal-body" style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <img
                src={viewingSlipUrl}
                alt="Payment Receipt Slip"
                style={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                  objectFit: 'contain'
                }}
              />
            </div>
            <footer className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="secondary-btn" onClick={() => setViewingSlipUrl(null)}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
