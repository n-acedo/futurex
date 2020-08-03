import axios from "axios"
import { push,replace } from "connected-react-router";
import { routes } from "../containers/Router/index";
import moment from 'moment'

export const setTrips = (trip) => {
    return {
        type: "SET_TRIPS",
        payload: {
            trip
        }
    }
}

export const setTripsDetails = (tripDetails) => {
    return {
        type: "SET_TRIP_DETAILS",
        payload: {
            tripDetails
        }
    }
}

const baseUrl = "https://us-central1-missao-newton.cloudfunctions.net/futureX/natalia-acedo"


export const getTrips = () => async (dispatch) => {
    try {
        const response = await axios.get(
            `${baseUrl}/trips`
        )
        dispatch(setTrips(response.data.trips))
    } catch (error) {
        console.error(error)
    } 
}


export const applyToTrip = (form, id) => async () => {
    try {
        await axios.post(
            `${baseUrl}/trips/${id}/apply`,
        form
        )
        alert("Aplicação enviada!")
    } catch (error) {
        console.error(error)
    }
}


export const login = (email, password) => async (dispatch) => {
    const body = {
        email,
        password
    }

    try {
        const response = await axios.post(
            `${baseUrl}/login`,
            body
        )
        localStorage.setItem("token", response.data.token)
        dispatch(push(routes.user))
    } catch (error) {
        console.error(error)
        alert("Dados incorretos")
    }
}


export const getTripDetails = (id) => async (dispatch) => {

    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(
            `${baseUrl}/trip/${id}`,
            {
                headers: {
                    auth: token
                }
            }
        )
        dispatch(setTripsDetails(response.data.trip))
    } catch (error) {
        console.error(error)
    }
}

export const decideCandidate = (candidateId, tripId) => async (dispatch) => {
    const token = localStorage.getItem("token");

    const body = {
        approve: true
    }

    try {
        await axios.put(
            `${baseUrl}/trips/${tripId}/candidates/${candidateId}/decide`,
            body,
            {
                headers: {
                    auth: token
                }
            }
        )
        alert("Candidato aprovado")
    } catch (error) {
        console.error(error)
    }
} 

export const createTripPost = (form) => async () => {
    const token = localStorage.getItem("token");
    const dateFormat = moment(form.date).format('DD/MM/YYYY')
    const  body = {
        name: form.tripName,
        planet: form.planet,
        date: dateFormat,
        description: form.description,
        durationInDays: Number(form.duration)
    }

    try{
        await axios.post(
            `${baseUrl}/trips`,
        body,
        {   
            headers: {
                auth: token
            }
        })
        alert("Viagem criada!")
    } catch (error) {
        console.error(error)
    }  
}
