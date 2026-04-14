"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Link from "next/link";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faDoorOpen } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/auth.context";
import { FREECHAT_LOGIN_URL, FREECHAT_ROOM_URL } from "../../lib/url";
import { logout } from "../../actions";
import { Conversation } from "../../lib/types";
import { getJoinedConversations } from "../../actions/conversations";

const View = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    getJoinedConversations()
      .then(data => setConversations(data))
      .catch(err => toast.error(err.message));
  }, []);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-1/2 text-center">
      <div className="flex w-full max-w-3xl items-center justify-center">
        {user ? (
          <>
            <span>Welcome, {user?.displayName}</span>
            <form action={logout} className="ml-2">
              <Button type="submit" size="small" variant="outlined" color="error">Logout</Button>
            </form>
          </>
        ) : (
          <>
            <span>Welcome to Freechat</span>
            <Link href={FREECHAT_LOGIN_URL} className="ml-2">
              <Button type="button" size="small" variant="outlined" color="primary">Login</Button>
            </Link>
          </>
        )}
      </div>

      {user && (
        <div className="w-full my-3 max-w-3xl max-h-96 overflow-auto border-2 border-(--fc-border)">
          <h4 className="px-2 py-1 uppercase">Chat List</h4>
          {conversations && conversations.map(conv => (
            <Link key={conv.id} href={FREECHAT_ROOM_URL.replace("{{id}}", conv.id)}
              className="border-b border-b-(--fc-border) px-2 py-1 mb-2 flex items-center justify-between">
              <FontAwesomeIcon icon={faArrowRight} />
              <span>{conv.name}</span>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default View;
