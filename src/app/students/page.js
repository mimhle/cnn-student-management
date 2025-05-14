"use client";

import { use, useEffect, useState } from "react";
import { getAllStudents } from "@/app/actions";
import { Space, Spin, Table, Tag } from "antd";

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
        title: 'Classes',
        key: 'classes',
        dataIndex: 'classes',
        render: (_, { classes }) => (
            classes && <div className="flex flex-row flex-wrap w-fit">
                {classes.map((tag, i) => {
                    return (
                        <Tag color={"gray"} key={i}>
                            <a href={`/classes/${tag}`}>{tag.toUpperCase()}</a>
                        </Tag>
                    );
                })}
            </div>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Details</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

export default function Page() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllStudents().then((data) => {
            console.log(data);
            setData(data.students.map(student => ({
                key: student.id,
                name: student.name,
                enrolled: `K${Math.floor(Math.random() * 50 + 20)}`,
                classes: student.classes,
            })));
            setLoading(false);
        });
    }, []);

    return (
        <div className="App">
            <h1 className="text-3xl font-bold">
                Students
            </h1>
            <div>
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={data} />
                </Spin>
            </div>
        </div>
    );
}