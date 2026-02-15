"use client";

import { AccountDB } from "@/app/lib/offline-apps/modules/account/account.schema";
import { FamFinDB } from "@/app/lib/offline-apps/modules/famfin/famfin.schema";

export interface OfflineDB extends AccountDB, FamFinDB { }
