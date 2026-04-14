import { Participant } from "./types";

export function getParticipantName (participant: Participant | null | undefined) {
  if (!participant) return 'Unknown';
  return participant.nickname ?? participant.user?.displayName ?? `Unknown user`;
}
