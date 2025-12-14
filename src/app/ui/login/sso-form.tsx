"use client";

import { Button } from "@mui/material";

export default function SsoForm() {
	const loginAsGoogle = async () => {
		
	}

	return (
		<div>
			<div className="text-center mb-2 flex justify-center items-center gap-3 px-3">
				<div className="h-[1px] bg-gray-400 flex-auto"></div>
				<div>Or</div>
				<div className="h-[1px] bg-gray-400 flex-auto"></div>
			</div>
			<div className="flex flex-col gap-3 mb-3">
				<Button type="button" size="small" variant="outlined" fullWidth>Google</Button>
				<Button type="button" size="small" variant="outlined" fullWidth>Facebook</Button>
				<Button type="button" size="small" variant="outlined" fullWidth>Microsoft</Button>
			</div>
		</div>
	)
}
