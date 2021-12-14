import { Box, Fade, Typography } from "@material-ui/core";
import { Button, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { useClickAway } from "react-use";
import { DataContext } from "../../../App";
import "./AdminList.css";

const useStyles = makeStyles({
	adminListBtn: {
		color: "white",
		borderColor: "white",
	},
	adminListArray: {
		display: "flex",
		flexDirection: "column",
		gap: "5px",
		alignItems: "center",
		zIndex: "100",
		minWidth: "100%",
		maxHeight: "200px",
		scrollbarWidth: "5px",
		overflow: "scroll",
		position: "absolute",
		left: "0",
		top: "0",
		transform: "translateY(-100%)",
		padding: "15px",
		backgroundColor: "black",
		borderRadius: "5px",
		boxShadow: "0 0 5px black",
		transformOrigin: "center",
		scrollbarColor: "auto",
	},
	adminListItem: {
		borderRadius: "4px",
		padding: "5px",
		width: "100%",
		fontWeight: "700",
	},
	adminList: {
		width: "fitContent",
		position: "relative",
		padding: "15px",
	},
});

const AdminList = () => {
	const { socket } = useContext(DataContext);

	const classes = useStyles();

	const [adminList, setAdminList] = useState([]);

	const adminListRef = useRef(null);

	useClickAway(adminListRef, () => {
		setIsAdminList(false);
	});

	useEffect(() => {
		socket.emit("getAdminList");

		socket.on("getAdminListAnswer", ({ adminList }) => {
			setAdminList(adminList);
		});

		return () => {
			socket.off("getAdminListAnswer");
		};
	}, [socket]);

	const createAdminList = adminList?.map((admin) => {
		return (
			<Typography className={classes.adminListItem} key={admin}>
				{admin}
			</Typography>
		);
	});

	const [isAdminList, setIsAdminList] = useState(false);

	return (
		<>
			<Box className={classes.adminList} ref={adminListRef}>
				<Button
					variant="outlined"
					className={classes.adminListBtn}
					onClick={() => setIsAdminList((prev) => !prev)}
				>
					ADMIN LIST
				</Button>

				<Fade in={isAdminList} unmountOnExit timeout={300}>
					<Box className={classes.adminListArray}>
						<Typography variant="h5">Admins:</Typography>
						{createAdminList}
					</Box>
				</Fade>
			</Box>
		</>
	);
};

export default AdminList;
