"use client";

import { use, useContext, useEffect, useLayoutEffect, useState } from "react";
import { UserContext } from "@/app/(main)/context";
import { getAllLecturerInfo } from "@/app/actions";
import { Button, Descriptions, Spin, Table, Tag, Typography } from "antd";
import { scoreColor, useMessage } from "@/app/utils";
import { EditOutlined } from "@ant-design/icons";
import { ChangeScheduleModal, LecturerEditModal } from "@/app/Modals";

const { Text } = Typography;

export function LecturerInfo({ params }) {
    const user = useContext(UserContext);
    const [lecturer, setLecturer] = useState(null);
    const [classDetails, setClassDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const { contextHolder, success, error } = useMessage();
    const [currentClass, setCurrentClass] = useState(null);
    const [updateScoreModalOpen, setUpdateScoreModalOpen] = useState(false);

    useEffect(() => {
        getAllLecturerInfo(localStorage.getItem("token"), params.id).then((data) => {
            setLecturer(data);
            setClassDetails(data.classSubjects.map((item) => ({
                key: item.classSubjectId,
                id: item.classSubjectId,
                name: item.subjectName,
                weight: item.finalWeight,
                lecturerId: data.lecturerId,
                credits: item.credit,
            })));
            setLoading(false);
        });
    }, [reload]);

    const description = [
        {
            key: "name",
            label: "Name",
            children: lecturer?.fullName,
        },
        {
            key: "Id",
            label: "Id",
            children: lecturer?.lecturerId,
        },
        {
            key: "email",
            label: "Email",
            children: lecturer?.email,
        },
        {
            key: "phone",
            label: "Phone number",
            children: lecturer?.phoneNumber,
        },
        {
            key: "dateOfBirth",
            label: "Date of Birth",
            children: new Date(lecturer?.dateOfBirth).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }),
        },
        {
            key: "academicTitle",
            label: "Academic title",
            children: lecturer?.academicTitle,
        },
        {
            key: "degree",
            label: "Degree",
            children: lecturer?.degree,
        },
        {
            key: "department",
            label: "Department",
            children: lecturer?.department,
        }
    ];

    let columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'ascend',
            render: (text, record) => {
                if (user.role === "Lecturer") {
                    if (record.lecturerId === user.userId) return <a href={`/classes/${record.id}`}>{text}</a>;
                    return <>{text}</>;
                } else {
                    return <>{text}</>;
                }
            },
            sorter: (a, b) => a?.id.localeCompare(b?.id),
        },
        {
            title: 'Class name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a?.id.localeCompare(b?.id),
        },
        {
            title: 'Credits',
            dataIndex: 'credits',
            key: 'credits',
            sorter: (a, b) => a.credits - b.credits,
        },
        {
            title: 'Weights',
            dataIndex: 'weight',
            key: 'weight',
            render: (text, record) => <>{(1-record.weight) * 100}/{record.weight * 100}</>,
        },
    ];

    useLayoutEffect(() => {

    }, []);

    if (user.role === "Lecturer" && user.userId === params.id) {
        columns = columns.concat([
            {
                title: 'Schedule',
                render: (text, record) => {
                    return <Button onClick={() => {
                        setCurrentClass(record);
                        setUpdateScoreModalOpen(true);
                    }}>
                        Change
                    </Button>
                }
            },
            {
                title: 'Attendance',
                render: (text, record) => {
                    return <Button href={`/attendance/${record.id}`} type="primary">
                        Check attendance
                    </Button>
                }
            }
        ]);
    }

    return (lecturer ? <div className="flex flex-col gap-3">
        {contextHolder}
        <ChangeScheduleModal
            open={updateScoreModalOpen}
            onClose={() => setUpdateScoreModalOpen(false)}
            onSuccess={(data) => {
                setUpdateScoreModalOpen(false);
                setReload(!reload);
                success("Update successfully");
            }}
            classId={currentClass?.id}
        />
        <div className="w-full flex flex-row gap-2">
            <h1 className="text-3xl font-bold w-fit">
                {lecturer.fullName}
            </h1>
            {(user.role === "Lecturer" && user.userId === params.id) ? <Button className="mt-auto" onClick={() => setEditModalOpen(true)}>
                <EditOutlined/> Update info
            </Button> : null}
        </div>
        <div className="flex flex-row justify-start gap-4">
            <LecturerEditModal
                open={editModalOpen}
                lecturerId={lecturer.lecturerId}
                onClose={() => setEditModalOpen(false)}
                onSuccess={(data) => {
                    setEditModalOpen(false);
                    setReload(!reload);
                    success("Update successfully");
                }}
            />
            <Descriptions
                title=""
                items={description}
                bordered
                column={1}
                className="w-fit"
                size="small"
                classNames={{label: "w-32"}}
            />
        </div>
        <Spin spinning={loading}>
            <Table
                columns={columns}
                dataSource={[...classDetails]}
                pagination={false}
                size="small"
            ></Table>
        </Spin>
    </div> : null);

}

export default function Page({ params }) {
    params = use(params);
    return <LecturerInfo params={params} />;
}