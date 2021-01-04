import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar } from "../ui/Navbar";
import { messages } from "../../helpers/calendar-messages-es";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import { CalendarEvent } from "./CalendarEvent";
import { CalendarModal } from "./CalendarModal";
import { uiOpenModal } from "../../actions/ui";
import {
	eventClearActiveNote,
	eventStartLoading,
	setActive,
} from "../../actions/events";
import { AddNewFab } from "../ui/AddNewFab";
import { DeleteEventFab } from "../ui/DeleteEventFab";

moment.locale("es");
const localizer = momentLocalizer(moment);

// const events = [
// 	{
// 		title: "Cumpleaños",
// 		start: moment().toDate(),
// 		end: moment().add(2, "hours").toDate(),
// 		bgcolor: "#fafafa",
// 		notes: "Compara el pastel",
// 		user: {
// 			_id: "123",
// 			name: "Moises",
// 		},
// 	},
// ];

export const CalendarScreen = () => {
	const [lastView, setLastView] = useState(
		localStorage.getItem("lastView") || "month"
	);
	const dispatch = useDispatch();
	const { uid } = useSelector((state) => state.auth);
	const { events, activeEvent } = useSelector((state) => state.calendar);

	useEffect(() => {
		dispatch(eventStartLoading());
	}, [dispatch]);

	const onDobleClick = (e) => {
		dispatch(uiOpenModal());
		dispatch(setActive(e));
	};
	const onSelectEvent = (e) => {
		dispatch(setActive(e));

		if (activeEvent) {
			dispatch(eventClearActiveNote());
		}
	};

	const onViewChange = (e) => {
		setLastView(e);
		localStorage.setItem("lastView", e);
	};

	const onSelectSlot = (e) => {
		dispatch(eventClearActiveNote());
	};

	const eventStylesGetter = (event, start, end, isSelected) => {
		const style = {
			backgroundColor: uid === event.user._id ? "#367CF7" : "#465660",
			borderRadius: "0px",
			opacity: 0.8,
			display: "block",
			color: "white",
		};

		return {
			style,
		};
	};

	return (
		<div className="calender-screen">
			<Navbar />

			<BigCalendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				messages={messages}
				eventPropGetter={eventStylesGetter}
				onDoubleClickEvent={onDobleClick}
				onSelectEvent={onSelectEvent}
				onView={onViewChange}
				view={lastView}
				onSelectSlot={onSelectSlot}
				selectable={true}
				components={{
					event: CalendarEvent,
				}}
			/>
			<AddNewFab />
			{activeEvent && <DeleteEventFab />}
			<CalendarModal />
		</div>
	);
};
