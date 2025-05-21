"use client";

import { useContext } from "react";
import { UserContext } from "@/app/(main)/context";
import { StudentInfo } from "@/app/(main)/students/[id]/page";

export default function Page() {
    const user = useContext(UserContext);

    if (user.role === "Student") {
        return <StudentInfo params={{id: user.userId}} />;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Info
            </h1>
            <p>Info page</p>
        </div>
    );
}