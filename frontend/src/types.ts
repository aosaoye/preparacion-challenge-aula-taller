export type Student = {
    id: number;
    name: string;
    course: string;
    level: number;
    avatar: string;
    active: boolean;
};

export type Workshop = {
    id: number;
    name: string;
    instructor: string;
    color: string;
    capacity: number;
    accent: string;
};

export type EnrollmentMap = Record<number, number[]>;
