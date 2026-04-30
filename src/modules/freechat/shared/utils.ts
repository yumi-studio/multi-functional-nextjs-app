import { Participant } from "@/modules/freechat/shared/types";

export const getParticipantName = (participant: Participant | null | undefined): string => {
  if (!participant) return 'Unknown';
  return participant.nickname ?? participant.user?.displayName ?? 'Unknown';
}

export const alertInDevelop = () => {
  'use client';
  alert('This feature is in development!');
}