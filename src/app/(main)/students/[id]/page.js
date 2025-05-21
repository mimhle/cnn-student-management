"use client";

import { use, useContext, useEffect, useState } from "react";
import { Button, Card, Checkbox, Descriptions, Popover, Space, Spin, Table, Tag } from "antd";
import { getAllStudentInfo, getStudent, getStudentEnrollment, setAttendance } from "@/app/actions";
import { scoreColor } from "@/app/utils";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { UserContext } from "@/app/(main)/context";
import dayjs from "dayjs";

const QuickAttendance = ({ schedule, disabled = false }) => {
    const [open, setOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(schedule.attendance.status);

    const changeAttendance = (status) => {
        setAttendance(localStorage.getItem("token"), schedule.attendance.attendanceId, status).then(() => {
            setOpen(false);
            setCurrentStatus(status);
        });
    }

    return <div className={`!w-fit ${disabled ? '!cursor-not-allowed' : ''}`}>
        <Popover
            content={<div className="flex flex-col">
                <Checkbox defaultChecked={currentStatus === 1} onChange={(e) => {
                    changeAttendance(e.target.checked ? 1 : 0);
                }}>
                    Excused Absences
                </Checkbox>
                <Checkbox defaultChecked={currentStatus === 2} onChange={(e) => {
                    changeAttendance(e.target.checked ? 2 : 0);
                }}>
                    Unexcused Absences
                </Checkbox>
            </div>}
            title={dayjs(schedule.date).format("DD/MM/YYYY") + " " + schedule.timeSlot}
            trigger="click"
            open={open}
            onOpenChange={(e) => disabled ? null : setOpen(e)}
            destroyOnHidden={true}
        >
            <Button
                className={`!w-fit ${disabled ? '!pointer-events-none' : ''}`}
                size="small"
                type="default"
                color={currentStatus === 1 ? "gold" : currentStatus === 2 ? "danger" : disabled ? "default" : null}
                variant={disabled ? "dashed" : "solid"}
                key={schedule.scheduleId}
            >
                {dayjs(schedule.date).format("DD/MM/YYYY")}
            </Button>
        </Popover>
    </div>
};

export function StudentInfo({ params }) {
    const user = useContext(UserContext);
    const [student, setStudent] = useState(null);
    const [enrollmentDetails, setEnrollmentDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllStudentInfo(localStorage.getItem("token"), params.id).then((data) => {
            console.log(data);
            setStudent(data);
            setEnrollmentDetails(data.enrollment.map((item) => ({
                key: item.classSubjectId,
                id: item.classSubjectId,
                name: item.subjectName,
                lecturer: item.lecturerName,
                lecturerId: item.lecturerId,
                midtermScore: item.midtermScore,
                finalScore: item.finalScore,
                totalScore: item.totalScore,
                weight: item.finalWeight,
                schedules: item.schedules,
            })));
            setLoading(false);
        });
    }, []);

    const description = [
        {
            key: "name",
            label: "Name",
            children: student?.fullName,
        },
        {
            key: "Id",
            label: "Id",
            children: student?.studentId,
        },
        {
            key: "email",
            label: "Email",
            children: student?.email,
        },
        {
            key: "phone",
            label: "Phone number",
            children: student?.phone,
        },
        {
            key: "dateOfBirth",
            label: "Date of Birth",
            children: new Date(student?.dateOfBirth).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }),
        },
        {
            key: "address",
            label: "Address",
            children: student?.address,
        }
    ];

    const columns = [
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
            title: 'Lecturer',
            dataIndex: 'lecturer',
            key: 'lecturer',
            sorter: (a, b) => a?.lecturer.localeCompare(b?.lecturer),
        },
        {
            title: 'Weights',
            dataIndex: 'weight',
            key: 'weight',
            render: (text, record) => <>{(1-record.weight) * 100}/{record.weight * 100}</>,
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
        Table.EXPAND_COLUMN,
    ]

    return (
        student ? <div className="flex flex-col gap-3">
            <div className="w-full flex flex-row gap-2">
                <h1 className="text-3xl font-bold w-fit">
                    {student.fullName}
                </h1>
            </div>
            <div className="flex flex-row justify-start gap-4">
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
                    dataSource={[...enrollmentDetails]}
                    pagination={false}
                    size="small"
                    expandable={{
                        columnTitle: "Attendance",
                        expandedRowRender: record => <div className="!m-0 flex flex-row flex-wrap gap-2">
                            {/*{record.id}*/}
                            {record.schedules.map((item) => {
                                return <QuickAttendance
                                    key={item.scheduleId}
                                    schedule={item}
                                    disabled={user.role !== "Lecturer" || (user.role === "Lecturer" && item.lecturerId !== user.userId)}
                                />;
                            })}
                        </div>,
                        rowExpandable: () => true,
                        expandIcon: ({ expanded, onExpand, record }) => {
                            return <Button type="text" onClick={e => onExpand(record, e)}>
                                {expanded ? <>Collapse <CaretUpOutlined /></> : <>Expand <CaretDownOutlined /></>}
                            </Button>
                        }
                    }}
                />
            </Spin>
        </div> : null
    );
}

export default function Page({ params }) {
    params = use(params);

    return <StudentInfo params={params} />;
}