"use client";

type InputProps = {
  label: string;
  id: string;
  type: string;
  placeholder: string;
};
const Input = ({ label, id, type, placeholder }: InputProps) => {
  return (
    <div className="border-b-2 border-b-(--fc-border)">
      <label className="font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        className="block w-full outline-0 py-1"
        id={id}
        type={type}
        name={id}
        placeholder={placeholder}
      />
    </div>
  );
};


const View = () => {
  return (
    <>
      {/* Page wrapper */}
      <div className="w-full h-full max-w-sm mx-auto flex items-center justify-center">
        <div className="w-full p-3 border-2 border-(--fc-border) rounded-md">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-center mb-1">Welcome to Freechat!</h2>
            <p className="text-center text-(--fc-text-secondary)">Login to join free conversations!</p>
          </div>
          <div className="mb-2">
            <Input label="Email" id="form-email" type="email" placeholder="Enter email" />
          </div>
          <div className="mb-2">
            <Input label="Display Name" id="form-name" type="text" placeholder="Enter display name" />
          </div>
          <div className="mb-2">
            <Input label="Password" id="form-password" type="password" placeholder="Enter password" />
          </div>
          <div className="text-center mt-2">
            <button type="button" className="px-3 py-2 w-20 border-2 rounded-md uppercase font-semibold">Login</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default View;
