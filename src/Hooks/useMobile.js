import { useCallback, useEffect, useState } from "react";

const useMobile = (minWidth = 600) => {
	const [isMobile, setIsMobile] = useState(false);

	const handleResize = useCallback(() => {
		if (window.innerWidth <= minWidth) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	}, [minWidth]);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [handleResize]);

	return isMobile;
};

export default useMobile;
