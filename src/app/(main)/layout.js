"use client";

import MainSider from "@/app/(main)/MainLayout";
import { useLayoutEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions";
import { UserContext } from "@/app/(main)/context";

export default function Layout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);

    useLayoutEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/login";
        } else {
            setIsLoggedIn(true);
            getCurrentUser(localStorage.getItem("token")).then((res) => {
                setName(res.name);
                setUser(() => res);
            });
        }
    }, []);

    return (
        (isLoggedIn && user) && <UserContext value={user}>
            <MainSider name={name}>
                {children}
            </MainSider>
        </UserContext>
    );
}