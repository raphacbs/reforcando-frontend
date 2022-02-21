import axios from 'axios';
import moment from 'moment';
import {Settings, env} from './Settings';

export class ClassroomService {

    getClassrooms() {
        return axios.get(Settings.environment[env].baseUrl + Settings.environment.pathUrlClassrooms)
            .then(res => {
                res.data.forEach(classroom => {
                    classroom.startTime = moment(classroom.startTime, "YYYY-MM-DDTHH:mm:ss.000.00.0").format("HH:mm");
                    classroom.endTime = moment(classroom.endTime, "YYYY-MM-DDTHH:mm:ss.sss.ss.s").format("HH:mm");
                });

                return res.data
            });
    }

    saveClassrooms(classroom) {
        classroom.startTime = moment().set({ h: classroom.startTime.split(":")[0], m: classroom.startTime.split(":")[1] }).format("yyyy-MM-DDTHH:mm:00[.000][.00][.0]");
        classroom.endTime = moment().set({ h: classroom.endTime.split(":")[0], m: classroom.endTime.split(":")[1] }).format("yyyy-MM-DDTHH:mm:00[.000][.00][.0]");
        classroom.createAt = moment().format("YYYY-MM-DDTHH:mm:ss.000.00.0");

        return axios.post(Settings.environment[env].baseUrl + Settings.environment.pathUrlClassrooms,
            JSON.stringify(classroom), { headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } })
            .then(res => {
                return res.data;

            })
            .catch((error) => {
                console.log("Problem submitting New Post", error);
                return error;
            })
            .finally(() => {
                console.log(classroom);
                return classroom;
            })
    }


}
