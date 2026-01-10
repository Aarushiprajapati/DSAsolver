import { create } from 'zustand';
import { auth } from './config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { authAPI, problemsAPI, submissionsAPI, usersAPI } from './services/api';

// Zustand Store
export const useStore = create((set, get) => ({
  // User state
  user: null,
  isAuthenticated: false,
  authLoading: true,
  authError: null,

  // Problems state
  problems: [],
  selectedProblem: null,

  // Dashboard state
  recentSubmissions: [],
  activityData: [],

  // Filters
  difficultyFilter: 'all',
  categoryFilter: 'all',
  searchQuery: '',

  // Code editor state
  currentCode: '',
  currentLanguage: 'javascript',
  isRunning: false,
  testResults: null,

  // UI state
  currentView: 'landing', // landing, problems, workspace, profile, dashboard

  // Actions
  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync with our backend
          const userData = await authAPI.getCurrentUser();
          set({
            user: userData,
            isAuthenticated: true,
            authLoading: false
          });

          // Redirect to dashboard if on landing page
          if (get().currentView === 'landing') {
            set({ currentView: 'dashboard' });
          }

          // Fetch additional dashboard data
          get().fetchDashboardData();
          // Fetch problems once authenticated
          get().fetchProblems();
        } catch (error) {
          console.error("Error fetching user data from backend:", error);

          // Fallback user with necessary properties to prevent crashes
          const fallbackUser = {
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
            stats: {
              totalSolved: 0,
              easySolved: 0,
              mediumSolved: 0,
              hardSolved: 0,
              currentStreak: 0,
              longestStreak: 0,
              totalSubmissions: 0
            }
          };

          set({
            user: fallbackUser,
            isAuthenticated: true,
            authLoading: false
          });

          if (get().currentView === 'landing') {
            set({ currentView: 'dashboard' });
          }
          // Fetch problems even if backend sync fails
          get().fetchProblems();
        }
      } else {
        set({ user: null, isAuthenticated: false, authLoading: false });
        if (get().currentView !== 'landing' && get().currentView !== 'problems') {
          set({ currentView: 'landing' });
        }
        // Guest users should also see problems
        get().fetchProblems();
      }
    });
  },

  fetchDashboardData: async () => {
    try {
      const [recent, activity] = await Promise.all([
        submissionsAPI.getRecent(),
        usersAPI.getActivity()
      ]);
      set({
        recentSubmissions: recent.submissions || [],
        activityData: activity.activity || []
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  },

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  register: async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // You could call an API here to set the name in your DB if not handled by middleware
    return userCredential.user;
  },

  loginWithGoogle: async () => {
    set({ authError: null });
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login with Google failed:", error);
      set({ authError: error.message });
      throw error;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({
      user: null,
      isAuthenticated: false,
      currentView: 'landing',
      selectedProblem: null,
      recentSubmissions: [],
      activityData: []
    });
  },

  fetchProblems: async () => {
    try {
      const response = await problemsAPI.getAll();
      const problemsArray = Array.isArray(response) ? response : (response?.problems || []);
      const normalizedProblems = problemsArray.map(p => get().normalizeProblem(p));
      set({ problems: normalizedProblems });
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  },

  normalizeProblem: (problem) => {
    if (!problem) return null;
    return {
      ...problem,
      tags: typeof problem.tags === 'string' ? JSON.parse(problem.tags || '[]') : (problem.tags || []),
      examples: typeof problem.examples === 'string' ? JSON.parse(problem.examples || '[]') : (problem.examples || []),
      constraints: typeof problem.constraints === 'string' ? JSON.parse(problem.constraints || '[]') : (problem.constraints || []),
      starterCode: typeof problem.starter_code === 'string' ? JSON.parse(problem.starter_code || '{}') : (problem.starter_code || problem.starterCode || {}),
      acceptanceRate: problem.acceptance_rate !== undefined ? problem.acceptance_rate : (problem.acceptanceRate || 0),
      submissions: problem.total_submissions !== undefined ? problem.total_submissions : (problem.submissions || 0)
    };
  },

  setView: (view) => set({ currentView: view }),

  selectProblem: async (problemId) => {
    try {
      const problem = await problemsAPI.getById(problemId);
      const normalized = get().normalizeProblem(problem);
      const language = get().currentLanguage;
      set({
        selectedProblem: normalized,
        currentCode: normalized?.starterCode?.[language] || '',
        currentView: 'workspace',
        testResults: null
      });
    } catch (error) {
      console.error("Error selecting problem:", error);
    }
  },

  setDifficultyFilter: (difficulty) => set({ difficultyFilter: difficulty }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  setCurrentCode: (code) => set({ currentCode: code }),
  setCurrentLanguage: (language) => {
    const problem = get().selectedProblem;
    set({
      currentLanguage: language,
      currentCode: problem?.starterCode?.[language] || ''
    });
  },

  runCode: async () => {
    set({ isRunning: true });

    try {
      const problemId = get().selectedProblem.id;
      const code = get().currentCode;
      const language = get().currentLanguage;

      // For now, we use the submission API as "run"
      const result = await submissionsAPI.submit(problemId, code, language);
      set({ isRunning: false, testResults: result });
    } catch (error) {
      console.error("Error running code:", error);
      set({ isRunning: false });
    }
  },

  submitCode: async () => {
    set({ isRunning: true });

    try {
      const problemId = get().selectedProblem.id;
      const code = get().currentCode;
      const language = get().currentLanguage;

      const result = await submissionsAPI.submit(problemId, code, language);

      // Refresh data
      get().calculateAndSetUserData();
      get().fetchDashboardData();

      set({ isRunning: false, testResults: result });
    } catch (error) {
      console.error("Error submitting code:", error);
      set({ isRunning: false });
    }
  },

  calculateAndSetUserData: async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      set({ user: userData });
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  },

  getFilteredProblems: () => {
    const { problems, difficultyFilter, categoryFilter, searchQuery } = get();

    if (!problems) return [];

    return problems.filter(problem => {
      const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === 'all' || problem.category === categoryFilter;
      const matchesSearch = searchQuery === '' ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesDifficulty && matchesCategory && matchesSearch;
    });
  }
}));
