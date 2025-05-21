"use client";

import MainSider from "@/app/(main)/MainLayout";
import { useLayoutEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions";

export default function Layout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("");

    useLayoutEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/login";
        } else {
            setIsLoggedIn(true);
            getCurrentUser(localStorage.getItem("token")).then((res) => {
                setName(res.name);
                localStorage.setItem("user", JSON.stringify(res));
            });
        }
    }, []);

    return (
        isLoggedIn && <MainSider name={name}>
            {children}
        </MainSider>
    );
}