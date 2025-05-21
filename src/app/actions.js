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

export async function getStudent(token, studentId) {
    return fetch(`${API_URL}/Student/${studentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        return res.json();
    });
}

export async function getClassSubject(token, classSubjectId) {
    return fetch(`${API_URL}/ClassSubject/${classSubjectId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getSubject(token, subjectId) {
    return fetch(`${API_URL}/Subject/${subjectId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getLecturer(token, lecturerId) {
    return fetch(`${API_URL}/Lecture/${lecturerId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());
}

export async function getAllStudentInfo(token, studentId) {
    return getStudent(token, studentId).then(async (data) => {
        return {
            ...data,
            enrollment: await getStudentEnrollment(token, studentId).then(async (enrollment) => {
                const subjectId = await Promise.all(enrollment.map((item) => {
                    return getClassSubject(token, item.classSubjectId).then(async (subject) => {
                        const s = await getSubject(token, subject.subjectId);
                        return {
                            subjectId: subject.subjectId,
                            subjectName: s.name,
                            finalWeight: s.finalWeight,
                            credit: s.credit,
                            totalScore: (Math.round(item.midtermScore * (1-s.finalWeight) + item.finalScore * s.finalWeight * 100) / 100).toFixed(2),
                            lecturerId: subject.lecturerId,
                            lecturerName: await getLecturer(token, subject.lecturerId).then((lecture) => {
                                return lecture.lecturer.fullName;
                            }),
                            schedules: await getSchedules(token, subject.classSubjectId).then(async(schedules) => {
                                schedules = await Promise.all(schedules.map((schedule) => {
                                    return getAttendance(token, schedule.scheduleId).then((attendance) => {
                                        return {
                                            ...schedule,
                                            attendance: attendance.find((item) => {
                                                return item.studentId === studentId;
                                            }),
                                        };
                                    });
                                }));
                                return schedules;
                            })
                        };
                    });
                }));

                for (let i = 0; i < enrollment.length; i++) {
                    enrollment[i] = {
                        ...enrollment[i],
                        ...subjectId[i],
                    };
                }

                return enrollment;
            })
        };
    });
}