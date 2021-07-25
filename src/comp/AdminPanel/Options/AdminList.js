import { Fade } from "@material-ui/core";
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
});

const AdminList = () => {
	const { socket } = useContext(DataContext);

	const classes = useStyles();

	const [adminList, setAdminList] = useState([]);

	const adminListRef = useRef(null)

	useClickAway(adminListRef, ()=>{
		setIsAdminList(false)
	})

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
				ref={adminListRef}
			>
				<Button 
					variant="outlined" 
					className={classes.adminListBtn}
					onClick={() => setIsAdminList(prev=> !prev)}
				>
					ADMIN LIST
				</Button>

		
				<Fade in={isAdminList} unmountOnExit timeout={300} >
					<div>
						<div className="adminListArray" >
							<h3 className="h3_adminListArray">Admins:</h3>
							{createAdminList}
						</div>
					</div>
				</Fade>
			</div>
		</>
	);
};

export default AdminList;
