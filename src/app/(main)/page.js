"use client";

import { Button } from 'antd';

export default function Home() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div>
            <Button type="primary" onClick={logout}>Log out</Button>
        </div>
    );
}
