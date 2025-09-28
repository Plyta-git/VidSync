import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    singup() {
        return 'I am sing up';
    }

    singin() {
        return 'I am sing in';
    }
}
