import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getCurrentUser(@Req() req: any) {
    return this.userService.findById(req.user.userId);
  }

  @Put('me')
  async updateProfile(@Req() req: any, @Body() data: any) {
    return this.userService.updateProfile(req.user.userId, data);
  }
}
