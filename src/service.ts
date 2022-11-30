

import {Request, Response} from "express";
import axios from "axios";
import moment, {Moment} from "moment";
async function getAvailableTimeFromQuery(req: Request, res: Response){
    const date = req.query.date
    const time = req.query.time
    const resourceId = req.query.resourceId

    if(!date || !resourceId || !time){
        res.status(400).json({error: "missing params"})
        return
    }

    const dateAndTime = date + " " + time
    const dateAndTimeMoment = moment(dateAndTime, "YYYY-MM-DD HH:mm:ss", false)

    try {
        if (!(await checkIfDateIsOnOpenDay(date as string, resourceId as string, dateAndTimeMoment))){
            res.status(200).json({
                "available": false
            })
            return
        }

        if (!(await checkIfThereIsReservation(date as string, resourceId as string, dateAndTimeMoment))){
            res.status(200).json({
                "available": false
            })
            return
        }
    }catch (e) {
        res.status(404).json({
            "message": "Resource not found"
        })
        return
    }


    res.status(200).json({
        "available": true
    })
    return
}


async function checkIfDateIsOnOpenDay(date: any, resourceId: string,dateAndTimeMoment: Moment ): Promise<boolean>{
    let openings;
    try {
        openings  = await  axios.get(`http://localhost:8080/timetables?date=${date}&resourceId=${resourceId}`);
    } catch (e) {
        throw(new Error("Error fetching data from peer"));
    }
    const openingTimes = openings.data.timetables
    const openingTimesMoment = openingTimes.map((openingTime: any) => {
        return {
            opening: moment(openingTime.opening, "YYYY-MM-DD HH:mm:ss", true),
            closing: moment(openingTime.closing, "YYYY-MM-DD HH:mm:ss", true)
        }
    });
    const openingTime = openingTimesMoment.find((openingTime: any) => {
        return dateAndTimeMoment.isBetween(openingTime.opening, openingTime.closing)
    })
    if(!openingTime){
        return false
    }
    return true
}

async function checkIfThereIsReservation(date: any, resourceId: string,dateAndTimeMoment: Moment ): Promise<boolean>{
    let reservations
    try {
        reservations  = await  axios.get(`http://localhost:8080/reservations?date=${date}&resourceId=${resourceId}`);
    } catch (e) {
        throw(new Error("Error fetching data from peer"));
    }
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
    return !reservationTime;
}

export {getAvailableTimeFromQuery}