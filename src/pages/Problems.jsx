import { useState } from 'react';
import { useStore } from '../store';
import './Problems.css';

export default function Problems() {
    const {
        difficultyFilter,
        categoryFilter,
        searchQuery,
        setDifficultyFilter,
        setCategoryFilter,
        setSearchQuery,
        getFilteredProblems,
        selectProblem
    } = useStore();

    const filteredProblems = getFilteredProblems();
    const categories = ['all', 'Arrays', 'Strings', 'Linked List', 'Stack', 'Binary Search', 'Dynamic Programming'];

    return (
        <div className="problems-page">
            <div className="problems-container">
                <div className="problems-header">
                    <div className="header-content">
                        <h1>Problem Set</h1>
                        <p>Choose a problem to start practicing</p>
                    </div>

                    <div className="problems-stats">
                        <div className="stat-badge">
                            <span className="stat-value">{filteredProblems.length}</span>
                            <span className="stat-label">Problems</span>
                        </div>
                    </div>
                </div>

                <div className="filters-section">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search problems by title or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Difficulty</label>
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${difficultyFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setDifficultyFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${difficultyFilter === 'easy' ? 'active easy' : ''}`}
                                onClick={() => setDifficultyFilter('easy')}
                            >
                                Easy
                            </button>
                            <button
                                className={`filter-btn ${difficultyFilter === 'medium' ? 'active medium' : ''}`}
                                onClick={() => setDifficultyFilter('medium')}
                            >
                                Medium
                            </button>
                            <button
                                className={`filter-btn ${difficultyFilter === 'hard' ? 'active hard' : ''}`}
                                onClick={() => setDifficultyFilter('hard')}
                            >
                                Hard
                            </button>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Category</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="category-select"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="problems-list">
                    {filteredProblems.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No problems found</h3>
                            <p>Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        filteredProblems.map((problem) => (
                            <div
                                key={problem.id}
                                className="problem-card glass-card"
                                onClick={() => selectProblem(problem.id)}
                            >
                                <div className="problem-header">
                                    <div className="problem-title-section">
                                        <h3 className="problem-title">{problem.title}</h3>
                                        <div className="problem-meta">
                                            <span className={`badge badge-${problem.difficulty}`}>
                                                {problem.difficulty}
                                            </span>
                                            <span className="problem-category">{problem.category}</span>
                                        </div>
                                    </div>
                                    <div className="problem-stats">
                                        <div className="stat">
                                            <span className="stat-icon">✓</span>
                                            <span className="stat-text">{problem.acceptanceRate}%</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="problem-description">{problem.description}</p>

                                <div className="problem-tags">
                                    {problem.tags.map((tag, index) => (
                                        <span key={index} className="tag">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="problem-footer">
                                    <span className="submissions-count">
                                        {problem.submissions.toLocaleString()} submissions
                                    </span>
                                    <button className="solve-btn btn btn-primary btn-sm">
                                        Solve Challenge →
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
