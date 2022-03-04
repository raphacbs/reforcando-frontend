import React, { useState, useEffect, useRef, Text } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputMask } from 'primereact/inputmask';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ClassroomService } from '../service/ClassroomService';
import Loading from '../components/Loading';
import { Dropdown } from 'primereact/dropdown';
import { StudentService } from '../service/StudentService';
import { PaymentEventService } from '../service/PaymentEventService';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';




const StudentPage = () => {

    const emptyStudent = {
        name: "",
        lastName: "",
        birthDate: "",
        fullName: "",
        createAt: "",
        schoolName: "",
        schoolClassroom: "",
        monthlyFee: 0.0,
        parent: {
            name: "",
            lastName: "",
            birthDate: "",
            createAt: "",
            phoneNumber: ""
        },
        classroom: {
            id: 0
        }
    }


    const [classrooms, setClassrooms] = useState(null);
    const [students, setStudents] = useState(null);
    const [classroomId, setClassroomId] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disableAddStudentButton, setDisableAddStudentButton] = useState(true);
    const [showStudentDialog, setShowStudentDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [disableSaveStudentButton, setDisableSaveStudentButton] = useState(true);
    const [disableSavePaymentButton, setDisableSavePaymentButton] = useState(true);
    const [loadingPage, setLoadingPage] = useState(false);
    const [classroom, setClassroom] = useState({
        id: null,
        description: null,
        startTime: '',
        endTime: '',
        createAt: null,
        active: true
    });

    const [student, setStudent] = useState({
        name: "",
        lastName: "",
        birthDate: "",
        fullName: "",
        createAt: "",
        schoolName: "",
        schoolClassroom: "",
        monthlyFee: 0.0,
        parent: {
            name: "",
            lastName: "",
            birthDate: "",
            createAt: "",
            phoneNumber: ""
        },
        classroom: {
            id: 0
        }
    });

    const [paymentEvent, setPaymentEvent] = useState({
        value: 0.00,
        reference: new Date(),
        paymentDate: new Date(),
        student: null
    });
    const [expandedRows, setExpandedRows] = useState(null);


    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const classroomService = new ClassroomService();
        classroomService.getClassrooms().then(data => {
            setClassrooms(data);
        });
    }, []);


    const onChangeClassroom = (classroomId) => {
        setLoading(true);
        setClassroomId(classroomId);
        setClassroom(classrooms.find(c => c.id === classroomId));
        const studentService = new StudentService();
        studentService.getStudentsByClassroomId(classroomId).then(data => {
            setStudents(data);
            setLoading(false);
            setDisableAddStudentButton(false);
        });
    };

    const showAddStudentDialog = () => {
        let _student = { ...student };
        _student.classroom.id = classroom.id;
        setStudent(_student);
        setShowStudentDialog(true);
    };

    const [paymentEvents, setPaymentEvents] = useState(null);

    const createClassroom = () => {

    };

    const hideStudentDialog = () => {
        setShowStudentDialog(false);
    }

    const hidePaymentDialog = () => {
        setShowPaymentDialog(false);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>

                <Dropdown
                    optionLabel="description"
                    optionValue="id"
                    value={classroomId}
                    options={classrooms}
                    onChange={(e) => onChangeClassroom(e.value)}
                    placeholder="Selecione a turma"
                    filter
                    className="my-1"
                    filterBy="description"
                />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        disabled={disableAddStudentButton}
                        onClick={showAddStudentDialog}
                    />
                </div>
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">name</span>
                {rowData.name + ' ' + rowData.lastName}
            </>
        );
    }

    const activeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Active</span>
                {rowData.active ? 'Ativa' : 'Desativada'}
            </>
        );
    }

    const monthlyFeeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">monthlyFee</span>
                {rowData.monthlyFee.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
            </>
        );
    }

    const parentNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">parent-name</span>
                {rowData.parent.name + ' ' + rowData.parent.lastName}
            </>
        );
    }

    const parentCellphoneBodyTemplate = (rowData) => {
        const phone = rowData.parent.phoneNumber.match(/(\d{2})(\d{5})(\d{4})/);
        const cellphoneNumberMask = `(${phone[1]}) ${phone[2]}-${phone[3]}`;
        return (
            <>
                <span className="p-column-title">cellphoneNumber</span>
                {cellphoneNumberMask}
            </>
        );
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student[`${name}`] = val;
        setStudent(_student);
        studentValidation();
    }

    const onInputPaymentChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _paymentEvent = { ...paymentEvent };
        _paymentEvent[`${name}`] = val;
        setPaymentEvent(_paymentEvent);
        paymentEventValidation();
    }

    const setStudentName = (e) => {
        let val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student.lastName = val.split(' ').slice(1).join(' ');
        _student.name = val.split(' ').slice(0, 1).join(' ');
        _student.fullName = _student.lastName === '' ? _student.name : `${_student.name} ${_student.lastName}`
        _student.fullName = e.nativeEvent.data === ' ' ? _student.fullName + ' ' : _student.fullName;
        setStudent(_student);
        studentValidation();
    }

    const setStudentParentName = (e) => {
        let val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student.parent.lastName = val.split(' ').slice(1).join(' ');
        _student.parent.name = val.split(' ').slice(0, 1).join(' ');
        _student.parent.fullName = _student.parent.lastName === '' ? _student.parent.name : `${_student.parent.name} ${_student.parent.lastName}`
        _student.parent.fullName = e.nativeEvent.data === ' ' ? _student.parent.fullName + ' ' : _student.parent.fullName;
        setStudent(_student);
        studentValidation();
    }

    const setStudentParentPhoneNumber = (e) => {
        let val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student.parent.phoneNumber = val;
        studentValidation();
    }

    const setStudentBirthDate = (e) => {
        let _student = { ...student };
        _student.birthDate = e;
        setStudent(_student);
        studentValidation();
    }

    const setPaymentReference = (e) => {
        let _paymentEvent = { ...paymentEvent };
        _paymentEvent.reference = e;
        setPaymentEvent(_paymentEvent);
        paymentEventValidation();
    }

    const setPaymentDate = (e) => {
        let _paymentEvent = { ...paymentEvent };
        _paymentEvent.paymentDate = e;
        setPaymentEvent(_paymentEvent);
        paymentEventValidation();
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button onClick={() => { newPaymentEvent(rowData.id) }} tooltip='Informar pagamento' icon="pi pi-dollar" className="p-button-rounded p-button-success mr-2" />
            </div>
        );
    }

    const newPaymentEvent = (id) => {
        const studentSelected = students.find(s => s.id === id);
        const paymentEvent = {
            value: studentSelected.monthlyFee,
            reference: new Date,
            paymentDate: new Date(),
            student: { id: studentSelected.id }
        }
        setPaymentEvent(paymentEvent);
        setShowPaymentDialog(true);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Alunos {classroom.description ? `da ${classroom.description}` : ""}</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisa..." />
            </span>
        </div>
    );

    const studentValidation = () =>{
        const isValid =  !!student.birthDate && !!student.name && !!student.schoolName && !!student.schoolClassroom
        && !!student.parent.name && !!student.parent.phoneNumber && !!student.monthlyFee;
        setSubmitted(isValid);
        setDisableSaveStudentButton(!isValid);
     }

     const paymentEventValidation = () => {
        const isValid = !!paymentEvent.value && !!paymentEvent.reference && !!paymentEvent.paymentDate;
        setSubmitted(isValid);
        setDisableSavePaymentButton(!isValid);
     }

    const saveStudent = () => {
        studentValidation();
        if(submitted){
            setLoadingPage(true);
            const studentService = new StudentService();
            studentService.postStudent(student).then(data => {
                setLoadingPage(false);
                setLoading(false);
                setShowStudentDialog(false);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Aluno cadastrado com sucesso!' });
                onChangeClassroom(classroom.id);
                setStudent(emptyStudent);
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Falha', detail: error });
            });
        }
    };

    const savePayment = () => {
        paymentEventValidation();
        if(submitted){
            setLoadingPage(true);
            const paymentEventService = new PaymentEventService();
            paymentEventService.savePayment(paymentEvent).then(data => {
                setLoadingPage(false);
                setLoading(false);
                setShowPaymentDialog(false);
                const studentId = data.student.id;
                const _students = [...students];
                _students.find(s=> s.id === studentId).paymentEvents.push(data);
                setStudents(_students);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Pagamento confirmado!' });
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Falha', detail: error });
            });
        }

    }

    const studentDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideStudentDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveStudent} disabled={disableSaveStudentButton} />
        </>
    );

    const paymentDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hidePaymentDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={savePayment} disabled={disableSavePaymentButton} />
        </>
    );

    const monthNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }

    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="ml-2" style={{ lineHeight: 1 }} />;
    }

    let today = new Date();
    let invalidDates = [today];

    addLocale('pt', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
        dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
        monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'sep', 'out', 'nov', 'dez'],
        today: 'Hoje',
        clear: 'Limpar'
    });

    const rowExpansionTemplate = (data) => {
        return (
            <DataTable value={data.paymentEvents} responsiveLayout="scroll">
                <Column field="id" header="Id" sortable></Column>
                <Column field="paymentDate" header="Pago em" sortable></Column>
                <Column field="reference" header="Competência" sortable></Column>
                <Column field="value" header="Valor" sortable></Column>
            </DataTable>
        )
    }
    const onRowExpand = (event) => {
        toast.current.show({ severity: 'info', summary: 'Buscando pagamentos', detail: event.data.name, life: 3000 });
    }






    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} ></Toolbar>

                    <DataTable ref={dt} value={students} selection={selectedStudent} onSelectionChange={(e) => setSelectedStudent(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} turmas"
                        globalFilter={globalFilter} emptyMessage="Sem dados" header={header} responsiveLayout="scroll"
                        loading={loading}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        onRowExpand={onRowExpand}
                        rowExpansionTemplate={rowExpansionTemplate}
                    >
                        <Column expander style={{ width: '3em' }} />
                        <Column field="name" header="Nome" body={nameBodyTemplate} sortable headerStyle={{ width: '60%', minWidth: '10rem' }}></Column>
                        <Column field="schoolName" header="Escola" sortable headerStyle={{ width: '60%', minWidth: '10rem' }}></Column>
                        <Column field="schoolClassroom" header="Série" sortable headerStyle={{ width: '60%', minWidth: '10rem' }}></Column>
                        <Column field="parent.name" header="Nome do responsável" sortable body={parentNameBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="parent.cellphoneNumber" header="Celular" sortable body={parentCellphoneBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="monthlyFee" header="Mensalidade" sortable body={monthlyFeeBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="createAt" header="Data de Cadastro" sortable headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                        <Column field="active" header="Status" sortable body={activeBodyTemplate} headerStyle={{ width: '10%', minWidth: '10rem' }}></Column>
                        <Column header="Ação" body={actionBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={showStudentDialog} style={{ width: '450px' }} header="Adicionar aluno" modal className="p-fluid" footer={studentDialogFooter} onHide={hideStudentDialog}>
                        <div className="field">
                            <label htmlFor="name">Nome Completo</label>
                            <InputText id="name" value={student.fullName} onChange={(e) => setStudentName(e)} required autoFocus className={classNames({ 'p-invalid': submitted && !student.name })} />
                            {submitted && !student.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="birthDate">Data de nascimento</label>
                            <Calendar value={student.birthDate} onChange={(e) => setStudentBirthDate(e.value)}
                                monthNavigator
                                yearNavigator
                                yearRange="1950:2017"
                                monthNavigatorTemplate={monthNavigatorTemplate}
                                yearNavigatorTemplate={yearNavigatorTemplate}
                                disabledDates={invalidDates}
                                dateFormat="dd/mm/yy"
                                showIcon
                                mask="99/99/9999"
                                locale='pt'
                            />
                            {submitted && !student.birthDate && <small className="p-invalid">Data de nascimento é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="schoolName">Nome da escola</label>
                            <InputText id="schoolName" value={student.schoolName} onChange={(e) => onInputChange(e, 'schoolName')} required className={classNames({ 'p-invalid': submitted && !student.schoolName })} />
                            {submitted && !student.schoolName && <small className="p-invalid">Nome da escola é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="schoolClassroom">Série</label>
                            <InputText id="schoolClassroom" value={student.schoolClassroom} onChange={(e) => onInputChange(e, 'schoolClassroom')} required className={classNames({ 'p-invalid': submitted && !student.schoolClassroom })} />
                            {submitted && !student.schoolClassroom && <small className="p-invalid">Série é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="parent.name">Nome do responsável Completo</label>
                            <InputText id="name" value={student.parent.fullName} onChange={(e) => setStudentParentName(e)} required className={classNames({ 'p-invalid': submitted && !student.parent.name })} />
                            {submitted && !student.parent.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="parent.phoneNumber">Celular</label>
                            <InputMask mask="(99)999999999" value={student.parent.phoneNumber} onChange={(e) => setStudentParentPhoneNumber(e)} required className={classNames({ 'p-invalid': submitted && !student.parent.phoneNumber })}></InputMask>
                            {submitted && !student.parent.phoneNumber && <small className="p-invalid">Celular é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="monthlyFee">Valor da mensalidade</label>
                            <InputMask mask="99,99" value={student.monthlyFee} onChange={(e) => onInputChange(e, 'monthlyFee')} required className={classNames({ 'p-invalid': submitted && !student.monthlyFee })}></InputMask>
                            {submitted && !student.monthlyFee && <small className="p-invalid">Valor é obrigatório.</small>}
                        </div>
                    </Dialog>


                    <Dialog visible={showPaymentDialog}
                        header='Confirmar pagamento do aluno'
                        modal
                        className="p-fluid"
                        footer={paymentDialogFooter}
                        onHide={hidePaymentDialog}

                    >
                        <div className="field">
                            <label htmlFor="value">Valor da mensalidade</label>
                            <InputMask mask="99,99" value={paymentEvent.value} onChange={(e) => onInputPaymentChange(e, 'value')} required className={classNames({ 'p-invalid': submitted && !student.monthlyFee })}></InputMask>
                            {submitted && !paymentEvent.value && <small className="p-invalid">Valor é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="reference">Referência</label>
                            <Calendar value={paymentEvent.reference} onChange={(e) => setPaymentReference(e.value)}
                                monthNavigator
                                yearNavigator
                                yearRange="2022:2050"
                                monthNavigatorTemplate={monthNavigatorTemplate}
                                yearNavigatorTemplate={yearNavigatorTemplate}
                                dateFormat="mm/yy"
                                showIcon
                                mask="99/9999"
                                locale='pt'
                            />
                            {submitted && !paymentEvent.reference && <small className="p-invalid">Mês de referência é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="paymentDate">Data do pagamento</label>
                            <Calendar value={paymentEvent.paymentDate} onChange={(e) => setPaymentDate(e.value)}
                                monthNavigator
                                yearNavigator
                                yearRange="2022:2050"
                                maxDate={new Date()}
                                monthNavigatorTemplate={monthNavigatorTemplate}
                                yearNavigatorTemplate={yearNavigatorTemplate}
                                dateFormat="dd/mm/yy"
                                showIcon
                                mask="99/99/9999"
                                locale='pt'
                            />
                            {submitted && !paymentEvent.paymentDate && <small className="p-invalid">Data de pagamento é obrigatória.</small>}
                        </div>


                    </Dialog>
                    <Loading visible={loadingPage}></Loading>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(StudentPage, comparisonFn);
