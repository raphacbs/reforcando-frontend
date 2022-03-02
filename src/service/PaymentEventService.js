import axios from 'axios';
import moment from 'moment';
import {Settings, env} from './Settings';

export class PaymentEventService {


    savePayment(payment) {

        payment.reference = moment(payment.reference).format("YYYY-MM-DD");
        payment.paymentDate = moment(payment.paymentDate).format("YYYY-MM-DDTHH:mm:ss.000.00.0");
        payment.value = parseFloat(payment.value);


        return axios.post(Settings.environment[env].baseUrl + Settings.environment.pathUrlPaymentEvent,
            JSON.stringify(payment), { headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } })
            .then(res => {
                return res.data;

            })
            .catch((error) => {
                console.log("Problem submitting New Post", error);
                return error;
            })
            .finally(() => {
                console.log(payment);
                return payment;
            })
    }

    getByStudentId(studentId){
        return axios.get(Settings.environment[env].baseUrl + Settings.environment.pathUrlPaymentEvent, {
            params: {
                studentId: studentId
            }
        })
            .then(res => {
                res.data.forEach(paymentEvent => {
                    console.log(paymentEvent);
                    paymentEvent.paymentDate = moment(paymentEvent.paymentDate, "YYYY-MM-DDTHH:mm:ss.sss.ss.s").format("DD/MM/YYYY HH:mm");
                    paymentEvent.value = paymentEvent.value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
                    paymentEvent.reference = moment(paymentEvent.reference, "YYYY-MM-DD").format("MM/YYYY");
                });

                return res.data
            });
    }


}
