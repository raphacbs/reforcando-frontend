import axios from 'axios';
import { Settings, env } from './Settings';
import moment from 'moment';
import { PaymentEventService } from './PaymentEventService';


export class StudentService {

    getStudentsByClassroomId(classroomId) {
        return axios.get(Settings.environment[env].baseUrl + Settings.environment.pathUrlStudent, {
            params: {
                classroomId: classroomId
            }
        })
            .then(res => {
                res.data.forEach(student => {
                    console.log(student);
                    student.createAt = moment(student.createAt, "YYYY-MM-DDTHH:mm:ss.sss.ss.s").format("DD/MM/YYYY");
                    student.parent.phoneNumber = student.parent.phoneNumber || "00000000000";
                    const paymentEventService = new PaymentEventService();
                    paymentEventService.getByStudentId(student.id).then(data => {
                       student.paymentEvents = data;
                    }).catch(error => {

                    });


                });

                return res.data
            });
    }

    postStudent(student) {
        student.parent.phoneNumber = student.parent.phoneNumber.replace('(', '').replace(')', '');
        student.birthDate = moment(student.birthDate).format("YYYY-MM-DD");
        student.monthlyFee = parseFloat(student.monthlyFee.replace(',','.'));
        student.createAt = moment().format("YYYY-MM-DDTHH:mm:ss.000.00.0");
        student.parent.createAt = moment().format("YYYY-MM-DDTHH:mm:ss.000.00.0");
        student.active = true;

        return axios.post(Settings.environment[env].baseUrl + Settings.environment.pathUrlStudent, student)
        .then(res => {
            return res.data;
        })
    }

}
