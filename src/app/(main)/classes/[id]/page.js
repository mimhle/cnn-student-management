"use client";

import { use, useEffect, useState } from "react";
import { Button, Space, Spin, Table, Tag } from "antd";
import EditStudentModal from "@/app/(main)/students/EditStudentModal";
import { EditOutlined } from "@ant-design/icons";
import { getClassStudent_Lecture } from "@/app/actions";
import { scoreColor } from "@/app/utils";

export default function Page({ params }) {
    params = use(params);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        getClassStudent_Lecture(localStorage.getItem("token"), params.id).then((data) => {
            setData(data.map(student => ({
                key: student.enrollment.studentId,
                id: student.enrollment.studentId,
                name: student.student.fullName,
                midtermScore: student.enrollment.midtermScore,
                finalScore: student.enrollment.finalScore,
            })));
            setLoading(false);
        });
    }, [reload]);


    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'ascend',
            render: (text, record) => <a href={`/students/${record.key}`}>{text}</a>,
            sorter: (a, b) => a?.id.localeCompare(b?.id),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            defaultSortOrder: 'ascend',
            render: (text, record) => <a href={`/students/${record.key}`}>{text}</a>,
            sorter: (a, b) => a?.id.localeCompare(b?.id),
        },
        {
            title: 'Midterm score',
            dataIndex: 'midtermScore',
            key: 'midtermScore',
            render: (text, record) => <Tag color={scoreColor(text)}>{text}</Tag>,
            sorter: (a, b) => a.midtermScore - b.midtermScore,
        },
        {
            title: 'Final score',
            dataIndex: 'finalScore',
            key: 'finalScore',
            render: (text, record) => <Tag color={scoreColor(text)}>{text}</Tag>,
            sorter: (a, b) => a.finalScore - b.finalScore,
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type={"link"} onClick={() => {
                        setCurrentStudent(record.key);
                        setModalOpen(true);
                    }}>
                        <EditOutlined /> Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <EditStudentModal
                classId={params.id}
                studentId={currentStudent}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={() => {setReload(!reload)}}
            />
            <h1 className="text-3xl font-bold underline">
                {params.id}
            </h1>
            <div>
                <Spin spinning={loading}>
                    <Table columns={columns} dataSource={data}/>
                </Spin>
            </div>
        </div>
    );
}