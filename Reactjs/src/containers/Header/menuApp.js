export const adminMenu = [
    { //quản lý user
        name: 'menu.admin.manage-user',
        menus: [
            // {
            //     name: 'menu.admin.crud', link: '/system/user-manage',
            // },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-manage',
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor',
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/manage-admin',
            // },
            { //quản lý kế hoạch khám bệnh bác sĩ
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule',
            }
        ]
    },
    { //quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic',
            },
        ]
    },
    { //quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty',
            },
        ]
    },
    { //quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook',
            },
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.manage-doctor',
        menus: [
            { //quản lý kế hoạch khám bệnh bác sĩ
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule',
            },
            { //quản lý bệnh nhân khám bệnh
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient',
            },
            { //quản lý thông tin cá nhân
                name: 'menu.doctor.manage-account', link: '/doctor/manage-account',
            }
        ]
    }
];

export const patientMenu = [
    {
        name: 'menu.patient.manage-patient',
        menus: [
            { //quản lý kế hoạch khám bệnh bác sĩ
                name: 'menu.patient.manage-account', link: '/patient/manage-account',
            },
            { //quản lý bệnh nhân khám bệnh
                name: 'menu.patient.manage-schedule', link: '/patient/manage-booking',
            }
        ]
    }
];