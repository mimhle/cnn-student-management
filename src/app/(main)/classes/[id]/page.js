"use client";

import { use, useEffect, useState } from "react";
import { Button, Space, Spin, Table, Tag } from "antd";
import { EditStudentScoreModal } from "@/app/Modals";
import { EditOutlined } from "@ant-design/icons";
import { getClassStudent_Lecture, getClassSubject, getSubject } from "@/app/actions";
import { useRouter } from 'next/navigation'
import { roundToTwoDecimalPlaces, scoreColor } from "@/app/utils";

export default function Page({ params }) {
    params = use(params);
    const router = useRouter()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [reload, setReload] = useState(false);
    const [className, setClassName] = useState(null);

    useEffect(() => {
        getClassStudent_Lecture(localStorage.getItem("token"), params.id).then((data) => {
            getClassSubject(localStorage.getItem("token"), params.id).then((d) => {
                getSubject(localStorage.getItem("token"), d.subjectId).then((subject) => {
                    setClassName(subject.name);
                    setLoading(false);
                    setData(data.map(student => ({
                        key: student.enrollment.studentId,
                        id: student.enrollment.studentId,
                        name: student.student.fullName,
                        midtermScore: student.enrollment.midtermScore,
                        finalScore: student.enrollment.finalScore,
                        totalScore: roundToTwoDecimalPlaces(student.enrollment.finalScore * subject.finalWeight + student.enrollment.midtermScore * (1 - subject.finalWeight)),
                    })));
                    console.log(data);
                });
            });
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
            title: 'Total score',
            dataIndex: 'totalScore',
            key: 'totalScore',
            render: (text, record) => <Tag color={scoreColor(text)}>{text}</Tag>,
            sorter: (a, b) => a.totalScore - b.totalScore,
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
            <EditStudentScoreModal
                classId={params.id}
                studentId={currentStudent}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={() => {setReload(!reload)}}
            />
            <Spin spinning={loading}>
                <div className="flex flex-row justify-between">
                    <h1 className="text-3xl font-bold mb-2">
                        {className ? className : params.id}
                    </h1>
                    <Button href={`/attendance/${params.id}`}>
                        Attendance
                    </Button>
                </div>
                <div>
                    <Table columns={columns} dataSource={data} size="small"/>
                </div>
            </Spin>
        </div>
    );
}