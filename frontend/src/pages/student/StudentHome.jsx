import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentHome.css';

const buildProfileForm = (student) => ({
  name: student?.Name || '',
  whatsappNumber: student?.Watsapp_Number || '',
  address: student?.Address || '',
  guardianName: student?.Gurdian_s_Name || '',
  guardianNumber: student?.Gurdians_Number || '',
  password: '',
  confirmPassword: '',
});

const StudentHome = () => {
  const navigate = useNavigate();
  const [storedStudent] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });
  const [student, setStudent] = useState(storedStudent);
  const initialStudentRef = useRef({
    id: storedStudent?.id,
    role: storedStudent?.Role,
  });
  const navigateRef = useRef(navigate);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileForm, setProfileForm] = useState(() => buildProfileForm(storedStudent));
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentSlipName, setPaymentSlipName] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const [enrollingId, setEnrollingId] = useState(null);

  const fetchProfile = async (studentId, token) => {
    try {
      const response = await fetch(`/api/v1/users/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load profile data');
      }

      if (data?.data) {
        setProfileForm(buildProfileForm(data.data));
        setStudent(data.data);
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/student/login');
      return;
    }

    setEnrollingId(course.id);
    setError('');

    try {
      const response = await fetch(`/api/v1/courses/${course.id}/enroll`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refetch profile to sync the home tab enrollments
        const studentId = student?.id;
        await fetchProfile(studentId, token);
      } else {
        setError(data.message || 'Failed to enroll');
      }
    } catch {
      setError('Connection error during enrollment');
    } finally {
      setEnrollingId(null);
    }
  };

  const [payingId, setPayingId] = useState(null);

  const handlePayNow = (course) => {
    setSelectedCourseForPayment(course);
    setPaymentMethod('Bank Transfer');
    setPaymentSlip(null);
    setPaymentSlipName('');
    setUploadError('');
    setShowPaymentModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadError('');
    if (!file) {
      setPaymentSlip(null);
      setPaymentSlipName('');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only jpeg and png files are allowed.');
      setPaymentSlip(null);
      setPaymentSlipName('');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be up to 5MB.');
      setPaymentSlip(null);
      setPaymentSlipName('');
      return;
    }

    setPaymentSlip(file);
    setPaymentSlipName(file.name);
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setUploadError('');

    if (!paymentSlip) {
      setUploadError('Please select a payment receipt file.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/student/login');
      return;
    }

    setPayingId(selectedCourseForPayment.id);
    setError('');

    const formData = new FormData();
    formData.append('subjectName', selectedCourseForPayment.Name);
    formData.append('amount', selectedCourseForPayment.Price);
    formData.append('method', paymentMethod);
    formData.append('slip', paymentSlip);

    try {
      const response = await fetch('/api/v1/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Payment slip submitted successfully! Waiting for admin approval.');
        setShowPaymentModal(false);
        setPaymentSlip(null);
        setPaymentSlipName('');
        const studentId = student?.id;
        await fetchProfile(studentId, token);
      } else {
        setUploadError(data.message || 'Failed to submit payment receipt');
      }
    } catch {
      setUploadError('Connection error submitting payment receipt');
    } finally {
      setPayingId(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const { id: studentId, role } = initialStudentRef.current;

    if (!token || !studentId) {
      navigateRef.current('/student/login');
      return;
    }

    if (role?.toLowerCase() === 'admin') {
      navigateRef.current('/admin/dashboard');
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      if (cancelled) return;
      await fetchProfile(studentId, token);
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCourses = async () => {
      try {
        const response = await fetch('/api/v1/courses');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load available subjects');
        }

        if (!cancelled) {
          setCourses(data.data || []);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || 'Failed to load available subjects');
        }
      } finally {
        if (!cancelled) {
          setCoursesLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/student/login');
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setProfileMessage('');

    if (profileForm.password || profileForm.confirmPassword) {
      if (profileForm.password !== profileForm.confirmPassword) {
        setError('Password and confirm password do not match.');
        return;
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/student/login');
      return;
    }

    setSavingProfile(true);

    try {
      const payload = {
        name: profileForm.name,
        whatsappNumber: profileForm.whatsappNumber,
        address: profileForm.address,
        guardianName: profileForm.guardianName,
        guardianNumber: profileForm.guardianNumber,
      };

      if (profileForm.password) {
        payload.password = profileForm.password;
      }

      const response = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      if (data?.data) {
        setStudent((currentStudent) => ({
          ...currentStudent,
          ...data.data,
        }));
        localStorage.setItem('user', JSON.stringify(data.data));
        setProfileForm(buildProfileForm(data.data));
      }

      setProfileMessage(data.message || 'Profile updated successfully.');
    } catch (submitError) {
      setError(submitError.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!student) {
    return (
      <div className="student-home student-home--loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  const avatarLetter = student.Name ? student.Name.charAt(0).toUpperCase() : 'S';
  const enrolledSubjects = Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [];

  const subjectCards = (subjectList, emptyTitle, emptyMessage, fallbackLoadingMessage, showEnrollButton = false) => {
    if (fallbackLoadingMessage) {
      return <div className="empty-state"><h4>{fallbackLoadingMessage}</h4></div>;
    }

    if (!subjectList.length) {
      return (
        <div className="empty-state">
          <h4>{emptyTitle}</h4>
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="subjects-grid">
        {subjectList.map((subject, index) => {
          const isEnrolled = enrolledSubjects.some(
            (enrollment) => enrollment.Subject_Name === (subject.Subject_Name || subject.Name)
          );

          const paymentForSubject = (student.payments || []).find(
            (payment) => payment.Subject === (subject.Subject_Name || subject.Name)
          );
          const paymentStatus = paymentForSubject ? paymentForSubject.Status : null;

          return (
            <article className="subject-card" key={subject.id || subject.Subject_Name || subject.Name || `${emptyTitle}-${index}`}>
              <div className="subject-card__top">
                <span className="subject-pill">{subject.Price ? 'Paid' : 'Open'}</span>
                <span className="subject-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h4>{subject.Subject_Name || subject.Name}</h4>
              <p className="subject-card__meta">
                Grade {subject.Grade ?? 'N/A'} · {subject.Medium ?? 'Unknown'}
              </p>
              <p className="subject-card__price">{subject.Price ? `Rs. ${subject.Price}` : 'Available now'}</p>
              <p className="subject-card__instructor">
                Instructor: {subject.InstructorName || subject.Instructor || 'Unknown'}
              </p>
              {(paymentStatus === 'Approved' || isEnrolled) && subject.MeetingLink && (
                <div style={{ marginTop: '0.8rem', padding: '0.5rem', background: 'rgba(0, 242, 254, 0.08)', border: '1px dashed rgba(0, 242, 254, 0.3)', borderRadius: '8px', fontSize: '0.88rem', textAlign: 'center' }}>
                  <a href={subject.MeetingLink} target="_blank" rel="noreferrer" style={{ color: '#00f2fe', fontWeight: 600, textDecoration: 'none' }}>
                    🔗 Join Class Meeting
                  </a>
                </div>
              )}
              {showEnrollButton && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                    disabled={isEnrolled || enrollingId === subject.id}
                    onClick={() => handleEnroll(subject)}
                  >
                    {isEnrolled
                      ? 'Enrolled'
                      : enrollingId === subject.id
                      ? 'Enrolling...'
                      : 'Enroll'}
                  </button>
                  {paymentStatus === 'Pending' && (
                    <button type="button" className="pay-btn pending" disabled>
                      Pending
                    </button>
                  )}
                  {paymentStatus === 'Approved' && (
                    <button type="button" className="pay-btn approved" disabled>
                      Approved
                    </button>
                  )}
                  {paymentStatus === 'Rejected' && (
                    <button
                      type="button"
                      className="pay-btn rejected"
                      onClick={() => handlePayNow(subject)}
                    >
                      Rejected (Pay Now)
                    </button>
                  )}
                  {!paymentStatus && (
                    <button
                      type="button"
                      className="pay-btn"
                      disabled={payingId === subject.id}
                      onClick={() => handlePayNow(subject)}
                    >
                      {payingId === subject.id ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="student-home">
      <div className="dashboard-wrapper">
        <header className="student-navbar" aria-label="Student dashboard navigation">
          <div className="student-navbar__brand">
            <span className="student-navbar__eyebrow">Student Portal</span>
            <h1 className="student-navbar__title">Learn Without Limits</h1>
          </div>
          <div className="student-navbar__tabs" role="tablist" aria-label="Student dashboard sections">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'home'}
              className={`student-navbar__tab${activeTab === 'home' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'subjects'}
              className={`student-navbar__tab${activeTab === 'subjects' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              Subjects
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'payment'}
              className={`student-navbar__tab${activeTab === 'payment' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              Payment
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'profile'}
              className={`student-navbar__tab${activeTab === 'profile' ? ' is-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>

          </div>
          <button className="student-navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {error && <div className="status-banner status-banner--error">{error}</div>}
        {loading && <div className="status-banner">Refreshing your profile...</div>}

        <main className="dashboard-grid">
          <section className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">{avatarLetter}</div>
              <h2 className="profile-name">{student.Name}</h2>
              <span className="profile-role">Student</span>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Student ID</span>
                <span className="detail-value">#{student.Student_ID}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{student.Email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">WhatsApp</span>
                <span className="detail-value">{student.Watsapp_Number}</span>
              </div>
              {student.NIC && (
                <div className="detail-item">
                  <span className="detail-label">NIC</span>
                  <span className="detail-value">{student.NIC}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">{student.Address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Guardian</span>
                <span className="detail-value">
                  {student.Gurdian_s_Name} ({student.Gurdians_Number})
                </span>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            {activeTab === 'home' && (
              <div className="panel-card">
                <div className="panel-heading">
                  <div>
                    <p className="panel-kicker">Home</p>
                    <h3>Your currently enrolled subjects</h3>
                  </div>
                  <span className="panel-count">{enrolledSubjects.length}</span>
                </div>

                {subjectCards(
                  enrolledSubjects,
                  'No current subjects found',
                  'Your current subjects will appear here once your enrollment is approved.',
                  '',
                  false
                )}
              </div>
            )}

            {activeTab === 'subjects' && (
              <div className="panel-card">
                <div className="panel-heading">
                  <div>
                    <p className="panel-kicker">Subjects</p>
                    <h3>All available subjects</h3>
                  </div>
                  <span className="panel-count">{courses.length}</span>
                </div>

                {coursesLoading
                  ? subjectCards([], '', '', 'Loading available subjects...', false)
                  : subjectCards(
                    courses,
                    'No subjects available',
                    'Available subjects will appear here once they are created.',
                    '',
                    true
                  )}
              </div>
            )}

            {activeTab === 'profile' && (
              <>
                <div className="panel-card panel-card--intro">
                  <p className="panel-kicker">Welcome back</p>
                  <h3>{student.Name}</h3>
                  <p>
                    Your profile is ready, and your enrolled subjects are synced below.
                  </p>
                  <div className="panel-meta">
                    <div>
                      <span>Enrollment</span>
                      <strong>{enrolledSubjects.length} subjects</strong>
                    </div>
                    <div>
                      <span>Role</span>
                      <strong>Student</strong>
                    </div>
                  </div>
                </div>

                <div className="panel-card panel-card--form">
                  <div className="panel-heading">
                    <div>
                      <p className="panel-kicker">Edit Profile</p>
                      <h3>Update your details</h3>
                    </div>
                  </div>

                  {profileMessage && <div className="status-banner status-banner--success">{profileMessage}</div>}

                  <form className="profile-form" onSubmit={handleProfileSubmit}>
                    <div className="profile-form__grid">
                      <label className="profile-form-group">
                        <span>Full Name</span>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          required
                        />
                      </label>

                      <label className="profile-form-group">
                        <span>Email</span>
                        <input type="email" value={student.Email || ''} readOnly />
                      </label>

                      <label className="profile-form-group">
                        <span>WhatsApp Number</span>
                        <input
                          type="text"
                          name="whatsappNumber"
                          value={profileForm.whatsappNumber}
                          onChange={handleProfileChange}
                          required
                        />
                      </label>

                      <label className="profile-form-group">
                        <span>Address</span>
                        <input
                          type="text"
                          name="address"
                          value={profileForm.address}
                          onChange={handleProfileChange}
                          required
                        />
                      </label>

                      <label className="profile-form-group">
                        <span>Guardian Name</span>
                        <input
                          type="text"
                          name="guardianName"
                          value={profileForm.guardianName}
                          onChange={handleProfileChange}
                          required
                        />
                      </label>

                      <label className="profile-form-group">
                        <span>Guardian Number</span>
                        <input
                          type="text"
                          name="guardianNumber"
                          value={profileForm.guardianNumber}
                          onChange={handleProfileChange}
                          required
                        />
                      </label>

                      <label className="profile-form-group">
                        <span>New Password</span>
                        <input
                          type="password"
                          name="password"
                          value={profileForm.password}
                          onChange={handleProfileChange}
                          placeholder="Leave blank to keep current password"
                        />
                      </label>

                      <label className="profile-form-group">
                        <span>Confirm Password</span>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={profileForm.confirmPassword}
                          onChange={handleProfileChange}
                          placeholder="Repeat the new password"
                        />
                      </label>

                      <label className="profile-form-group">
                        <span>Student ID</span>
                        <input type="text" value={`#${student.Student_ID}`} readOnly />
                      </label>
                    </div>

                    <div className="profile-form__actions">
                      <button type="submit" className="profile-form__save" disabled={savingProfile}>
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {activeTab === 'payment' && (
              <div className="panel-card panel-card--payment">
                <p className="panel-kicker">Payments</p>
                <h3>Payment overview</h3>
                <p>
                  Payment records are managed separately. Use this space for fee status, receipts, and billing reminders.
                </p>
                <div className="payment-notice">
                  <span>Next step</span>
                  <strong>Contact the office for pending payment details</strong>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Payment Authorization Modal */}
      {showPaymentModal && selectedCourseForPayment && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.25rem', maxWidth: '460px' }}>
            <header className="modal-header" style={{ paddingBottom: '0.5rem', marginBottom: '0.6rem' }}>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Upload Payment Slip</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>&times;</button>
            </header>
            <form className="edit-subject-form" onSubmit={handlePaySubmit} style={{ gap: '0.6rem' }}>
              <div className="payment-bank-details" style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.6rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '0.1rem'
              }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#00f2fe', fontSize: '0.85rem' }}>Bank Details</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1rem', fontSize: '0.8rem' }}>
                  <div><strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Bank:</strong> Commercial Bank</div>
                  <div><strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>A/C No.:</strong> 8020111119</div>
                  <div><strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Name:</strong> Soesh cooray</div>
                </div>
              </div>

              <div className="payment-instructions" style={{
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: '1.35',
                marginBottom: '0.1rem',
                padding: '0.5rem 0.7rem',
                borderLeft: '4px solid #f59e0b',
                background: 'rgba(245, 158, 11, 0.05)',
                borderRadius: '0 8px 8px 0'
              }}>
                <p style={{ margin: '0 0 0.2rem 0' }}>
                  Deposit class fee and upload receipt. We will verify and approve within 3 business days.
                </p>
                <p style={{ margin: 0, fontWeight: 600, color: '#f59e0b' }}>
                  Please pay in advance. Don't wait until the last moment.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div className="admin-form-group" style={{ gap: '0.2rem' }}>
                  <label htmlFor="paymentMethod" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Method</label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    style={{
                      padding: '0.5rem 0.7rem',
                      background: 'rgba(8, 12, 24, 0.72)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ gap: '0.2rem' }}>
                  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upload Receipt / Payment Slip</label>
                  <div style={{
                    border: '2px dashed rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.8rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(8, 12, 24, 0.4)',
                    position: 'relative'
                  }}>
                    <input
                      type="file"
                      id="slipUpload"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      required
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem' }}>
                      {paymentSlipName ? (
                        <div style={{ color: '#00f2fe', fontWeight: 600 }}>{paymentSlipName}</div>
                      ) : (
                        <>
                          <span style={{ marginRight: '0.3rem' }}>📁</span>
                          <span>Select jpeg or png file (Max 5MB)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="status-banner status-banner--error" style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem', marginTop: '0.1rem' }}>
                  {uploadError}
                </div>
              )}

              <div className="modal-actions" style={{ marginTop: '0.4rem', gap: '0.5rem' }}>
                <button type="button" className="secondary-btn" onClick={() => setShowPaymentModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={payingId !== null || !paymentSlip} style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: '#05111f',
                  fontWeight: 800,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  minWidth: '100px',
                  fontSize: '0.8rem'
                }}>
                  {payingId !== null ? 'Uploading...' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHome;
