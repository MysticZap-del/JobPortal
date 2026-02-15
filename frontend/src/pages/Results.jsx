import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Results = () => {
  const [results, setResults] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const storedResults = sessionStorage.getItem('resumeResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, [isAuthenticated, navigate]);

  if (!results) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your analysis...</p>
        </div>
      </>
    );
  }

  const { analysis, metadata } = results;

  return (
    <>
      <Navbar />
      <div className="container mt-4 mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Your Career Profile Analysis 📊</h2>
          <p className="text-muted">Based on your resume and preferences</p>
        </div>

        {/* Section 1: Professional Summary, Key Skills & Strengths */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title text-primary mb-3">
              👤 Professional Overview
            </h4>
            
            {/* Summary */}
            {analysis?.summary && (
              <div className="mb-4">
                <h6 className="fw-bold text-secondary">Summary</h6>
                <p className="text-dark">{analysis.summary}</p>
              </div>
            )}

            <div className="row">
              {/* Key Skills */}
              {analysis?.keySkills && analysis.keySkills.length > 0 && (
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-secondary">💼 Key Skills</h6>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {analysis.keySkills.map((skill, idx) => (
                      <span key={idx} className="badge bg-primary rounded-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis?.strengths && analysis.strengths.length > 0 && (
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-secondary">⭐ Core Strengths</h6>
                  <ul className="list-unstyled mt-2">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="text-success me-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Recommended Roles & Target Sectors */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title text-primary mb-3">
              🎯 Career Opportunities
            </h4>

            <div className="row">
              {/* Recommended Roles */}
              {analysis?.recommendedRoles && analysis.recommendedRoles.length > 0 && (
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-secondary">💻 Recommended Roles</h6>
                  <div className="list-group mt-2">
                    {analysis.recommendedRoles.map((item, idx) => (
                      <div key={idx} className="list-group-item">
                        <h6 className="mb-1 fw-bold">{item.role}</h6>
                        <p className="mb-1 small">{item.reason}</p>
                        {item.alignmentWithUserPreference && (
                          <p className="mb-0 small text-muted">
                            <em>Match: {item.alignmentWithUserPreference}</em>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Sectors */}
              {analysis?.targetSectors && analysis.targetSectors.length > 0 && (
                <div className="col-md-6 mb-3">
                  <h6 className="fw-bold text-secondary">🏢 Target Sectors</h6>
                  <div className="list-group mt-2">
                    {analysis.targetSectors.map((sector, idx) => (
                      <div key={idx} className="list-group-item">
                        <h6 className="mb-1 fw-bold">{sector.sectorName}</h6>
                        {sector.industries && sector.industries.length > 0 && (
                          <div className="mb-1">
                            {sector.industries.map((ind, i) => (
                              <span key={i} className="badge bg-info me-1 mb-1">
                                {ind}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="mb-0 small text-muted">{sector.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Areas of Improvement */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title text-primary mb-3">
              📈 Growth Roadmap
            </h4>

            {/* Resume Improvements */}
            {analysis?.areasOfImprovement?.resumeImprovements && 
             analysis.areasOfImprovement.resumeImprovements.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold text-secondary">📝 Resume Improvements</h6>
                <div className="list-group mt-2">
                  {analysis.areasOfImprovement.resumeImprovements.map((item, idx) => (
                    <div key={idx} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{item.area}</h6>
                          <p className="mb-0 small">{item.suggestion}</p>
                        </div>
                        <span className={`badge ${
                          item.priority === 'high' ? 'bg-danger' :
                          item.priority === 'medium' ? 'bg-warning' : 'bg-secondary'
                        } ms-2`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gaps */}
            {analysis?.areasOfImprovement?.skillGaps && 
             analysis.areasOfImprovement.skillGaps.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold text-secondary">🎓 Skills to Learn Next</h6>
                <div className="list-group mt-2">
                  {analysis.areasOfImprovement.skillGaps.map((item, idx) => (
                    <div key={idx} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{item.skill}</h6>
                          <p className="mb-0 small">{item.reason}</p>
                        </div>
                        <span className={`badge ${
                          item.priority === 'high' ? 'bg-danger' :
                          item.priority === 'medium' ? 'bg-warning' : 'bg-secondary'
                        } ms-2`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Suggestions */}
            {analysis?.areasOfImprovement?.projectSuggestions && 
             analysis.areasOfImprovement.projectSuggestions.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold text-secondary">💡 Project Ideas to Build</h6>
                <div className="row mt-2">
                  {analysis.areasOfImprovement.projectSuggestions.map((project, idx) => (
                    <div key={idx} className="col-md-6 mb-3">
                      <div className="card border-primary">
                        <div className="card-body">
                          <h6 className="card-title">{project.project}</h6>
                          <p className="card-text small">{project.description}</p>
                          {project.skills && project.skills.length > 0 && (
                            <div className="mt-2">
                              {project.skills.map((skill, i) => (
                                <span key={i} className="badge bg-light text-dark me-1 mb-1 border">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File Metadata */}
        {metadata && (
          <div className="card bg-light">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <small className="text-muted">File Type</small>
                  <div className="fw-bold">{metadata.fileType || 'N/A'}</div>
                </div>
                <div className="col-4">
                  <small className="text-muted">File Size</small>
                  <div className="fw-bold">
                    {metadata.fileSize ? `${(metadata.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                  </div>
                </div>
                <div className="col-4">
                  <small className="text-muted">Pages</small>
                  <div className="fw-bold">{metadata.pageCount || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center mt-4">
          <button 
            className="btn btn-primary me-2"
            onClick={() => navigate('/')}
          >
            Analyze Another Resume
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => window.print()}
          >
            Print Report
          </button>
        </div>
      </div>
    </>
  );
};

export default Results;
