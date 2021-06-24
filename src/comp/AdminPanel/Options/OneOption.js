import React from "react";
import { Switch } from "@material-ui/core";

const OneOption = ({ children, checked, onChange }) => {
	return (
		<div className="oneOption">
				{children}
			
			<span>
				OFF <Switch checked={checked} onChange={onChange} /> ON
			</span>
		</div>
	);
};

export default OneOption;
