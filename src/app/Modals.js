"use client";

import {
    Button,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm, Popover,
    Spin,
    Table,
    Typography
} from "antd";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
    createSchedule,
    deleteSchedule,
    getAllLecturerInfo,
    getAllStudentInfo, getSchedules, getSchedulesByClass,
    getStudentEnrollment, setLecturerInfo,
    setPassword, setSchedule,
    setStudentEnrollmentScore,
    setStudentInfo
} from "@/app/actions";
import dayjs from "dayjs";
import { DeleteOutlined, PlusCircleOutlined, WarningOutlined, WarningTwoTone } from "@ant-design/icons";
import { useMessage } from "@/app/utils";
import { UserContext } from "@/app/(main)/context";

export function EditStudentScoreModal({ classId, studentId, open, onClose, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [loading, setLoading] = useState(true);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(() => {
            setStudentEnrollmentScore(
                localStorage.getItem("token"),
                enrollmentId,
                form.getFieldValue("midtermScore"),
                form.getFieldValue("finalScore"),
            ).then(() => {
                setIsModalOpen(false);
                onSuccess?.();
                console.log(form);
            }).catch(() => {
            });
        }).catch(() => {
            // Handle validation errors
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (open) {
            showModal();
            if (form) {
                getStudentEnrollment(localStorage.getItem("token"), studentId).then((data) => {
                    setLoading(false);
                    data = data.find(enrollment => enrollment.classSubjectId === classId);
                    form.setFieldsValue({
                        midtermScore: data.midtermScore,
                        finalScore: data.finalScore,
                    });
                    setEnrollmentId(data.enrollmentId);
                });
            }
        }
    }, [open, form, studentId]);

    useEffect(() => {
        if (!isModalOpen) onClose?.();
    }, [onClose, isModalOpen]);

    return (
        <Modal
            title={`Edit ${studentId}`}
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnHidden={true}
        >
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={form}
                preserve={false}
            >
                <Form.Item
                    label="Midterm score"
                    name="midtermScore"
                    rules={[{ required: true, message: "Please input your midterm score!" }]}
                >
                    <InputNumber min={0} max={10} step="0.01"/>
                </Form.Item>
                <Form.Item
                    label="Final score"
                    name="finalScore"
                    rules={[{ required: true, message: "Please input your final score!" }]}
                >
                    <InputNumber min={0} max={10} step="0.01"/>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export function StudentEditModal({ studentId, open, onClose, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(() => {
            return setStudentInfo(
                localStorage.getItem("token"),
                studentId,
                {
                    fullName: form.getFieldValue("name"),
                    phone: form.getFieldValue("phoneNumber"),
                    dateOfBirth: form.getFieldValue("dateOfBirth").format("YYYY-MM-DDT00:00:00Z"),
                    address: form.getFieldValue("address"),
                }
            ).then(() => {
                if (form.getFieldValue("newPassword") && form.getFieldValue("currentPassword")) {
                    return setPassword(
                        localStorage.getItem("token"),
                        form.getFieldValue("currentPassword"),
                        form.getFieldValue("newPassword"),
                    ).then((r) => {
                        if (r === "Old password incorrect") {
                            form.setFields([
                                {
                                    name: "currentPassword",
                                    errors: [r],
                                },
                            ]);
                        } else {
                            setIsModalOpen(false);
                            onSuccess?.();
                        }
                    });
                } else {
                    setIsModalOpen(false);
                    onSuccess?.();
                }
            });
        }).catch((e) => {
            // Handle validation errors
            console.log(e);
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (open) {
            showModal();
            getAllStudentInfo(localStorage.getItem("token"), studentId).then((data) => {
                console.log(data);
                form.setFieldsValue({
                    name: data.fullName,
                    email: data.email,
                    phoneNumber: data.phone,
                    dateOfBirth: dayjs(data.dateOfBirth),
                    address: data.address,
                });
                setLoading(false);
            });
        }
    }, [open]);

    useEffect(() => {
        if (!isModalOpen) onClose?.();
    }, [onClose, isModalOpen]);

    return (
        <Modal
            title={`Update ${studentId}`}
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnHidden={true}
            centered
        >
            <Spin spinning={loading}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    form={form}
                    preserve={false}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please input your name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Phone number"
                        name="phoneNumber"
                        rules={[{ required: true, message: "Please input your phone number!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: "Please select date of birth!", type: "object" }]}
                    >
                        <DatePicker
                            format='DD/MM/YYYY'
                            placeholder='DD/MM/YYYY'
                            allowClear={false}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Please input your address!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        label="New password"
                        name="newPassword"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm password"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("The two passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Current password"
                        name="currentPassword"
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}

export function LecturerEditModal({ lecturerId, open, onClose, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(() => {
            return setLecturerInfo(
                localStorage.getItem("token"),
                lecturerId,
                {
                    fullName: form.getFieldValue("name"),
                    phoneNumber: form.getFieldValue("phoneNumber"),
                    dateOfBirth: form.getFieldValue("dateOfBirth").format("YYYY-MM-DDT00:00:00Z"),
                    address: form.getFieldValue("address"),
                    department: form.getFieldValue("department"),
                    academicTitle: form.getFieldValue("academicTitle"),
                    degree: form.getFieldValue("degree"),
                    email: form.getFieldValue("email"),
                }
            ).then((r) => {
                console.log(r);
                if (form.getFieldValue("newPassword") && form.getFieldValue("currentPassword")) {
                    return setPassword(
                        localStorage.getItem("token"),
                        form.getFieldValue("currentPassword"),
                        form.getFieldValue("newPassword"),
                    ).then((r) => {
                        if (r === "Old password incorrect") {
                            form.setFields([
                                {
                                    name: "currentPassword",
                                    errors: [r],
                                },
                            ]);
                        } else {
                            setIsModalOpen(false);
                            onSuccess?.();
                        }
                    });
                } else {
                    setIsModalOpen(false);
                    onSuccess?.();
                }
            });
        }).catch((e) => {
            // Handle validation errors
            console.log(e);
        });
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (open) {
            showModal();
            getAllLecturerInfo(localStorage.getItem("token"), lecturerId).then((data) => {
                console.log(data);
                form.setFieldsValue({
                    name: data.fullName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    dateOfBirth: dayjs(data.dateOfBirth),
                    department: data.department,
                    academicTitle: data.academicTitle,
                    degree: data.degree,
                });
                setLoading(false);
            });
        }
    }, [open]);
    useEffect(() => {
        if (!isModalOpen) onClose?.();
    }, [onClose, isModalOpen]);

    return (
        <Modal
            title={`Update ${lecturerId}`}
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnHidden={true}
            centered
        >
            <Spin spinning={loading}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    form={form}
                    preserve={false}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please input your name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Phone number"
                        name="phoneNumber"
                        rules={[{ required: true, message: "Please input your phone number!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth"
                        rules={[{ required: true, message: "Please select date of birth!", type: "object" }]}
                    >
                        <DatePicker
                            format='DD/MM/YYYY'
                            placeholder='DD/MM/YYYY'
                            allowClear={false}
                        />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        label="New password"
                        name="newPassword"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Confirm password"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("The two passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Current password"
                        name="currentPassword"
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}

export function ChangeScheduleModal({ classId, open, onClose, onSuccess }) {
    const EditableContext = createContext(null);
    const { contextHolder, success, error } = useMessage();
    const user = useContext(UserContext);

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);

        useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={dataIndex !== "date" ? [{ required: true, message: `${title} is required.` }] :
                        [{ required: true, message: `${title} is required.`},
                            () => ({
                                validator(_, value) {
                                    if (dayjs(value, "DD/MM/YYYY", true).isValid()) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Invalid date format!"));
                                },
                            }),
                        ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
                </Form.Item>
            ) : (
                <Typography.Text className="block w-full cursor-pointer hover:border-2 hover:border-gray-500" onClick={toggleEdit}>{children}</Typography.Text>
            );
        }

        return <td className="!w-fit" {...restProps}>{childNode}</td>;
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataSource, setDataSource] = useState([]);


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        onSuccess?.();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (open) {
            showModal();
            getSchedulesByClass(localStorage.getItem("token"), classId).then((data) => {
                setDataSource(data.map((item) => ({
                    key: item.scheduleId,
                    date: dayjs(item.date).format("DD/MM/YYYY"),
                    timeSlot: item.timeSlot,
                    classSubjectId: item.classSubjectId,
                    lecturerId: item.lecturerId,
                    scheduleId: item.scheduleId,
                })).sort((a, b) => {
                    return dayjs(a.date, "DD/MM/YYYY").diff(dayjs(b.date, "DD/MM/YYYY")) || a.timeSlot.localeCompare(b.timeSlot);
                }));
            });
        }
    }, [open]);

    useEffect(() => {
        if (!isModalOpen) onClose?.();
    }, [onClose, isModalOpen]);

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => item.key === row.key);
        const oldData = newData[index];
        newData[index] = { ...newData[index], ...row };
        setDataSource(newData.sort((a, b) => {
            return dayjs(a.date, "DD/MM/YYYY").diff(dayjs(b.date, "DD/MM/YYYY")) || a.timeSlot.localeCompare(b.timeSlot);
        }));
        if (oldData.date !== row.date || oldData.timeSlot !== row.timeSlot) {
            setSchedule(
                localStorage.getItem("token"),
                row.scheduleId,
                {
                    date: dayjs(row.date, "DD/MM/YYYY").format("YYYY-MM-DDT00:00:00Z"),
                    timeSlot: row.timeSlot,
                    classSubjectId: row.classSubjectId,
                    lecturerId: row.lecturerId,
                }
            ).then(() => {
                success("Update successfully");
            }).catch(() => {
                error("Update failed");
            });
        }
    };
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            editable: true,
        },
        {
            title: 'Time slot',
            dataIndex: 'timeSlot',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm
                        title="Delete schedule"
                        description="Are you sure to delete this schedule?"
                        onConfirm={() => {
                            deleteSchedule(
                                localStorage.getItem("token"),
                                record.scheduleId
                            ).then(() => {
                                const newData = [...dataSource];
                                setDataSource(newData.filter((item) => item.key !== record.key));
                                success("Delete successfully");
                            }).catch(() => {
                                error("Delete failed");
                            });
                        }}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                        icon={<WarningTwoTone twoToneColor="red"/>}
                    >
                        <Button
                            color="red"
                            variant="link"
                            size="small"
                        >
                            <DeleteOutlined />Delete
                        </Button>
                    </Popconfirm>
                ) : null,
        },
    ];
    const mergedColumns = columns.map(col => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const AddNewForm = ({classId, lectureId}) => {
        const [form] = Form.useForm();

        return (
            <Form
                name="addNew"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                preserve={false}
                form={form}
                initialValues={{
                    classId: classId,
                    lectureId: lectureId
                }}
            >
                <Form.Item
                    label="Class ID"
                    name="classId"
                    rules={[{ required: true, message: "Please input your class ID!" }]}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    label="Lecture ID"
                    name="lectureId"
                    rules={[{ required: true, message: "Please input your lecture ID!" }]}
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: "Please select date!", type: "object" }]}
                >
                    <DatePicker
                        format='DD/MM/YYYY'
                        placeholder='DD/MM/YYYY'
                        allowClear={false}
                    />
                </Form.Item>
                <Form.Item
                    label="Time slot"
                    name="timeSlot"
                    rules={[{ required: true, message: "Please input your time slot!" }]}
                >
                    <Input />
                </Form.Item>
                <Button size="middle" className="w-full" type="primary" htmlType="submit" onClick={() => {
                    form.validateFields().then(() => {
                        createSchedule(
                            localStorage.getItem("token"),
                            {
                                date: dayjs(form.getFieldValue("date"), "DD/MM/YYYY").format("YYYY-MM-DDT00:00:00Z"),
                                timeSlot: form.getFieldValue("timeSlot"),
                                classSubjectId: classId,
                                lecturerId: lectureId,
                            }
                        ).then(() => {
                            const newData = {
                                key: dataSource.length + 1,
                                date: form.getFieldValue("date").format("DD/MM/YYYY"),
                                timeSlot: form.getFieldValue("timeSlot"),
                            };
                            setDataSource([...dataSource, newData].sort((a, b) => {
                                return dayjs(a.date, "DD/MM/YYYY").diff(dayjs(b.date, "DD/MM/YYYY")) || a.timeSlot.localeCompare(b.timeSlot);
                            }));
                            success("Add successfully");
                            form.resetFields();
                        }).catch((e) => {
                            error("Add failed");
                        });
                    }).catch(() => {});
                }}>
                    Add
                </Button>
            </Form>
        );
    }

    return <Modal
        title={`Update schedule ${classId}`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnHidden={true}
        centered
        width="800px"
        footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
                Ok
            </Button>,
        ]}
    >
        {contextHolder}
        <Table
            components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            }}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={mergedColumns}
            size="small"
            pagination={false}
        />
        <Popover content={<div>
            <AddNewForm classId={classId} lectureId={user.userId}/>
        </div>} title="Add new schedule" trigger="click" destroyOnHidden>
            <Button type="primary" className="mt-2">
                <PlusCircleOutlined />Add
            </Button>
        </Popover>
    </Modal>;
}