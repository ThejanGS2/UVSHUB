import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentHome.css';

const StudentHome = () => {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/student/login');
      return;
    }

    try {
      setStudent(JSON.parse(storedUser));
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/student/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/student/login');
  };

  if (!student) {
    return (
      <div className="student-home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  const avatarLetter = student.Name ? student.Name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="student-home">
      <div className="dashboard-wrapper">
        <header className="welcome-section">
          <div>
            <h1 className="welcome-title">Welcome back, {student.Name}!</h1>
            <p className="welcome-subtitle">Here is your student hub summary.</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </header>

        <main className="dashboard-grid">
          {/* Profile Card */}
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

          {/* Action Grid */}
          <section className="actions-section">
            <div className="action-card">
              <div className="action-icon">📚</div>
              <div className="action-info">
                <h3>My Enrollments</h3>
                <p>View the subjects you are enrolled in, check course schedules, and access learning materials.</p>
              </div>
            </div>

            <div className="action-card">
              <div className="action-icon">🔍</div>
              <div className="action-info">
                <h3>Browse Courses</h3>
                <p>Explore grades, medium streams, and enroll in new academic courses and subjects.</p>
              </div>
            </div>

            <div className="action-card">
              <div className="action-icon">💳</div>
              <div className="action-info">
                <h3>Payments & Billing</h3>
                <p>Track your tuition history, upload receipts, and check outstanding balances.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentHome;
