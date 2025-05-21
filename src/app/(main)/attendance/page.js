"use client";

import { useEffect } from "react";
import { getAllSchedule_Lecture } from "@/app/actions";
import { getCurrentClass } from "@/app/utils";

export default function Page() {
    useEffect(() => {
        getAllSchedule_Lecture(localStorage.getItem("token")).then(data => {
            console.log(getCurrentClass(data));
        })
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Attendance
            </h1>
            <p>
                No classes available yet.
            </p>
        </div>
    );
}