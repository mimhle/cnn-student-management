"use server";

import { redirect } from 'next/navigation'

export default async function Home() {
    redirect('/info');

    return null;
}
