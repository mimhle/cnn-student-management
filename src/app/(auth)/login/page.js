"use client";

import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { login } from "@/app/actions";
import { useMessage } from "@/app/utils";
import { useState } from "react";

const {Title} = Typography;

export default function Page() {
    const { contextHolder, success, error } = useMessage();
    const [loading, setLoading] = useState(false);

    const onFinish = values => {
        setLoading(true);
        login(values.username, values.password).then(res => {
            const token = res.token;
            localStorage.setItem("token", token);
            window.location.reload();
        }).catch(err => {
            error(err.message);
        }).finally(() => {
            setLoading(false);
        });
    };
    const onFinishFailed = errorInfo => {
        console.log("Failed:", errorInfo);
    };

    return <div className="w-fit p-4 m-auto h-screen flex flex-col justify-center">
        {contextHolder}
        <Card className="w-fit h-fit">
            <Title level={3}>Login</Title>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please input your username!" }]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>;
}