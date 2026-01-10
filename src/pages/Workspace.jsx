import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../store';
import './Workspace.css';

export default function Workspace() {
    const {
        selectedProblem,
        currentCode,
        currentLanguage,
        isRunning,
        testResults,
        setCurrentCode,
        setCurrentLanguage,
        runCode,
        submitCode,
        setView
    } = useStore();

    const [activeTab, setActiveTab] = useState('description');

    if (!selectedProblem) {
        return (
            <div className="workspace-page">
                <div className="empty-workspace">
                    <div className="empty-icon">📝</div>
                    <h2>No Problem Selected</h2>
                    <p>Choose a problem from the problem set to start coding</p>
                    <button className="btn btn-primary" onClick={() => setView('problems')}>
                        Browse Problems
                    </button>
                </div>
            </div>
        );
    }

    const languages = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'python', name: 'Python' },
        { id: 'java', name: 'Java' }
    ];

    return (
        <div className="workspace-page">
            <div className="workspace-container">
                {/* Left Panel - Problem Description */}
                <div className="problem-panel">
                    <div className="panel-header">
                        <button
                            className="back-btn btn btn-ghost btn-sm"
                            onClick={() => setView('problems')}
                        >
                            ← Back to Problems
                        </button>
                    </div>

                    <div className="problem-title-section">
                        <h1>{selectedProblem.title}</h1>
                        <div className="problem-badges">
                            <span className={`badge badge-${selectedProblem.difficulty}`}>
                                {selectedProblem.difficulty}
                            </span>
                            <span className="category-badge">{selectedProblem.category}</span>
                        </div>
                    </div>

                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab ${activeTab === 'examples' ? 'active' : ''}`}
                            onClick={() => setActiveTab('examples')}
                        >
                            Examples
                        </button>
                        <button
                            className={`tab ${activeTab === 'constraints' ? 'active' : ''}`}
                            onClick={() => setActiveTab('constraints')}
                        >
                            Constraints
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="description-content">
                                <p className="problem-text">{selectedProblem.description}</p>

                                <div className="tags-section">
                                    <h4>Tags</h4>
                                    <div className="tags">
                                        {selectedProblem.tags.map((tag, index) => (
                                            <span key={index} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="stats-section">
                                    <div className="stat-item">
                                        <span className="stat-label">Acceptance Rate</span>
                                        <span className="stat-value">{selectedProblem.acceptanceRate}%</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Submissions</span>
                                        <span className="stat-value">{selectedProblem.submissions.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'examples' && (
                            <div className="examples-content">
                                {selectedProblem.examples.map((example, index) => (
                                    <div key={index} className="example-card">
                                        <h4>Example {index + 1}</h4>
                                        <div className="example-item">
                                            <strong>Input:</strong>
                                            <code>{example.input}</code>
                                        </div>
                                        <div className="example-item">
                                            <strong>Output:</strong>
                                            <code>{example.output}</code>
                                        </div>
                                        {example.explanation && (
                                            <div className="example-item">
                                                <strong>Explanation:</strong>
                                                <p>{example.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'constraints' && (
                            <div className="constraints-content">
                                <ul className="constraints-list">
                                    {selectedProblem.constraints.map((constraint, index) => (
                                        <li key={index}>{constraint}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className="editor-panel">
                    <div className="editor-header">
                        <div className="language-selector">
                            {languages.map(lang => (
                                <button
                                    key={lang.id}
                                    className={`lang-btn ${currentLanguage === lang.id ? 'active' : ''}`}
                                    onClick={() => setCurrentLanguage(lang.id)}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>

                        <div className="editor-actions">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={runCode}
                                disabled={isRunning}
                            >
                                {isRunning ? '⏳ Running...' : '▶ Run Code'}
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={submitCode}
                                disabled={isRunning}
                            >
                                {isRunning ? '⏳ Submitting...' : '✓ Submit'}
                            </button>
                        </div>
                    </div>

                    <div className="editor-container">
                        <Editor
                            height="100%"
                            language={currentLanguage}
                            value={currentCode}
                            onChange={(value) => setCurrentCode(value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace"
                            }}
                        />
                    </div>

                    {/* Test Results */}
                    {testResults && (
                        <div className={`results-panel ${testResults.passed ? 'success' : 'error'}`}>
                            <div className="results-header">
                                <div className="results-status">
                                    {testResults.passed ? (
                                        <>
                                            <span className="status-icon">✓</span>
                                            <span className="status-text">Accepted</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="status-icon">✗</span>
                                            <span className="status-text">Wrong Answer</span>
                                        </>
                                    )}
                                </div>
                                <div className="results-stats">
                                    <span className="result-stat">
                                        {testResults.passedTests}/{testResults.totalTests} tests passed
                                    </span>
                                    <span className="result-stat">Runtime: {testResults.runtime}ms</span>
                                    <span className="result-stat">Memory: {testResults.memory}MB</span>
                                </div>
                            </div>
                            <div className="results-output">
                                <pre>{testResults.output}</pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
