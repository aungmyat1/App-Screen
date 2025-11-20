import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await this.userService.create(name, email, password);
    
    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      name: user.name
    });

    // Remove password from response
    delete user.password;
    
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await this.userService.validatePassword(user, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      name: user.name
    });

    // Remove password from response
    delete user.password;

    return { user, token };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userService.findById(userId);
  }
}