import api from './api';

// Fonction d'aide pour upload de fichier (contourne le Content-Type global application/json)
const apiUpload = (method, url, formData) => {
    const config = {
        method,
        url,
        data: formData,
        headers: {} // Permet à Axios de merger avec la config globale
    };

    // On retire expressément le application/json par défaut
    // pour que le navigateur génère lui-même multipart/form-data + boundary
    return api({
        ...config,
        transformRequest: [(data, headers) => {
            delete headers['Content-Type'];
            return data;
        }]
    });
};

// ---- Auth ----
export const authService = {
    loginUser: (credentials) => api.post('/auth/login', credentials),
    registerStudent: (data) => api.post('/auth/register/student', data),
    registerProfessor: (data) => api.post('/auth/register/professor', data),
    getMe: () => api.get('/auth/me'),
    completeProfile: (data) => api.put('/auth/complete-profile', data),
    updateProfile: (formData) => apiUpload('put', '/auth/profile', formData),
};

// ---- Videos (Espace Public) ----
export const videoService = {
    getVideos: (params) => api.get('/videos', { params }),
    getVideo: (id) => api.get(`/videos/${id}`),
    publishVideo: (formData) => apiUpload('post', '/videos', formData),
    deleteVideo: (id) => api.delete(`/videos/${id}`),
    reactToVideo: (id, reaction) => api.post(`/videos/${id}/react`, { reaction }),
    addComment: (id, text) => api.post(`/videos/${id}/comments`, { text }),
    replyToComment: (id, commentId, text) => api.post(`/videos/${id}/comments/${commentId}/replies`, { text }),
};

// ---- Classrooms ----
export const classroomService = {
    createClassroom: (data) => api.post('/classrooms', data),
    getMyClassrooms: () => api.get('/classrooms/mine'),           // Professor
    getMyStudentsStats: () => api.get('/classrooms/my-students-stats'), // Professor
    getMyEnrollments: () => api.get('/classrooms/my-enrollments'), // Student
    joinClassroom: (inviteCode) => api.post('/classrooms/join', { inviteCode }),
    getClassroom: (id) => api.get(`/classrooms/${id}`),
    validateStudents: (id, studentIds, action) => api.put(`/classrooms/${id}/validate`, { studentIds, action }),
    getPendingStudents: (id) => api.get(`/classrooms/${id}/pending`),
};

// ---- Courses (inside classroom) ----
export const courseService = {
    getCourses: (classroomId) => api.get(`/classrooms/${classroomId}/courses`),
    publishCourse: (classroomId, formData) =>
        apiUpload('post', `/classrooms/${classroomId}/courses`, formData),
    deleteCourse: (classroomId, courseId) => api.delete(`/classrooms/${classroomId}/courses/${courseId}`),
};

// ---- Exercises & Submissions ----
export const exerciseService = {
    getExercises: (classroomId) => api.get(`/classrooms/${classroomId}/exercises`),
    createExercise: (classroomId, formData) =>
        apiUpload('post', `/classrooms/${classroomId}/exercises`, formData),
    submitExercise: (classroomId, exerciseId, formData) =>
        apiUpload('post', `/classrooms/${classroomId}/exercises/${exerciseId}/submit`, formData),
    getSubmissions: (classroomId, exerciseId) =>
        api.get(`/classrooms/${classroomId}/exercises/${exerciseId}/submissions`),
    gradeSubmission: (classroomId, submissionId, formData) =>
        apiUpload('put', `/classrooms/${classroomId}/exercises/submissions/${submissionId}/grade`, formData),
};

// ---- Live Sessions ----
export const sessionService = {
    getSessions: (classroomId) => api.get(`/classrooms/${classroomId}/sessions`),
    createSession: (classroomId, data) => api.post(`/classrooms/${classroomId}/sessions`, data),
    joinSession: (sessionId) => api.post(`/sessions/${sessionId}/join`),
    startSession: (sessionId) => api.put(`/sessions/${sessionId}/start`),
    endSession: (sessionId) => api.put(`/sessions/${sessionId}/end`),
};

// ---- Notifications ----
export const notificationService = {
    getMyNotifications: () => api.get('/notifications'),
    markAllAsRead: () => api.put('/notifications/read-all'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// ---- Quizzes ----
export const quizService = {
    getRandomQuiz: (tag) => api.get('/quizzes/random', { params: { tag } }),
};

// ---- Users ----
export const userService = {
    getMyStats: () => api.get('/users/me/stats')
};

// ---- AI Bot Mɛsi ----
export const botService = {
    askQuestion: (question, courseContext = '') => api.post('/bot/ask', { question, courseContext }),
    generateFlashcards: (courseContent, numberOfCards = 10) =>
        api.post('/bot/flashcards', { courseContent, numberOfCards }),
};
