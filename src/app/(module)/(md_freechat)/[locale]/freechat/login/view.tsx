"use client";

import { useActionState, useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { login } from "../../../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/app/lib/utils";

type InputProps = {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  onChange?: (value: string) => void;
};
const Input = ({ label, id, name, type, placeholder, onChange }: InputProps) => {
  const [inputType, setInputType] = useState(type ?? 'text');

  return (
    <div className="border-b-2 border-b-(--fc-border)">
      <label className="font-semibold" htmlFor={id}>
        {label}
      </label>
      <div className="relative z-0">
        <input
          className={cn([
            'block w-full outline-0 py-1',
            type === 'password' && 'pr-6'
          ])}
          id={id}
          type={inputType}
          name={name}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
        {type === 'password' && (
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
            <FontAwesomeIcon icon={inputType === 'password' ? faEyeSlash : faEye} width={24} height={24} size="1x"
              onClick={() => setInputType(inputType === 'text' ? 'password' : 'text')} />
          </div>
        )}
      </div>
    </div>
  );
};


const View = () => {
  const [isNew, setIsNew] = useState(false);
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <>
      {/* Page wrapper */}
      <div className="w-full h-full max-w-sm mx-auto flex items-center justify-center">
        <div className="w-full p-3 border-2 border-(--fc-border) rounded-md">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-center mb-1">Welcome to Freechat!</h2>
            <p className="text-center text-(--fc-text-secondary)">Login to join free conversations!</p>
          </div>
          <form action={action}>
            <div className="mb-2 flex items-center gap-2">
              <Checkbox id="form-new-account" size="small" sx={{
                color: 'white',
                padding: 0,
                '&.Mui-checked': {
                  color: 'white'
                }
              }} onChange={(e) => setIsNew(e.target.checked)} />
              <input hidden type="number" name="isNewAccount" defaultValue={isNew ? 1 : 0} />
              <label htmlFor="form-new-account">New account</label>
            </div>
            <div className="mb-2">
              <Input label="Email" id="form-email" name="email" type="email" placeholder="Enter email" />
              {state?.errors?.email && <p>{state.errors.email}</p>}
            </div>
            {isNew && (
              <div className="mb-2">
                <Input label="Display Name" id="form-display-name" name="displayName" type="text" placeholder="Enter display name" />
                {state?.errors?.displayName && <p>{state.errors.displayName}</p>}
              </div>
            )}
            <div className="mb-2">
              <Input label="Password" id="form-password" name="password" type="password" placeholder="Enter password" />
              {state?.errors?.password && <p>{state.errors.password}</p>}
            </div>
            <div className="text-center mt-2">
              <button type="submit" className="px-3 py-2 w-20 border-2 rounded-md uppercase font-semibold"
                disabled={pending}>
                {pending ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default View;
