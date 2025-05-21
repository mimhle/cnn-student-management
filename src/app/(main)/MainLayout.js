"use client";

import {
    BookOutlined, CheckCircleOutlined, InfoCircleOutlined, LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Divider, Layout, Menu, theme } from "antd";
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
                label: <div className="flex flex-col p-1 px-4 justify-center">
                    <span className="w-fit h-fit m-auto leading-none">{cls.classSubjectId}</span>
                    <span className="w-fit h-fit m-auto leading-4 overflow-y-visible overflow-x-hidden overflow-ellipsis text-xs opacity-80">{cls.subjectName}</span>
                </div>,
            })));
            setAttendance(data.map((cls) => ({
                key: `/attendance/${cls.classSubjectId}`,
                label: <div className="flex flex-col p-1 px-4 justify-center">
                    <span className="w-fit h-fit m-auto leading-none">{cls.classSubjectId}</span>
                    <span className="w-fit h-fit m-auto leading-4 overflow-y-visible overflow-x-hidden overflow-ellipsis text-xs opacity-80">{cls.subjectName}</span>
                </div>,
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
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                itemPaddingInline: 0,
                                darkSubMenuItemBg: "rgba(0, 0, 0,0)",
                            },
                        },
                    }}
                >
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
                                key: '/info',
                                icon: <InfoCircleOutlined />,
                                label: 'Info',
                            },
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
                </ConfigProvider>
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