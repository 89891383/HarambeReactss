import { Button, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { DataContext } from "../../../App";
// import { CSSTransition } from "react-transition-group";
import "./AdminList.css";

const useStyles = makeStyles({
	adminListBtn: {
		color: "white",
		borderColor: "white",
	},
});

const AdminList = () => {
	const { socket } = useContext(DataContext);

	const classes = useStyles();

	const [adminList, setAdminList] = useState([]);

	useEffect(() => {
		socket.emit("getAdminList");

		socket.on("getAdminListAnswer", ({ adminList }) => {
			setAdminList(adminList);
		});

		return () => {
			socket.off("getAdminListAnswer");
		};
	}, [socket]);

	const createAdminList = adminList.map((admin) => {
		return (
			<div className="adminList_Item" key={admin}>
				{admin}
			</div>
		);
	});

	const [isAdminList, setIsAdminList] = useState(false);

	return (
		<>
			<div
				className="adminList"
				onMouseEnter={() => setIsAdminList(true)}
				onMouseLeave={() => setIsAdminList(false)}
			>
				<Button variant="outlined" className={classes.adminListBtn}>
					ADMIN LIST
				</Button>

				<CSSTransition
					in={isAdminList}
					unmountOnExit
					timeout={300}
					classNames="transition"
				>
					<div className="adminListArray">
						<h3 className="h3_adminListArray">Admins:</h3>
						{createAdminList}
					</div>
				</CSSTransition>
			</div>
		</>
	);
};

export default AdminList;
