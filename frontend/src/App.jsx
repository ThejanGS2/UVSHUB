import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import Courses      from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CustomCursor from './components/ui/CustomCursor';

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/"            element={<Landing />}      />
        <Route path="/login"       element={<Login />}        />
        <Route path="/register"    element={<Register />}     />
        <Route path="/dashboard"   element={<Dashboard />}    />
        <Route path="/courses"     element={<Courses />}      />
        <Route path="/courses/:id" element={<CourseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
