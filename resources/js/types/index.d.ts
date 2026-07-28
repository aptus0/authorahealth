export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: string;
    organization?: {
        id: number;
        name: string;
        subscription?: {
            plan: string;
            status: string;
        };
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
};
