import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputMask } from 'primereact/inputmask';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ClassroomService } from '../service/ClassroomService';
import Loading from '../components/Loading';




const ClassroomPage = () => {
    let emptyClassroom = {
        id: null,
        description: null,
        startTime: null,
        endTime: null,
        createAt: null,
        active: true
    };

    const [classrooms, setClassrooms] = useState(null);
    const [classroom, setClassroom] = useState(emptyClassroom);
    const [classroomDialog, setClassroomDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedClassrooms, setSelectedClassrooms] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);

    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        setLoading(true);
        const classroomService = new ClassroomService();
        classroomService.getClassrooms().then(data => {
            setClassrooms(data);
            setLoading(false);
            setReload(false);
        });
    }, [reload]);


    const saveClassroom = () => {
        setLoadingPage(true);
        const classroomService = new ClassroomService();
        classroomService.saveClassrooms(classroom).then(data => {
            setLoadingPage(false);
            setLoading(false);
            setClassroomDialog(false);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Turma salva com sucesso!' });
            setReload(true);
        }).catch(error => {
            toast.current.show({ severity: 'error', summary: 'Falha', detail: error});

        });

    };

    const editClassroom = (classroom) => {
        setClassroom({ ...classroom });
        setClassroomDialog(true);
    };

    const createClassroom = () => {
        setClassroom({ ...emptyClassroom });
        setClassroomDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setClassroomDialog(false);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova"
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        onClick={() => { createClassroom() }} />
                </div>
            </React.Fragment>
        )
    }

    const descriptionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
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

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _classroom = { ...classroom };
        _classroom[`${name}`] = val;

        setClassroom(_classroom);
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editClassroom(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Turmas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisa..." />
            </span>
        </div>
    );

    const classroomDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveClassroom} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={classrooms} selection={selectedClassrooms} onSelectionChange={(e) => setSelectedClassrooms(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Exibindo {first} até {last} de {totalRecords} turmas"
                        globalFilter={globalFilter} emptyMessage="Turma não encontrada." header={header} responsiveLayout="scroll"
                        loading={loading}
                    >
                        <Column field="description" header="Descrição" sortable body={descriptionBodyTemplate} headerStyle={{ width: '80%', minWidth: '10rem' }}></Column>
                        <Column field="active" header="Status" sortable body={activeBodyTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
                        <Column header="Ação" body={actionBodyTemplate} headerStyle={{ width: '15%', minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={classroomDialog} style={{ width: '450px' }} header="Detalhe da turma" modal className="p-fluid" footer={classroomDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="description">Descrição</label>
                            <InputText id="description" value={classroom.description} onChange={(e) => onInputChange(e, 'description')} required autoFocus className={classNames({ 'p-invalid': submitted && !classroom.description })} />
                            {submitted && !classroom.description && <small className="p-invalid">Descrição é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="startTime">Hora de Início</label>
                            <InputMask mask="99:99" value={classroom.startTime} onChange={(e) => onInputChange(e, 'startTime')}></InputMask>
                            {submitted && !classroom.startTime && <small className="p-invalid">Hora de início é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="endTime">Hora de Término</label>
                            <InputMask mask="99:99" value={classroom.endTime} onChange={(e) => onInputChange(e, 'endTime')}></InputMask>
                            {submitted && !classroom.endTime && <small className="p-invalid">Hora de término é obrigatória.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="active">Ativada</label>
                            <br></br>
                            <InputSwitch checked={classroom.active} onChange={(e) => onInputChange(e, 'active')} />
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

export default React.memo(ClassroomPage, comparisonFn);
