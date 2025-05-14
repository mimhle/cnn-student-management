"use server";

export async function getAllStudents(class_ = null) {
    // return fetch("http://localhost:3000/api/students")
    //     .then((res) => res.json())
    //     .then((data) => data);
    return {
        students: [
            { id: "1", name: "John Doe", classes: ["POLI001", "COMP002", "CHEM009"] },
            { id: "2", name: "Jane Smith" },
            { id: "3", name: "Bob Johnson" },
        ],
    };
}

export async function getAllClasses() {
    return {
        classes: [
            { id: "POLI001", name: "Political Science 101" },
            { id: "COMP002", name: "Computer Science 101" },
            { id: "CHEM009", name: "Chemistry 101" },
        ],
    };
}
