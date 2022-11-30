

import {Request, Response} from "express";
import axios from "axios";
import moment from "moment";
async function getAvailableTimeFromQuery(req: Request, res: Response){
    const date = req.query.date
    const time = req.query.time
    const resourceId = req.query.resourceId

    if(!date || !resourceId || !time){
        console.log('query');
        res.status(400).json({error: "missing params"})
        return
    }

    const dateAndTime = date + " " + time
    const dateAndTimeMoment = moment(dateAndTime, "YYYY-MM-DD HH:mm:ss", false)
    console.log(dateAndTimeMoment)
    const openings  = await  axios.get(`http://localhost:8080/timetables?date=${date}&resourceId=${resourceId}`);
    const openingTimes = openings.data.timetables
    const openingTimesMoment = openingTimes.map((openingTime: any) => {
        console.log(openingTime.opening + " to " + openingTime.closing)
        return {
            opening: moment(openingTime.opening, "YYYY-MM-DD HH:mm:ss", true),
            closing: moment(openingTime.closing, "YYYY-MM-DD HH:mm:ss", true)
        }
    });
    const openingTime = openingTimesMoment.find((openingTime: any) => {
        return dateAndTimeMoment.isBetween(openingTime.opening, openingTime.closing)
    })
    if(!openingTime){
        console.log('opening');
        res.status(400).json({
            "available": false
        })
        return
    }
    const reservations  = await  axios.get(`http://localhost:8080/reservations?date=${date}&resourceId=${resourceId}`);
    console.log("In openings")
    const reservationTimes = reservations.data.reservations
    const reservationTimesMoment = reservationTimes.map((reservationTime: any) => {
        return {
            reservationStart: moment(reservationTime.reservationStart, "YYYY-MM-DD HH:mm:ss", true),
            reservationEnd: moment(reservationTime.reservationEnd, "YYYY-MM-DD HH:mm:ss", true)
        }
    });
    const reservationTime = reservationTimesMoment.find((reservationTime: any) => {
        return dateAndTimeMoment.isBetween(reservationTime.reservationStart, reservationTime.reservationEnd)
    })
    if(reservationTime){
        console.log('reservation');
        res.status(400).json({
            "available": false
        })
        return
    }
    res.status(200).json({
        "available": true
    })
}

export {getAvailableTimeFromQuery}