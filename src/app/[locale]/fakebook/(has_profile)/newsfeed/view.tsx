"use client";

import { FAKEBOOK_URL } from "@/app/lib/url_paths";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useFakebookStore } from "@/app/(module)/(md_fakebook)/stores/fakebook-store";
import { postService } from "@/app/(module)/(md_fakebook)/services/post.service";
import { getActiveProfileId } from "@/app/(module)/(md_fakebook)/lib/actions";
import { profileService } from "@/app/(module)/(md_fakebook)/services/profile.service";
import Posts from "@/app/(module)/(md_fakebook)/ui/newsfeed/posts";
import { PostsSekeleton } from "@/app/(module)/(md_fakebook)/ui/skeletons";
import PostItemComments from "@/app/(module)/(md_fakebook)/ui/newsfeed/post-item-comments";
import PostCreate from "@/app/(module)/(md_fakebook)/ui/newsfeed/post-create";

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
