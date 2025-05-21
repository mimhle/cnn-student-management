"use client";

import { use, useEffect, useState } from "react";
import { Button, Calendar, Col, Row, Select, Spin, Tag, Typography } from "antd";
import { useMessage } from "@/app/utils";
import { getSchedules } from "@/app/actions";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function Page({ params }) {
    params = use(params);
    const router = useRouter();
    const { contextHolder, success, error } = useMessage();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const onClickDay = (date) => {
        setCurrentDate(date);
    };

    const cellRender = (current, info) => {
        if (info.type === "date") {
            const dateCellRender = c => {
                const currentSchedule = schedule.find(item => item.date.isSame(c, "date"));

                return currentSchedule ? <div className={"flex flex-col gap-2"}>
                    <Tag color="green" className="w-fit text-center">
                        {currentSchedule.timeSlot}
                    </Tag>
                    <Button className={"!w-fit !px-2"} type="primary" onClick={() => {
                        router.push(`./${params.id}/${currentSchedule.scheduleId}`);
                    }}>
                        Check attendance
                    </Button>
                </div> : null;
            };
            return dateCellRender(current);
        }
        return info.originNode;
    };

    useEffect(() => {
        getSchedules(localStorage.getItem("token"), params.id).then((data) => {
            setSchedule(data.map((item) => ({
                scheduleId: item.scheduleId,
                date: dayjs(item.date),
                timeSlot: item.timeSlot,
            })));
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {contextHolder}
            <h1 className="text-3xl font-bold underline">
                Attendance {params.id}
            </h1>
            <Spin spinning={loading}>
                <Calendar
                    value={currentDate}
                    onChange={onClickDay}
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
                            <div style={{ padding: 8 }}>
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
                            </div>
                        );
                    }}
                />;
            </Spin>
        </div>
    );
}