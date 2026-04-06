"use client";

import { SubmitEvent, useEffect } from "react";
import { Conversation, Message, User } from "../../../lib/types";
import {
  createConversation as createConversationService,
  deleteConversation as deleteConversationService,
  fetchAllConversations,
} from "../../../lib/services/conversation.service";
import { fetchParticipantsByConversationId } from "../../../lib/services/participant.service";
import { fetchAllUsers, registerUser } from "../../../lib/services/user.service";
import { toast } from "react-toastify";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { create } from "zustand";

type UserStoreProps = {
  users: User[];
  conversations: Conversation[];
  messages: Message[];
  conversationParticipantIds: Record<string, string[]>;
  setUsers: (users: User[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (conversationId: string) => void;
  setConversationParticipantIds: (conversationId: string, participantIds: string[]) => void;
  addMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
  reloadUserList: () => Promise<void>;
  reloadConversationList: () => Promise<void>;
}

const useStore = create<UserStoreProps>((set) => ({
  users: [],
  conversations: [],
  messages: [],
  conversationParticipantIds: {},
  setUsers: (users) => set({ users }),
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) => set((state) => ({ conversations: [conversation, ...state.conversations] })),
  removeConversation: (conversationId) => set((state) => ({
    conversations: state.conversations.filter((conversation) => conversation.id !== conversationId),
    conversationParticipantIds: Object.fromEntries(
      Object.entries(state.conversationParticipantIds).filter(([id]) => id !== conversationId)
    ),
    messages: state.messages.filter((message) => message.conversationId !== conversationId),
  })),
  setConversationParticipantIds: (conversationId, participantIds) => set((state) => ({
    conversationParticipantIds: {
      ...state.conversationParticipantIds,
      [conversationId]: participantIds,
    },
  })),
  addMessage: (message) => set((state) => ({ messages: [message, ...state.messages] })),
  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter((message) => message.id !== messageId),
  })),
  reloadUserList: async () => {
    const data = await fetchAllUsers();
    console.log('Fetched users:', data);
    set({ users: data });
  },
  reloadConversationList: async () => {
    const conversations = await fetchAllConversations();
    const participantEntries = await Promise.all(
      conversations.map(async (conversation) => {
        const participants = await fetchParticipantsByConversationId(conversation.id);
        return [conversation.id, participants.map((participant) => participant.userId)] as const;
      })
    );

    set({
      conversations,
      conversationParticipantIds: Object.fromEntries(participantEntries),
    });
  },
}));

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <section className="my-3 p-3 border-2">
      <h2 className="font-bold border-2 p-2 mb-2 text-center">{title}</h2>
      {children}
    </section>
  )
}

const SectionUserManagement = () => {
  const { users, reloadUserList } = useStore();

  const handleCreateUser = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const display_name = formData.get('display_name') as string;
    const password = formData.get('password') as string;
    try {
      const newUserId = await registerUser({ email, display_name, password });
      if (!newUserId) throw new Error('User creation failed');
      toast.success(`User created with ID: ${newUserId}`);
      reloadUserList();
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <Section title="User management">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h2 className="text-center font-bold border-2 p-2 mb-2">Create user</h2>
          <div className="border-2 p-2">
            <form className="flex flex-col gap-2" onSubmit={handleCreateUser}>
              <input className="border-2 p-1" type="email" name="email" placeholder="Email" />
              <input className="border-2 p-1" type="text" name="display_name" placeholder="Display Name" />
              <input className="border-2 p-1" type="text" name="password" placeholder="Password" />
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-md">Create</button>
            </form>
          </div>
        </div>
        <div className="flex-2">
          <h2 className="text-center font-bold border-2 p-2 mb-2">User list</h2>
          <div className="border-2 p-2 max-h-96 overflow-auto">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Display Name</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell sx={{ color: "white" }}>{user.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
                    <TableCell sx={{ color: "white" }}>{user.displayName}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      <div className="flex flex-col gap-2">
                        <Button variant="contained" color="primary" size="small">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="contained" color="error" size="small" className="ml-2">
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Section>
  )
}

const SectionConversationManagement = () => {
  const {
    users,
    conversations,
    conversationParticipantIds,
    addConversation,
    removeConversation,
    setConversationParticipantIds,
    reloadConversationList,
  } = useStore();

  const handleCreateConversation = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = `${formData.get('name') ?? ''}`.trim();
    const avatarUrl = `${formData.get('avatar_url') ?? ''}`.trim();
    const participantIds = formData.getAll('participant_ids').map(String);

    if (!name) {
      toast.error('Conversation name is required');
      return;
    }

    if (participantIds.length === 0) {
      toast.error('Select at least one participant');
      return;
    }

    try {
      const result = await createConversationService({
        name,
        avatarUrl: avatarUrl || null,
        participantUserIds: participantIds,
      });

      if (!result) {
        throw new Error('Conversation creation failed');
      }

      addConversation(result.conversation);
      setConversationParticipantIds(
        result.conversation.id,
        result.participants.map((participant) => participant.userId)
      );
      toast.success('Conversation created');
      e.currentTarget.reset();
    } catch {
      toast.error('Failed to create conversation');
    }
  };

  const resolveUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.displayName ?? userId;
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const deletedConversation = await deleteConversationService(conversationId);

      if (!deletedConversation) {
        throw new Error('Conversation deletion failed');
      }

      removeConversation(conversationId);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Failed to delete conversation');
      await reloadConversationList();
    }
  };

  return (
    <Section title="Conversation management">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h2 className="text-center font-bold border-2 p-2 mb-2">Create conversation</h2>
          <div className="border-2 p-2">
            <form className="flex flex-col gap-2" onSubmit={handleCreateConversation}>
              <input className="border-2 p-1" type="text" name="name" placeholder="Conversation Name" />
              <input className="border-2 p-1" type="text" name="avatar_url" placeholder="Avatar URL (optional)" />
              <div className="border-2 p-2">
                <div className="font-bold mb-2">Participants</div>
                <div className="flex flex-col gap-1 max-h-40 overflow-auto">
                  {users.length > 0 ? users.map((user) => (
                    <label key={user.id} className="flex items-center gap-2">
                      <input type="checkbox" name="participant_ids" value={user.id} />
                      <span>{user.displayName} ({user.email})</span>
                    </label>
                  )) : (
                    <div>No users available. Create users first.</div>
                  )}
                </div>
              </div>
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-md">Create</button>
            </form>
          </div>
        </div>
        <div className="flex-2">
          <h2 className="text-center font-bold border-2 p-2 mb-2">Conversation list</h2>
          <div className="border-2 p-2 max-h-96 overflow-auto">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Participants</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {conversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell sx={{ color: "white" }}>{conversation.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{conversation.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {(conversationParticipantIds[conversation.id] ?? []).map(resolveUserName).join(', ') || '-'}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>{new Date(conversation.createdAt).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteConversation(conversation.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Section>
  )
}

const SectionMessageManagement = () => {
  const { users, conversations, messages, addMessage, removeMessage } = useStore();

  const handleCreateMessage = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const conversationId = `${formData.get('conversation_id') ?? ''}`;
    const userId = `${formData.get('user_id') ?? ''}`;
    const type = `${formData.get('type') ?? 'text'}`.trim();
    const content = `${formData.get('content') ?? ''}`.trim();
    const replyMessageId = `${formData.get('reply_message_id') ?? ''}`.trim();

    if (!conversationId || !userId || !content || !type) {
      toast.error('Conversation, sender, type, and content are required');
      return;
    }

    addMessage({
      id: crypto.randomUUID(),
      conversationId,
      userId,
      content,
      type,
      replyMessageId: replyMessageId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    toast.success('Message created');
    e.currentTarget.reset();
  };

  const resolveConversationName = (conversationId: string) => {
    return conversations.find((conversation) => conversation.id === conversationId)?.name ?? conversationId;
  };

  const resolveUserName = (userId: string) => {
    return users.find((user) => user.id === userId)?.displayName ?? userId;
  };

  return (
    <Section title="Message management">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h2 className="text-center font-bold border-2 p-2 mb-2">Create message</h2>
          <div className="border-2 p-2">
            <form className="flex flex-col gap-2" onSubmit={handleCreateMessage}>
              <select className="border-2 p-1" name="conversation_id" defaultValue="">
                <option value="" disabled>Select conversation</option>
                {conversations.map((conversation) => (
                  <option key={conversation.id} value={conversation.id}>{conversation.name}</option>
                ))}
              </select>
              <select className="border-2 p-1" name="user_id" defaultValue="">
                <option value="" disabled>Select sender</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.displayName}</option>
                ))}
              </select>
              <input className="border-2 p-1" type="text" name="type" defaultValue="text" placeholder="Type" />
              <textarea className="border-2 p-1 min-h-28" name="content" placeholder="Message content" />
              <select className="border-2 p-1" name="reply_message_id" defaultValue="">
                <option value="">No reply target</option>
                {messages.map((message) => (
                  <option key={message.id} value={message.id}>
                    {resolveUserName(message.userId)}: {message.content?.slice(0, 40)}
                  </option>
                ))}
              </select>
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-md">Create</button>
            </form>
          </div>
        </div>
        <div className="flex-2">
          <h2 className="text-center font-bold border-2 p-2 mb-2">Message list</h2>
          <div className="border-2 p-2 max-h-96 overflow-auto">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Conversation</TableCell>
                  <TableCell>Sender</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Content</TableCell>
                  <TableCell>Reply To</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell sx={{ color: "white" }}>{message.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{resolveConversationName(message.conversationId)}</TableCell>
                    <TableCell sx={{ color: "white" }}>{resolveUserName(message.userId)}</TableCell>
                    <TableCell sx={{ color: "white" }}>{message.type}</TableCell>
                    <TableCell sx={{ color: "white" }}>{message.content}</TableCell>
                    <TableCell sx={{ color: "white" }}>{message.replyMessageId ?? '-'}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => removeMessage(message.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Section>
  );
}

const DevPage = () => {
  const { reloadUserList, reloadConversationList } = useStore();

  useEffect(() => {
    const init = setTimeout(() => {
      reloadUserList();
      reloadConversationList();
    }, 100);

    return () => clearTimeout(init);
  }, [reloadConversationList, reloadUserList]);

  return (
    <div className="w-10/12 h-full mx-auto">
      <div className="my-3 mx-auto w-full font-bold text-center p-2 border-2">Freechat Dev Page</div>
      <SectionUserManagement />
      <SectionConversationManagement />
      <SectionMessageManagement />
    </div>
  )
}

export default DevPage;
