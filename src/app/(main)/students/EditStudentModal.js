"use client";

import { Form, Input, InputNumber, Modal } from "antd";
import { useEffect, useState } from "react";
import { getStudentEnrollment, setStudentEnrollmentScore } from "@/app/actions";

export default function EditStudentModal({ classId, studentId, open, onClose, onSuccess }) {
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