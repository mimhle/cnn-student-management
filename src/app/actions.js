"use server";

const API_URL = "http://192.168.2.44:5163/api";

export const loggedIn = async (request) => {
    return request.headers.get("Authorization") !== null;
};

export async function login(username, password) {
    return await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    }).then((res) => {
        if (res.ok) {
            return res.json();
        }
        throw new Error("Invalid username or password");
    });
}

export async function getCurrentUser(token) {
    return await fetch(`${API_URL}/Auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        if (res.ok) {
            return res.json();
        }
        throw new Error("Failed to fetch current user");
    });
}

export async function getAllClasses_Lecture(token) {
    return fetch(`${API_URL}/Lecture/class-subjects`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getAllClasses_Student(token) {
    return fetch(`${API_URL}/Student/class-subjects`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getClassStudent_Lecture(token, classId) {
    return fetch(`${API_URL}/Enrollment/by-class/${classId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getAllSchedule_Lecture(token) {
    return fetch(`${API_URL}/Lecture/schedules`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getStudentEnrollment(token, studentId) {
    return fetch(`${API_URL}/Enrollment/by-student/${studentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function setStudentEnrollmentScore(token, enrollmentId, midtermScore, finalScore) {
    return fetch(`${API_URL}/Enrollment/${enrollmentId}/scores`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            midtermScore,
            finalScore,
        }),
    }).then((res) => res.json());
}

export async function getSchedules(token, classId) {
    return fetch(`${API_URL}/Schedule/by-class/${classId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getSchedule(token, scheduleId) {
    return fetch(`${API_URL}/Schedule/${scheduleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getAttendance(token, scheduleId) {
    return fetch(`${API_URL}/Attendance/by-schedule/${scheduleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function setAttendance(token, attendanceId, status) {
    return fetch(`${API_URL}/Attendance/${attendanceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            status,
        }),
    }).then((res) => res.json());
}