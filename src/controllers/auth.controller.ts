import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AuthLoginUseCase,
  AuthRegisterUseCase,
  AuthForgotPasswordUseCase,
  AuthVerifyOtpUseCase,
  AuthResetPasswordUseCase,
} from '../usecases/auth.usecases';
import { AuthLoginDTO, AuthRegisterDTO, ForgotPasswordDTO, VerifyOtpDTO, ResetPasswordDTO } from '../dto/auth.dto';
import { UserAdapter } from '../adapters/user.adapter';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: AuthLoginUseCase,
    private readonly registerUseCase: AuthRegisterUseCase,
    private readonly forgotPasswordUseCase: AuthForgotPasswordUseCase,
    private readonly verifyOtpUseCase: AuthVerifyOtpUseCase,
    private readonly resetPasswordUseCase: AuthResetPasswordUseCase
  ) {}

  @ApiBody({ type: AuthLoginDTO, description: 'Required data to login user' })
  @ApiOkResponse({ description: 'User login done successfully' })
  @ApiResponse({ status: 400, description: 'Email or password dont match' })
  @Post('login')
  async login(@Body() data: AuthLoginDTO, @Req() request, @Res() response) {
    const ipAddress = request.ip ?? 'ip not found';
    const res = await this.loginUseCase.execute({ ipAddress, data });
    return response.status(200).json({
      status: true,
      message: 'User login done successfully',
      token: res.token,
      user: UserAdapter.toHttp(res.user),
    });
  }

  @ApiBody({
    type: AuthRegisterDTO,
    description: 'Required data to register user',
  })
  @ApiOkResponse({ description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Email or phone already exists' })
  @Post('register')
  async register(@Body() data: AuthRegisterDTO, @Res() response) {
    const res = await this.registerUseCase.execute(data);
    return response.status(201).json({
      status: true,
      message: 'User registered successfully',
      token: res.token,
      user: UserAdapter.toHttp(res.user),
    });
  }

  @ApiBody({ type: ForgotPasswordDTO })
  @ApiOkResponse({ description: 'OTP sent to email if account exists' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDTO, @Res() response) {
    const res = await this.forgotPasswordUseCase.execute(data.email);
    return response.status(200).json({ status: true, ...res });
  }

  @ApiBody({ type: VerifyOtpDTO })
  @ApiOkResponse({ description: 'OTP is valid' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @Post('verify-otp')
  async verifyOtp(@Body() data: VerifyOtpDTO, @Res() response) {
    const res = await this.verifyOtpUseCase.execute(data);
    return response.status(200).json({ status: true, ...res });
  }

  @ApiBody({ type: ResetPasswordDTO })
  @ApiOkResponse({ description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or payload' })
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDTO, @Res() response) {
    const res = await this.resetPasswordUseCase.execute(data);
    return response.status(200).json({ status: true, ...res });
  }
}
