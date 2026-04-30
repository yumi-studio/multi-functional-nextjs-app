"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faUser } from "@fortawesome/free-solid-svg-icons";
import { UserDetail } from "@/app/lib/definitions";
import { useUserStore } from "@/app/stores/user-store";
import { cn } from "@/app/lib/utils";
import PageSection from "@/modules/core/view/ui/account/PageSection";
import { DefaultButton } from "@/modules/core/view/ui/Buttons";

type BasicInformationForm = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: UserDetail["gender"];
  bio: string;
  birthDate: string;
  avatar: string;
};

const DEFAULT_FORM: BasicInformationForm = {
  id: "",
  email: "",
  username: "",
  firstName: "",
  lastName: "",
  gender: 0,
  bio: "",
  birthDate: "",
  avatar: "",
};

const GENDER_OPTIONS: Array<{ label: string; value: UserDetail["gender"] }> = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
  { label: "Other", value: 2 },
];

const formatBirthDate = (birthDate?: Date) => {
  if (!birthDate) {
    return "";
  }

  const parsedDate = birthDate instanceof Date ? birthDate : new Date(birthDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
};

const mapUserDetailToForm = (userDetail: UserDetail | null): BasicInformationForm => {
  if (!userDetail) {
    return DEFAULT_FORM;
  }

  return {
    id: userDetail.id ?? "",
    email: userDetail.email ?? "",
    username: userDetail.username ?? "",
    firstName: userDetail.firstName ?? "",
    lastName: userDetail.lastName ?? "",
    gender: userDetail.gender ?? 0,
    bio: userDetail.bio ?? "",
    birthDate: formatBirthDate(userDetail.birthDate),
    avatar: (userDetail.avatar ?? "").trim(),
  };
};

const Label = ({ title }: { title: string }) => {
  return (
    <label className="block text-sm font-medium text-gray-900">{title}</label>
  )
}

const Input = ({ name, value, type, onChange }: { name: string; value: string | number; type?: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }) => {
  return type === "textarea" ? (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className={cn([
        "mt-1 w-full min-h-20 rounded-lg outline-0 border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition focus:border-gray-500"
      ])}
    />
  ) : (
    <input
      type={type || "text"}
      name={name}
      value={value}
      onChange={onChange}
      className={cn([
        "mt-1 w-full rounded-lg outline-0 border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition focus:border-gray-500"
      ])}
    />
  );
}

const Select = ({ name, value, onChange, options }: { name: string; value: string | number; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: Array<{ label: string; value: string | number }> }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={cn([
        "mt-1 w-full rounded-lg outline-0 border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition focus:border-gray-500"
      ])}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

const SectionBasicInformation = () => {
  const userDetail = useUserStore((state) => state.userDetail);
  const [form, setForm] = useState<BasicInformationForm>(DEFAULT_FORM);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const onChangeAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    avatarInputRef.current?.click();
  }

  const onAvatarInputChanged = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ?? [];
    if (files.length === 0) return;

    setForm((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(files[0]),
    }));
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "gender" ? Number(value) as UserDetail["gender"] : value,
    }));
  };

  const handleSave = async () => {

  }

  useEffect(() => {
    setForm(mapUserDetailToForm(userDetail));
  }, [userDetail]);

  return (
    <PageSection title="Basic Information">
      <form className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="h-56 w-56 flex items-center justify-center overflow-hidden rounded-lg bg-gray-200 relative" onClick={onChangeAvatarClick}>
            {form.avatar ? (
              <Image
                src={form.avatar}
                alt="Avatar"
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} fontSize="3rem" className="text-gray-700" />
            )}
            <div className={cn([
              "absolute left-0 bottom-0 right-0 h-auto bg-gray-700 text-center cursor-pointer py-2"
            ])}>
              <FontAwesomeIcon icon={faCamera} className="text-gray-50" />
            </div>
          </div>
          <input type="file" accept="image/*" ref={avatarInputRef} onChange={onAvatarInputChanged} hidden />
        </div>

        <div className="flex-auto grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label title="ID" />
            <Input name="id" value={form.id} onChange={handleInputChange} />
          </div>
          <div>
            <Label title="Email" />
            <Input name="email" value={form.email} onChange={handleInputChange} />
          </div>

          <div>
            <Label title="Username" />
            <Input name="username" value={form.username} onChange={handleInputChange} />
          </div>

          <div>
            <Label title="Gender" />
            <Select
              name="gender"
              value={form.gender}
              onChange={handleInputChange}
              options={GENDER_OPTIONS}
            />
          </div>

          <div>
            <Label title="First Name" />
            <Input name="firstName" value={form.firstName} onChange={handleInputChange} />
          </div>

          <div>
            <Label title="Last Name" />
            <Input name="lastName" value={form.lastName} onChange={handleInputChange} />
          </div>

          <div>
            <Label title="Birth Date" />
            <Input name="birthDate" value={form.birthDate} onChange={handleInputChange} type="date" />
          </div>

          <div className="md:col-span-2">
            <Label title="Bio" />
            <Input name="bio" value={form.bio} onChange={handleInputChange} type="textarea" />
          </div>
        </div>
      </form>
      <div className="mt-3">
        <DefaultButton>Save</DefaultButton>
      </div>
    </PageSection>
  );
};

export default SectionBasicInformation;
