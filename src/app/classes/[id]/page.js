"use client";

import { use, useEffect, useState } from "react";
import { Space, Spin, Table, Tag } from "antd";
import { getAllStudents } from "@/app/actions";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <a href={`/students/${record.key}`}>{text}</a>,
    },
    {
        title: 'Enrolled',
        dataIndex: 'enrolled',
        key: 'enrolled',
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        render: (text, record) => <Tag color={text > 5 ? "green" : "red"}>{text}</Tag>,
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

export default function Page({ params }) {
    params = use(params);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllStudents(params.id).then((data) => {
            setData(data.students.map(student => ({
                key: student.id,
                name: student.name,
                enrolled: `K${Math.floor(Math.random() * 50 + 20)}`,
                score: 10,
            })));
            setLoading(false);
        });
    }, []);

    return (
        <div className="App">
            <h1 className="text-3xl font-bold underline">
                classes {params.id}
            </h1>
            <div>
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={data}/>
                </Spin>
            </div>
        </div>
    );
}