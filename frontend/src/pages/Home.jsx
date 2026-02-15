import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Home = () => {
  const [file, setFile] = useState(null);
  const [parsingStatus, setParsingStatus] = useState('idle'); // idle, parsing, complete
  const [formData, setFormData] = useState({
    rolesInterested: [],
    sectorsInterested: [],
    workTypePreference: [],
    yearsOfExperience: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [roleInput, setRoleInput] = useState('');
  const [sectorInput, setSectorInput] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const roleOptions = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'DevOps Engineer',
    'Product Manager', 'UX/UI Designer', 'Business Analyst', 'QA Engineer',
    'Mobile Developer', 'Cloud Architect', 'Security Engineer', 'Other'
  ];

  const sectorOptions = [
    'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'SaaS', 'AI/ML',
    'Cybersecurity', 'Cloud Computing', 'Gaming', 'IoT', 'Blockchain',
    'Social Media', 'Enterprise Software', 'ConsumerTech', 'Other'
  ];

  const workTypeOptions = ['Remote', 'Offline', 'Hybrid', 'Job', 'Internship', 'Freelance'];

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setParsingStatus('complete'); // Simulate ready state
    }
  };

  const handleAddRole = (role) => {
    if (!formData.rolesInterested.includes(role)) {
      setFormData({
        ...formData,
        rolesInterested: [...formData.rolesInterested, role]
      });
    }
    setRoleInput('');
  };

  const handleAddSector = (sector) => {
    if (!formData.sectorsInterested.includes(sector)) {
      setFormData({
        ...formData,
        sectorsInterested: [...formData.sectorsInterested, sector]
      });
    }
    setSectorInput('');
  };

  const handleRemoveRole = (role) => {
    setFormData({
      ...formData,
      rolesInterested: formData.rolesInterested.filter(r => r !== role)
    });
  };

  const handleRemoveSector = (sector) => {
    setFormData({
      ...formData,
      sectorsInterested: formData.sectorsInterested.filter(s => s !== sector)
    });
  };

  const handleWorkTypeToggle = (type) => {
    const current = formData.workTypePreference;
    if (current.includes(type)) {
      setFormData({
        ...formData,
        workTypePreference: current.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        workTypePreference: [...current, type]
      });
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload your resume first');
      return;
    }

    if (formData.rolesInterested.length === 0) {
      alert('Please select at least one role you are interested in');
      return;
    }

    setSubmitting(true);
    const uploadData = new FormData();
    uploadData.append('resume', file);
    uploadData.append('rolesInterested', JSON.stringify(formData.rolesInterested));
    uploadData.append('sectorsInterested', JSON.stringify(formData.sectorsInterested));
    uploadData.append('workTypePreference', JSON.stringify(formData.workTypePreference));
    uploadData.append('yearsOfExperience', formData.yearsOfExperience || '0');

    try {
      const response = await axios.post('/api/resume/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Store results in sessionStorage
      sessionStorage.setItem('resumeResults', JSON.stringify(response.data));
      navigate('/results');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Please login to continue');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Analysis failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Let's Get You Started! 🚀</h2>
          <p className="text-muted">Upload your resume and tell us about your career preferences</p>
        </div>

        <div className="row">
          {/* Resume Upload Section */}
          <div className="col-md-5">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">📄 Step 1: Upload Resume</h5>
                
                {!file ? (
                  <div 
                    className="upload-box text-center p-4 border border-2 border-dashed rounded"
                    style={{ cursor: 'pointer', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div style={{ fontSize: '3rem' }}>📤</div>
                    <h6 className="mt-2">Click to Upload</h6>
                    <p className="text-muted small mb-0">PDF, DOC, DOCX (Max 5MB)</p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx"
                      hidden 
                    />
                  </div>
                ) : (
                  <div className="alert alert-success">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>✓ {file.name}</strong>
                        <p className="mb-0 small text-muted">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setFile(null);
                          setParsingStatus('idle');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {file && (
                  <div className="mt-3">
                    <div className="alert alert-info">
                      <small>✓ Resume ready for analysis</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Form Section */}
          <div className="col-md-7">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">📝 Step 2: Your Preferences</h5>
                
                <form>
                  {/* Roles Interested */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Roles You're Interested In *</label>
                    <select 
                      className="form-select mb-2"
                      value={roleInput}
                      onChange={(e) => {
                        if (e.target.value) handleAddRole(e.target.value);
                      }}
                    >
                      <option value="">Select a role...</option>
                      {roleOptions.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.rolesInterested.map(role => (
                        <span key={role} className="badge bg-primary" style={{ cursor: 'pointer' }}>
                          {role}
                          <span className="ms-1" onClick={() => handleRemoveRole(role)}>×</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sectors Interested */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Sectors/Domains Interested In</label>
                    <select 
                      className="form-select mb-2"
                      value={sectorInput}
                      onChange={(e) => {
                        if (e.target.value) handleAddSector(e.target.value);
                      }}
                    >
                      <option value="">Select sectors...</option>
                      {sectorOptions.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.sectorsInterested.map(sector => (
                        <span key={sector} className="badge bg-info" style={{ cursor: 'pointer' }}>
                          {sector}
                          <span className="ms-1" onClick={() => handleRemoveSector(sector)}>×</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work Type Preference */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Work Type Preference</label>
                    <div className="d-flex flex-wrap gap-2">
                      {workTypeOptions.map(type => (
                        <button
                          key={type}
                          type="button"
                          className={`btn btn-sm ${formData.workTypePreference.includes(type) ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={() => handleWorkTypeToggle(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Years of Experience</label>
                    <input 
                      type="number"
                      className="form-control"
                      min="0"
                      max="50"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      placeholder="e.g., 2"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4 mb-5">
          <button 
            className="btn btn-primary btn-lg px-5"
            onClick={handleSubmit}
            disabled={submitting || !file}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Analyzing Your Resume...
              </>
            ) : (
              'Analyze My Resume & Get Recommendations'
            )}
          </button>
          {!file && (
            <p className="text-muted small mt-2">Please upload your resume to continue</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
