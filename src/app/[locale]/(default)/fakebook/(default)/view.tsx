"use client";

import { Profile } from "@/app/lib/fakebook/definitions";
import { FAKEBOOK_NEWSFEED_URL } from "@/app/lib/url_paths";
import { profileService } from "@/app/services/fakebook/profile.service";
import { useFakebookStore } from "@/app/stores/fakebook-store";
import { useRouter } from "@/i18n/navigation";
import { faArrowRight, faRotateBack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function View() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const setActiveProfile = useFakebookStore(state => state.setActiveProfile);
  const router = useRouter();

  const reloadProfiles = async () => {
    const result = await profileService.getProfiles();
    if (result.success && result.data) {
      setProfiles(() => result.data ?? []);
    }
  }

  const onProfileSelect = async (profile: Profile) => {
    if (selectedProfile && selectedProfile.id === profile.id) {
      // Same profile selected, trigger switch profile and go to newsfeed
      const result = await profileService.switchProfile({ id: profile.id });
      if (result.success) {
        setActiveProfile(profile);
        router.push(FAKEBOOK_NEWSFEED_URL);
      }
    }

    setSelectedProfile(profile);
  }

  const onProfileCreate = async () => {
    const result = await profileService.createProfile({
      name: newProfileName
    });

    if (result.success) {
      reloadProfiles();
    }

    setNewProfileName("");
  }

  useEffect(() => {
    (async () => {
      reloadProfiles();
    })();
  }, []);

  return (
    <div className="bg-[rgba(0,0,0,0.1)] w-full h-full m-auto rounded-md overflow-auto backdrop-blur-md">
      <div className="text-center bg-white rounded-b-md py-2">
        {/* <span>Profiles of <b>{userDetail?.firstName} {userDetail?.lastName}</b></span> */}
        <span><b>Select Profile</b></span>
      </div>
      <div className="p-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`border border-gray-500 ${selectedProfile?.id === profile.id ? "border-l-4" : ""}`
              + ` rounded-md bg-white p-2 mb-2 `}
            onClick={() => onProfileSelect(profile)}>
            <span>{profile.name}</span>
          </div>
        ))}
        <form className="flex bg-white border border-gray-500 rounded-md overflow-hidden">
          <input className="flex-auto p-2 outline-none"
            type="text" value={newProfileName} onChange={e => setNewProfileName(e.target.value)}
            placeholder="Enter new profile" />
          <Button type="button" variant="contained" className="rounded-none"
            onClick={() => onProfileCreate()}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </form>
      </div>
    </div>
  )
}
