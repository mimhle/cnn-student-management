"use client";

import { use, useEffect, useState } from "react";
import { getAttendance, getSchedule, getSchedules, getSubjectByClass, setAttendance } from "@/app/actions";
import { Checkbox, Spin, Table } from "antd";
import { useMessage } from "@/app/utils";

export default function Page({ params }) {
    params = use(params);
    const { contextHolder, success, error } = useMessage();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [className, setClassName] = useState("");
    const [timeSlot, setTimeSlot] = useState("");

    useEffect(() => {
        getSubjectByClass(localStorage.getItem("token"), params.id).then((d) => {
            setClassName(d.name);
            getSchedules(localStorage.getItem("token"), params.id).then((schedules) => {
                const schedule = schedules.find((item) => item.scheduleId === params.scheduleId);
                setTimeSlot(`${schedule.timeSlot} ${new Date(schedule.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })}`);
            });
        });
        getAttendance(localStorage.getItem("token"), params.scheduleId).then((data) => {
            console.log(data);
            setAttendanceData(data.map((item) => ({
                key: `${item.studentId}${item.status}`,
                id: item.studentId,
                name: item.studentName,
                excusedAbsence: item.status === 1,
                unexcusedAbsence: item.status === 2,
                attendanceId: item.attendanceId,
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
            render: (text, record) => <a href={`/students/${record.id}`}>{text}</a>,
            sorter: (a, b) => a?.id.localeCompare(b?.id),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a href={`/students/${record.id}`}>{text}</a>,
            sorter: (a, b) => a?.id.localeCompare(b?.id),
        },
        {
            title: 'Excused Absences',
            dataIndex: 'excusedAbsence',
            key: 'excusedAbsence',
            render: (text, record) => <Checkbox className="checkbox-yellow" defaultChecked={text} onChange={(e) => {
                setAttendance(localStorage.getItem("token"), record.attendanceId, e.target.checked ? 1 : 0).then((data) => {
                    setReload(!reload);
                });
            }} />,
            sorter: (a, b) => a.excusedAbsence - b.excusedAbsence,
        },
        {
            title: 'Unexcused Absences',
            dataIndex: 'unexcusedAbsence',
            key: 'unexcusedAbsence',
            render: (text, record) => <Checkbox className="checkbox-red" defaultChecked={text} onChange={(e) => {
                setAttendance(localStorage.getItem("token"), record.attendanceId, e.target.checked ? 2 : 0).then((data) => {
                    setReload(!reload);
                });
            }} />,
            sorter: (a, b) => a.unexcusedAbsence - b.unexcusedAbsence,
        },
    ];

    return (
        className && timeSlot && <div>
            {contextHolder}
            <h1 className="text-3xl font-bold mb-2">
                {className} - {timeSlot}
            </h1>
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={[...attendanceData]} pagination={false} size="small"/>
            </Spin>
        </div>
    );
}
