"use client";

import { useContext } from "react";
import { UserContext } from "@/app/(main)/context";
import { StudentInfo } from "@/app/(main)/students/[id]/page";
import { LecturerInfo } from "@/app/(main)/lecturers/[id]/page";

export default function Page() {
    const user = useContext(UserContext);

    if (user.role === "Student") {
        return <StudentInfo params={{id: user.userId}} />;
    } else {
        return <LecturerInfo params={{id: user.userId}} />;
    }
}