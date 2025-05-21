"use client";

import {
    BookOutlined, CheckCircleOutlined, LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation'
import { getAllClasses_Lecture, getAllClasses_Student } from "@/app/actions";

const { Header, Sider, Content } = Layout;

export default function MainSider({ children, name }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [classes, setClasses] = useState([]);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const getAllClasses = localStorage.getItem("user") === "Student" ? getAllClasses_Student : getAllClasses_Lecture;

        getAllClasses(localStorage.getItem("token")).then((data) => {
            setClasses(data.map((cls) => ({
                key: `/classes/${cls.classSubjectId}`,
                label: cls.classSubjectId,
            })));
            setAttendance(data.map((cls) => ({
                key: `/attendance/${cls.classSubjectId}`,
                label: cls.classSubjectId,
            })));
        });
    }, []);

    return (
        <Layout className="!min-h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical text-white w-full text-center text-lg">
                    LOGO
                </div>
                <Divider className="!border-white"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[`/${pathname.split('/')[1]}`, ...(["classes", "attendance"].includes(pathname.split('/')[1]) ? [pathname.split('/').slice(0, 3).join('/')] : [])]}
                    defaultOpenKeys={[...(["classes", "attendance"].includes(pathname.split('/')[1]) ? [`/${pathname.split('/')[1]}`] : [])]}
                    onClick={(item) => {
                        router.push(`${item.key}`)
                    }}
                    items={[
                        {
                            key: '/attendance',
                            icon: <CheckCircleOutlined />,
                            label: 'Attendance',
                            children: attendance,
                        },
                        {
                            key: '/classes',
                            icon: <BookOutlined />,
                            label: 'Classes',
                            children: classes,
                        },

                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} className="flex flex-row justify-between">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Header className="flex justify-between items-center !bg-transparent">
                        <div className="text-2xl font-bold">
                            Welcome {name}&nbsp;
                        </div>
                        <Button type="default" onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/login";
                        }}>Log out <LogoutOutlined /></Button>
                    </Header>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}