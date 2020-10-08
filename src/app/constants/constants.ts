export const CONSTANTS = {
    ROLES: {
        ADMIN: 'ADMIN',
        ADMINISTRATIVE: 'ADMINISTRATIVE',
        TEACHER: 'TEACHER',
        STUDENT: 'STUDENT'
    },
}

export const SELECTS = {
    QUANT: [
        {value: 'all', text: 'Todos'},
        {value: 10, text: '10'},
        {value: 25, text: '25'},
        {value: 50, text: '50'},
        {value: 100, text: '100'}
    ],
    TYPEUSERS: [
        {value: 'TEACHER', text: 'Profesor'},
        {value: 'STUDENT', text: 'Estudiante'},
        {value: 'ADMINISTRATIVE', text: 'Administrativo'}
    ]
}