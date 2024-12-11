interface SeedUser {
    email: string;
    password: string;
    fullName: string;
    roles: string[];
    isActive: boolean;
}


interface SeedData {
    users: SeedUser[];
}

export const initialDataUsers: SeedData = {
    users: [
        {
            email: 'gaspar.kamann@usm.cl',
            password: 'Abc123',
            fullName: 'Usuario',
            roles: ['user'],
            isActive: true
        },
        {
            email: 'gabriel.kamann@usm.cl',
            password: 'Abc123',
            fullName: 'Usuario',
            roles: ['admin'],
            isActive: true
        },
    ]
}