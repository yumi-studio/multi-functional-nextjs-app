"use client";

import { getActiveProfileId } from "@/app/lib/fakebook/actions";
import { FAKEBOOK_PROFILE_URL, FAKEBOOK_URL } from "@/app/lib/url_paths";
import { postService } from "@/app/services/fakebook/post.service";
import { profileService } from "@/app/services/fakebook/profile.service";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import PostCreate from "@/app/ui/fakebook/newsfeed/post-create";
import PostCreateFake from "@/app/ui/fakebook/newsfeed/post-create-fake";
import PostItemComments from "@/app/ui/fakebook/newsfeed/post-item-comments";
import Posts from "@/app/ui/fakebook/newsfeed/posts";

import { PostsSekeleton } from "@/app/ui/fakebook/skeletons";
import { useRouter } from "@/i18n/navigation";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import { Suspense, useEffect, useState } from "react";

export default function View() {
  const [loading, setLoading] = useState(true);
  const activeProfile = useFakebookStore(state => state.activeProfile);
  const setActiveProfile = useFakebookStore(state => state.setActiveProfile);
  const setPosts = useFakebookStore(state => state.setPosts);
  const router = useRouter();

  const reloadPosts = async () => {
    const { success, data } = await postService.getAllPosts();
    if (success && data) {
      setPosts(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    (async function () {
      const activeProfileId = await getActiveProfileId();
      if (activeProfileId) {
        const profileRes = await profileService.getProfile();
        if (profileRes.success && profileRes.data) {
          setActiveProfile(profileRes.data);
        }
      } else {
        router.push(FAKEBOOK_URL);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeProfile?.id) {
      reloadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile?.id]);

  if (activeProfile === null) return;

  return (
    <>
      <div className="gap-3 w-full h-full relative">
        <div className="posts flex-auto pb-3">
          <Posts />
          {loading && (
            <PostsSekeleton />
          )}
        </div>
      </div>
      <PostItemComments />
      <PostCreate />
    </>
  );
}
