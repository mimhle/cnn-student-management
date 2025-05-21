"use client";

import { useLayoutEffect, useState } from "react";

export default function Layout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useLayoutEffect(() => {
        if (localStorage.getItem("token")) {
            window.location.href = "/";
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        !isLoggedIn && <>{children}</>
    )
}
