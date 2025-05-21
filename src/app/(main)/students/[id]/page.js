"use client";

import { use } from "react";
import { Space, Tag } from "antd";

export default function Page({ params }) {
    params = use(params);

    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                student {params.id}
            </h1>
        </div>
    );
}