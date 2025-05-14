"use client";

import {
    BookOutlined, CheckCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation'
import { getAllClasses } from "@/app/actions";

const { Header, Sider, Content } = Layout;

export default function MainSider({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [classes, setClasses] = useState([]);

    useEffect(() => {
        getAllClasses().then((data) => {
            setClasses(data.classes.map((cls) => ({
                key: `/classes/${cls.id}`,
                label: cls.id,
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
                    defaultSelectedKeys={[`/${pathname.split('/')[1]}`, ...(pathname.split('/')[1] === "classes" ? [pathname] : [])]}
                    defaultOpenKeys={[...(pathname.split('/')[1] === "classes" ? [`/${pathname.split('/')[1]}`] : [])]}
                    onClick={(item) => {
                        router.push(`${item.key}`)
                    }}
                    items={[
                        {
                            key: '/attendance',
                            icon: <CheckCircleOutlined />,
                            label: 'Attendance',
                        },
                        {
                            key: '/students',
                            icon: <UserOutlined />,
                            label: 'Students',
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
                <Header style={{ padding: 0, background: colorBgContainer }}>
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