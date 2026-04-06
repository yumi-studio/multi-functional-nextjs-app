"use server";

import { cookies } from 'next/headers';

export const getActiveProfileId = async () => {
    const profileId = (await cookies()).get('fakebook_profile_active')?.value ?? null;
    return profileId
}
