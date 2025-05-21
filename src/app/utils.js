"use client";

import { message } from "antd";

export function getCurrentClass(schedules, timestamp) {
    const now = new Date(timestamp);
    const result = [];

    for (const schedule of schedules) {
         // Parse timeSlot "HH:mm-HH:mm"
        const [startStr, endStr] = schedule.timeSlot.split("-");
        const [startH, startM] = startStr.split(":").map(Number);
        const [endH, endM] = endStr.split(":").map(Number);

        const startTime = new Date(now);
        startTime.setHours(startH, startM, 0, 0);
        const endTime = new Date(now);
        endTime.setHours(endH, endM, 0, 0);

        if (now >= startTime && now <= endTime) {
            result.push(schedule);
        }
    }
    return result; // No current class
}

export function scoreColor(score) {
    if (score >= 7) {
        return "green";
    } else if (score >= 4) {
        return "orange";
    } else {
        return "red";
    }
}

export function useMessage() {
    const [messageApi, contextHolder] = message.useMessage({
        maxCount: 3,
    });
    const error = (message, onFulfilled) => {
        messageApi.open({
            type: "error",
            content: message,
        }).then(() => {
            if (onFulfilled) {
                onFulfilled();
            }
        });
    };

    const success = (message, onFulfilled) => {
        messageApi.open({
            type: "success",
            content: message,
        }).then(() => {
            if (onFulfilled) {
                onFulfilled();
            }
        });
    };

    const loading = (message, onFulfilled) => {
        messageApi.open({
            type: "loading",
            content: message,
            duration: 0
        }).then(() => {
            if (onFulfilled) {
                onFulfilled();
            }
        });
        return messageApi.destroy;
    };

    return {
        messageApi: messageApi,
        contextHolder: contextHolder,
        error: error,
        success: success,
        loading: loading
    };
}