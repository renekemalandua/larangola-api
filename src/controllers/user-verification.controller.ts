import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    RequestVerificationUseCase,
    ReviewVerificationUseCase,
    GetMyVerificationUseCase,
} from '../usecases/user-verification.usecases';
import {
    SubmitVerificationRequestDTO,
    ReviewVerificationStepRequestDTO,
} from '../dto/user-verification.dto';
import { UserVerificationAdapter } from '../adapters/user-verification.adapter';

@ApiTags('User Verification')
@Controller('verifications')
export class UserVerificationController {
    constructor(
        private readonly requestUseCase: RequestVerificationUseCase,
        private readonly reviewUseCase: ReviewVerificationUseCase,
        private readonly getMyUseCase: GetMyVerificationUseCase
    ) { }

    @Post('submit/:userId')
    @ApiOperation({ summary: 'Submit verification data' })
    @ApiResponse({ status: 201 })
    async submit(
        @Param('userId') userId: string,
        @Body() body: SubmitVerificationRequestDTO,
        @Res() response
    ) {
        try {
            const entity = await this.requestUseCase.execute({ userId, data: body });
            const data = UserVerificationAdapter.toHttp(entity);
            return response.status(201).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Patch('review')
    @ApiOperation({ summary: 'Admin review of a verification step' })
    @ApiResponse({ status: 200 })
    async review(
        @Body() body: ReviewVerificationStepRequestDTO,
        @Req() request,
        @Res() response
    ) {
        try {
            // In a real app, reviewerId comes from the JWT payload
            const reviewerId = request.user?.id ?? 'admin-uuid';
            const entity = await this.reviewUseCase.execute({ reviewerId, data: body });
            const data = UserVerificationAdapter.toHttp(entity);
            return response.status(200).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('status/:userId')
    @ApiOperation({ summary: 'Get verification status of a user' })
    @ApiResponse({ status: 200 })
    async getStatus(@Param('userId') userId: string, @Res() response) {
        try {
            const entity = await this.getMyUseCase.execute(userId);
            if (!entity) {
                return response.status(200).json({ status: true, data: null });
            }
            const data = UserVerificationAdapter.toHttp(entity);
            return response.status(200).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
