"use client";

import { Button, Calendar, Col, Popover, Row, Select, Spin, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { getAllStudentInfo } from "@/app/actions";
import { UserContext } from "@/app/(main)/context";

export default function Page() {
    const user = useContext(UserContext);
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [schedules, setSchedules] = useState([]);
    const [classSubjectIdName, setClassSubjectIdName] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllStudentInfo(localStorage.getItem("token"), user.userId).then((data) => {
            const names = {};
            const s = data.enrollment.map((item) => {
                names[item.classSubjectId] = item.subjectName;
                return item.schedules;
            }).flat().map(item => ({
                ...item,
                date: dayjs(item.date),
            })).sort((a, b) => a.date - b.date || a.timeSlot.localeCompare(b.timeSlot, undefined, { numeric: true }));

            console.log(data, names);
            setSchedules(s);
            setClassSubjectIdName(names);
            setLoading(false);
        });
    }, []);

    const cellRender = (current, info) => {
        if (info.type === "date") {
            const dateCellRender = c => {
                const currentSchedule = schedules.filter(item => item.date.isSame(c, "date"));
                if (currentSchedule?.length === 0) return null;

                return currentSchedule ? <Popover title="Detail" placement="left" content={<div>
                    {currentSchedule.map((schedule, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex flex-row justify-between">
                                <span>{classSubjectIdName[schedule.classSubjectId]}&nbsp;</span>
                                <span className="text-sm opacity-70">({schedule.classSubjectId})&nbsp;</span>
                                <Tag color="blue" className="w-fit text-center">
                                    {schedule.timeSlot}
                                </Tag>
                            </div>
                        </div>
                    ))}
                </div>}>
                    <div className={"flex flex-col gap-2"}>
                        {currentSchedule.map((schedule, i) => (
                            <Tag key={i} color="blue" className="w-fit text-center">
                                {schedule.timeSlot}
                            </Tag>
                        ))}
                    </div>
                </Popover>: null;
            };
            return dateCellRender(current);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Timetable
            </h1>
            <Spin spinning={loading}>
                <Calendar
                    value={currentDate}
                    onChange={setCurrentDate}
                    cellRender={cellRender}
                    headerRender={({ value, type, onChange, onTypeChange }) => {
                        const start = 0;
                        const end = 12;
                        const monthOptions = [];
                        let current = value.clone();
                        const localeData = value.localeData();
                        const months = [];
                        for (let i = 0; i < 12; i++) {
                            current = current.month(i);
                            months.push(localeData.monthsShort(current));
                        }
                        for (let i = start; i < end; i++) {
                            monthOptions.push(
                                <Select.Option key={i} value={i} className="month-item">
                                    {months[i]}
                                </Select.Option>,
                            );
                        }
                        const year = value.year();
                        const month = value.month();
                        const options = [];
                        for (let i = year - 10; i < year + 10; i += 1) {
                            options.push(
                                <Select.Option key={i} value={i} className="year-item">
                                    {i}
                                </Select.Option>,
                            );
                        }
                        return (
                            <div style={{ padding: 8 }} className={"flex flex-rows justify-between"}>
                                <Row gutter={8}>
                                    <Col>
                                        <Select
                                            size="middle"
                                            popupMatchSelectWidth={false}
                                            className="my-year-select"
                                            value={year}
                                            onChange={newYear => {
                                                const now = value.clone().year(newYear);
                                                onChange(now);
                                            }}
                                        >
                                            {options}
                                        </Select>
                                    </Col>
                                    <Col>
                                        <Select
                                            size="middle"
                                            popupMatchSelectWidth={false}
                                            value={month}
                                            onChange={newMonth => {
                                                const now = value.clone().month(newMonth);
                                                onChange(now);
                                            }}
                                        >
                                            {monthOptions}
                                        </Select>
                                    </Col>
                                    <Col>
                                        <Button onClick={() => {
                                            const now = dayjs();
                                            setCurrentDate(now);
                                            onChange(now);
                                        }}>
                                            <Typography.Text>Today</Typography.Text>
                                        </Button>
                                    </Col>
                                </Row>
                                <div>
                                    <Typography.Title level={3}>{value.localeData().months()[value.month()]} - {value.year()}</Typography.Title>
                                </div>
                            </div>
                        );
                    }}
                />
            </Spin>
        </div>
    );
}